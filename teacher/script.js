var app = angular.module('chatApplication', ['ngCookies']);

app.config( [ '$locationProvider', function( $locationProvider ) {
   // In order to get the query string from the
   // $location object, it must be in HTML5 mode.
   $locationProvider.html5Mode( true );
}]);
app.directive('enterSubmit', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
       
        elem.bind('keydown', function(event) {
          var code = event.keyCode || event.which;
                  
          if (code === 13) {
            if (!event.shiftKey) {
              event.preventDefault();
              scope.$apply(attrs.enterSubmit);
            }
          }
        });
      }
    }
  });
app.directive('setHeight', function($window){
  return{
    link: function(scope, element, attrs){
        element.css('height', $window.innerHeight-182 + 'px');
        angular.element($window).on('resize', function () {
    element.css('height', $window.innerHeight-182 + 'px');
});
    }
  }
});
app.controller('chatList',['$scope','$location','$http','$timeout','$cookies','$window',function($scope,$location,$http,$timeout,$cookies,$window) {
    
     $scope.LOADING=1;
    var myvalue=0;
    if($cookies.get("identity")=='S'){
        $window.location.href = '../student';
    }else if($cookies.get("identity")=='T'){
        $http({
                method : "GET",
                url : "../handler/userValid.php?tid="+$cookies.get("id")+"&rand="+$cookies.get("rand")
            }).then(function mySuccess(response) {
            
                if(response.data==-1){
                    $cookies.remove("id");
                    $cookies.remove("rand");
                    $cookies.remove("identity");
                    $window.location.href = '../';
                    console.log(myvalue);
                }else{
                    myvalue=response.data.tid;
                    $scope.Teacher=response.data;
                    $scope.chatlistLoader();
                    console.log(myvalue);
                }
                
            }, function myError(response) {
                console.log(response.statusText);
            })
    }else{
        $window.location.href = '../';
    }
    $scope.logout=function(){
        $cookies.remove("id");
        $cookies.remove("rand");
        $cookies.remove("identity");
        $window.location.href = '../';
    }
    
    //SHOW ALERT
    $scope.alertMsgShow=0;
    $scope.alertMsg="";
    
    $scope.showAlert=function(alertMessage){
        $scope.alertMsg=alertMessage;
      //console.log("function called");
      $scope.alertMsgShow=1;  
      $timeout(function () {
          $scope.alertMsgShow=0; 
      }, 3000);
    };
    //SHOW ALERT
     
    $firstloading=1;
    $scope.texting={};
    
    $scope.chatlistLoader=function(){
        $http({
                method : "GET",
                url : "../handler/chatlist.php?tid="+myvalue
            }).then(function mySuccess(response) {
                $scope.chatlist = response.data;
                if($firstloading==1){
                    $firstloading=0;
                    $scope.chatloader($scope.chatlist[0].chatid,$scope.chatlist[0].ran,$scope.chatlist[0].alias);
                }
            }, function myError(response) {
                console.log(response.statusText);
            });
    }
    
    $scope.lastchat=-1;
    var hambergur=0;
    var runningChat;
    var longpolcount=0;
    var fetchChat=0;
    $scope.alreadyloaded=0;
    $scope.loadinganime=0;
     $scope.chatloadstarted=0;
    $scope.chatloader = function(chatid,ran,alias) {
        $scope.openchatid=chatid;
        $scope.alreadyloaded=0;
        $scope.chatloadstarted=1;
        fetchChat=1;
        $scope.ran="...";
        $scope.alias="";
        $scope.texting.msg="";
        $scope.loadinganime=0;
         $http({
                method : "GET",
                url : "../handler/chatload.php?chat="+chatid+"&fetch=1&from=T"
            }).then(function mySuccess(response) {
                $scope.chatload = response.data;
             $scope.loadinganime=0;
             if($scope.lastchat<$scope.chatload[$scope.chatload.length-1].mid)
             $scope.lastchat=$scope.chatload[$scope.chatload.length-1].mid;
               scrolldown();
                $scope.ran=ran;
                $scope.alias=alias;
             if($scope.chatload.length<=9){
             $scope.loadinganime=0;
             $scope.alreadyloaded=1;
             }
             $scope.chatlistLoader();
                if(runningChat!=chatid){
                    runningChat=chatid;
                    getData(++longpolcount);
                }
              $scope.chatloadstarted=0;
             if(hambergur==0){
                 hambergur=1;
             $timeout(function () {
          showChatListArea(); 
                
      }, 50);}
             $scope.LLimitReport=parseInt($scope.chatload[$scope.chatload.length-1].mid)+1;
             
            }, function myError(response) {
                console.log(response.statusText);
            });
    };
   
    $scope.loadinganime=0;
    $scope.chatloadmore=function(){
        fetchChat++;
        $scope.loadinganime=1;
        $http({
                method : "GET",
                url : "../handler/chatload.php?chat="+$scope.openchatid+"&fetch="+fetchChat+"&from=S"
            }).then(function mySuccess(response) {
            //
            if(response.data.length==0){
                $scope.alreadyloaded=1;
            }
            Array.prototype.push.apply(response.data, $scope.chatload);
             $scope.chatload = response.data;
            $scope.loadinganime=0;
        }, function myError(response) {
                console.log(response.statusText);
            });
    };
    
    
    $scope.sendMessage = function(){
        //console.log("sent msg "+$scope.texting.msg);
        if($scope.texting.msg=="")return;
        $scope.texting.chat=$scope.openchatid;
        $scope.texting.from='T';
        $scope.texting.last=$scope.chatload[$scope.chatload.length-1].msgno;
        
        var res = $http.post('../handler/chatsend.php', $scope.texting).then(function(data, status, headers, config) {
            //console.log(data.data);
           // Array.prototype.push.apply($scope.chatload,data.data);
		},function(data, status, headers, config) {
			console.log( "failure sending ");
		});
        $scope.texting={};
    }
    /****** CHANGE ALIAS NAME ******/
    $scope.aliasName="";
    $scope.changeAliasName=function(){
        console.log($scope.aliasName);
        $scope.aliasName=$scope.aliasName.trim();
        
        $http({
                method : "GET",
                url : "../handler/setAlias.php?chat="+$scope.openchatid+"&new="+$scope.aliasName
            }).then(function mySuccess(response) {
                    if(response.data!="-1"){
                        $scope.alias=response.data;
                        $scope.chatlistLoader();
                    }
            
            
            }, function myError(response) {
                console.log(response.statusText);
            });
        
    };
    
    
    /******   REPORT CHAT   *****/
    
    
    
    
    $scope.ULimitReport=-1;
    $scope.LLimitReport=99999;
    $scope.ShowReportCheckbox=0;
    $scope.toggleReport=function(index){
        if($scope.ULimitReport==parseInt(index)){
            $scope.ULimitReport=-1;
            return;
        }
        else if($scope.LLimitReport==parseInt(index)){
            $scope.LLimitReport=parseInt($scope.chatload[$scope.chatload.length-1].mid)+1;
            return;
        }
        if($scope.ULimitReport==-1){
            $scope.ULimitReport=parseInt(index);
        }
        else if($scope.LLimitReport==parseInt($scope.chatload[$scope.chatload.length-1].mid)+1){
            $scope.LLimitReport=parseInt(index);
        }
        
    };
    $scope.ReportCancel=function(){
        $scope.ULimitReport=-1;
        $scope.LLimitReport=parseInt($scope.chatload[$scope.chatload.length-1].mid)+1;
        $scope.ShowReportCheckbox=0;
    }
    $scope.submitReport=function(){
        $scope.reportMessage={}
        $scope.reportMessage.startmid=$scope.ULimitReport;
        if($scope.LLimitReport==parseInt($scope.chatload[$scope.chatload.length-1].mid)+1){
            $scope.reportMessage.endmid=-1;
        }else{
            $scope.reportMessage.endmid=$scope.LLimitReport;
        }
        $scope.reportMessage.chatid=$scope.openchatid;
        $scope.reportMessage.msg=$scope.reportMsg;
        $scope.ReportCancel();
        console.log($scope.reportMessage);
        
        //UPLOAD THE FUCKING REPORT YOU FUCKING FAGOT!!
    };
    
    
    
    /*$scope.ssemsg = {};

        // handles the callback from the received event
    var handleCallback = function (msg) {
        $scope.$apply(function () {
            $scope.ssemsg = JSON.parse(msg.data);
            var check=$scope.ssemsg.chatid.find(function(val){
                return val==$scope.openchatid;
            })
            if (typeof check !== 'undefined'){
                $scope.getLast($scope.chatload[$scope.chatload.length-1].msgno);
                console.log("chat list updated");
            }
            
            //console.log(JSON.parse(msg.data));
        });
    }

    var source = new EventSource('../handler/triggerlist.php');
    source.addEventListener('message', handleCallback, false);*/
     
     
    /*$scope.getLast = function(last){
        console.log("called");
        $http({
                method : "GET",
                url : "../handler/lastchat.php?chat="+$scope.openchatid+"&last="+last ,
                timeout : 0
            }).then(function mySuccess(response) {
                if(response.data.length!=0)
                Array.prototype.push.apply($scope.chatload, response.data);
            
                $scope.getLast($scope.chatload[$scope.chatload.length-1].msgno);  
            }, function myError(response) {
                console.log(response.statusText);
            });
    };*/
    
    /******POLLING******/
     var loadTime = 1000,errorCount = 0,loadPromise;
    var scrolldown=function(){
        
        var delayInMilliseconds = 10; //1 second

        setTimeout(function() {
            var container=document.getElementsByClassName("chatarea")[0];
            console.log("lel");
            container.scrollTop = container.scrollHeight;
            document.getElementById("typingbox").focus();
        }, 10);
        
    }
  var getData = function(pollC) {
       $scope.LOADING=0;
    $http.get("../handler/lastnewchats.php?chat="+$scope.openchatid+"&mid="+$scope.lastchat+"&tid="+myvalue)
    .then(function(res) {
       
            if(pollC != longpolcount){
                return;
            }
            if(res.data.messages.length!=0){
                    Array.prototype.push.apply($scope.chatload, res.data.messages);
                    
            }
        if(res.data.lastmid!=-1)
          $scope.lastchat=res.data.lastmid;
        $scope.chatlistLoader();
        errorCount = 0;
        scrolldown();
      nextLoad(undefined,pollC);
    })
    .catch(function(res) {
      $scope.data = 'Server error';
      nextLoad(++errorCount * 2 * loadTime,pollC);
    });
  };

  var cancelNextLoad = function() {
    $timeout.cancel(loadPromise);
  };

  var nextLoad = function(mill,pollC) {
    mill = mill || loadTime;

    //Always make sure the last timeout is cleared before starting a new one
    cancelNextLoad();
    loadPromise = $timeout(getData(pollC), mill);
  };


  //Start polling the data from the server
 // getData();


  //Always clear the timeout when the view is destroyed, otherwise it will keep polling and leak memory
  $scope.$on('$destroy', function() {
    cancelNextLoad();
  });

  $scope.data = 'Loading...';
    
    /**********END OF POLLING**********/
    
    
    
    
}]);


