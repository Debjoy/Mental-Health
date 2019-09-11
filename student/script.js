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
        
        //element.height($window.innerHeight/3);
    }
  }
});
app.controller('chatList',['$scope','$location','$http','$timeout','$cookies','$window',function($scope,$location,$http,$timeout,$cookies,$window) {
    $scope.LOADING=1;
    var myvalue=0;
    
    
    
    
    if($cookies.get("identity")=='T'){
        $window.location.href = '../teacher';
    }else if($cookies.get("identity")=='S'){
        $http({
                method : "GET",
                url : "../handler/userValid.php?sid="+$cookies.get("id")+"&rand="+$cookies.get("rand")
            }).then(function mySuccess(response) {
            
                if(response.data==-1){
                    $cookies.remove("id");
                    $cookies.remove("rand");
                    $cookies.remove("identity");
                    $window.location.href = '../';
                }else{
                    myvalue=response.data.sid;
                    $scope.Student=response.data;
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
    
    // GETTING SCREEN WIDTH MAKING MOBILE FRIENDLY
    /*
    $scope.mobile={};
    $scope.mobile.showChat=1;
    $scope.mobile.showChatList=1;
    $scope.mobile.showGeneral=1;
    
    $scope.showChatArea=function(){
        $scope.mobile.showChat=1;
        $scope.mobile.showChatList=0;
        $scope.mobile.showGeneral=0;
        console.log("chat area ");
    };
    $scope.showChatListArea=function(){
        $scope.mobile.showChat=0;
        $scope.mobile.showChatList=1;
        $scope.mobile.showGeneral=0;
        console.log("chat list "+$scope.mobile.showChatList+","+$scope.mobile.showChat+","+$scope.mobile.showGeneral);
    };
    $scope.showGeneralArea=function(){
        $scope.mobile.showChat=0;
        $scope.mobile.showChatList=0;
        $scope.mobile.showGeneral=1;
        console.log("general");
    };
    
    
    
    $scope.mobilemode=0;
    angular.element($window).on('resize', function () {
        //console.log($window.innerWidth);
        var innerw=$window.innerWidth;
        if(innerw<=767){
            if($scope.mobilemode==0){
                $scope.mobilemode=1;
                $scope.showChatListArea();
            }
        }else{
            if($scope.mobilemode==1){
                $scope.mobilemode=0;
                $scope.mobile.showChat=1;
                $scope.mobile.showChatList=1;
                $scope.mobile.showGeneral=1;
                console.log("all "+$scope.mobile.showChatList+","+$scope.mobile.showChat+","+$scope.mobile.showGeneral);
            }
        }
    });
    */
    // GETTING SCREEN WIDTH MAKING MOBILE FRIENDLY
     
    $scope.texting={};
     /*$http({
                method : "GET",
                url : "../handler/chatlist.php?sid="+myvalue
            }).then(function mySuccess(response) {
                $scope.chatlist = response.data;
            }, function myError(response) {
                console.log(response.statusText);
            });
*/
    $firstloading=1;
    $scope.chatlistLoader=function(){
        $http({
                method : "GET",
                url : "../handler/chatlist.php?sid="+myvalue
            }).then(function mySuccess(response) {
                $scope.chatlist = response.data;
             
                if($firstloading==1){
                    $firstloading=0;
                    $scope.chatloader($scope.chatlist[0].chatid,$scope.chatlist[0].name);
                }
            }, function myError(response) {
                console.log(response.statusText);
            });
    }
    
    
    
    /****NEW CHAT********** */
    $scope.departments = ['CSE', 'IT', 'ECE', 'EE'];
    $scope.selectedDept=$scope.departments[0];
    $scope.selectedOption = function(){
    
        
        $http({
                method : "GET",
                url : "../handler/selTeacher.php?dept="+$scope.selectedDept
            }).then(function mySuccess(response) {
                $scope.teacherOptions=response.data;
            }, function myError(response) {
                console.log(response.statusText);
            });
    };
    $scope.selectedOption();
    $scope.createChat=function(){
        $scope.newmsg.sid=myvalue;
        console.log($scope.newmsg);
        
      $http({
                method : "GET",
                url : "../handler/newChat.php?msg="+$scope.newmsg.msg+"&sid="+$scope.newmsg.sid+"&tid="+$scope.newmsg.tid
            }).then(function mySuccess(response) {
                if(response.data=="7"){
                    $scope.showAlert('Chat Created');
                }else if(response.data=="-1"){
                   $scope.showAlert('New chat of same instance cannot be created'); 
                }else{
                    $scope.showAlert('error');
                    console.log(response.data);
                }
            }, function myError(response) {
                console.log(response.statusText);
            });
        
    };
    
    /****NEW CHAT END********** */
    
    
    
    $scope.lastchat=-1;//new
    var runningChat;
    var longpolcount=0;
    var fetchChat=0;
    var hambergur=0;
    $scope.alreadyloaded=0;
    $scope.chatloadstarted=0;
    $scope.chatloader = function(chatid,teachername) {
        $scope.texting.msg="";
        //console.log(window.innerHeight);
        $scope.openchatid=chatid;
        $scope.alreadyloaded=0;
        $scope.chatloadstarted=1;
        $scope.teachername="...";
        fetchChat=1;
         $http({
                method : "GET",
                url : "../handler/chatload.php?chat="+chatid+"&fetch="+fetchChat+"&from=S"
            }).then(function mySuccess(response) {
                $scope.chatload = response.data;
                if($scope.lastchat<$scope.chatload[$scope.chatload.length-1].mid)
                $scope.lastchat=$scope.chatload[$scope.chatload.length-1].mid;
                    
                $scope.teachername=teachername;
             $scope.chatlistLoader();
                scrolldown();
                if(runningChat!=chatid){
                    runningChat=chatid;
                    getData(++longpolcount);
                }
             $scope.chatloadstarted=0;
             if($scope.chatload.length<=9){
             $scope.loadinganime=0;
             $scope.alreadyloaded=1;
             }
             if(hambergur==0){
                 hambergur=1;
             $timeout(function () {
          showChatListArea(); 
      }, 50);}
             //$scope.startchat();
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
    
     $scope.endchatview=function(){
         $scope.chatview="hideme";
         $scope.listview="";
     };
   $scope.startchat=function(){
         $scope.chatview="";
         $scope.listview="hideme";
     };
    
    $scope.sendMessage = function(){
        //console.log("sent msg "+$scope.texting.msg);
        if($scope.texting.msg=="")return;
        $scope.texting.chat=$scope.openchatid;
        $scope.texting.from='S';
        $scope.texting.last=$scope.chatload[$scope.chatload.length-1].msgno;
        
        var res = $http.post('../handler/chatsend.php', $scope.texting).then(function(data, status, headers, config) {
            //console.log(data.data);
            //Array.prototype.push.apply($scope.chatload,data.data);
		},function(data, status, headers, config) {
			console.log( "failure sending ");
		});
        $scope.texting={};
    }
   
     /******POLLING******/
     var loadTime = 1000,errorCount = 0,loadPromise;
var scrolldown=function(){
        
        var delayInMilliseconds = 10; //1 second

        setTimeout(function() {
            var container=document.getElementsByClassName("chatarea")[0];
            //console.log("lel");
            container.scrollTop = container.scrollHeight;
            document.getElementById("typingbox").focus();
        }, delayInMilliseconds);
        
    }
  var getData = function(pollC) {
      $scope.LOADING=0;
    $http.get("../handler/lastnewchats.php?chat="+$scope.openchatid+"&mid="+$scope.lastchat+"&sid="+myvalue )
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
        menu[i].className="menu-items menu-items-show";
    }
    console.log("bring_menu");
}
function close_menu(){
    var menu=document.getElementsByClassName("menu-items");
    for(var i=0;i<menu.length;i++){
        menu[i].className="menu-items";
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