/***MOBILE FRIENDLY MAKING**/
var mobilemode=0;
window.onresize = setEqualHeight;
function showChatArea(){
    if(window.innerWidth>767){
    return;
}
console.log("inside");
        document.getElementById("chatListArea").style.display = "none";
        document.getElementById("chatArea").style.display = "block";
        document.getElementById("generalArea").style.display = "none";
        document.getElementsByClassName("menu-button")[0].style.display="block";
        close_menu();
    }
function showChatListArea(){
    if(window.innerWidth>767){
        document.getElementsByClassName("menu-button")[0].style.display="none";
    return;}
        document.getElementById("chatListArea").style.display = "block";
        document.getElementById("chatArea").style.display = "none";
        document.getElementById("generalArea").style.display = "none";
        document.getElementsByClassName("menu-button")[0].style.display="block";
    
        close_menu();
    }
function showGeneralArea(){
if(window.innerWidth>767){
    return;
}
    
        document.getElementById("chatListArea").style.display = "none";
        document.getElementById("chatArea").style.display = "none";
        document.getElementById("generalArea").style.display = "block";
        document.getElementsByClassName("menu-button")[0].style.display="block";
        close_menu();
    }

function bring_menu(){
    var menu=document.getElementsByClassName("menu-items");
    for(var i=0;i<menu.length;i++){
         menu[i].classList.add("menu-items-show");
        
    }
    console.log("bring_menu");
}
function close_menu(){
    var menu=document.getElementsByClassName("menu-items");
    for(var i=0;i<menu.length;i++){
        menu[i].classList.remove("menu-items-show");
    }
}
    
function setEqualHeight(){
    
    var innerw=window.innerWidth;
    if(innerw<=767){
    if(mobilemode==0){
        mobilemode=1;
        showChatListArea();
    }
    }else{
        if(mobilemode==1){
            mobilemode=0;
            document.getElementById("chatListArea").style.display = "block";
            document.getElementById("chatArea").style.display = "block";
            document.getElementById("generalArea").style.display = "block";
            document.getElementsByClassName("menu-button")[0].style.display="none";
            close_menu();
        }
    }
}

/***MOBILE FRIENDLY MAKING**/