var app = angular.module('chatLoginApp', ['ngCookies']);
app.controller("loginForms",['$scope','$window','$http','$cookies',function($scope,$window,$http,$cookies){
    
   if($cookies.get("identity")==='S'){
       console.log("lol");
       $window.location.href = '/student';
   }else if($cookies.get("identity")==='T'){
       $window.location.href = '/teacher';
   }
    //STUDENT
   $scope.studLogin={email: "", pass: ""};
    $scope.errorStud="";
    
    $scope.validStudent=function(){
       if($scope.studLogin.email=="" && $scope.studLogin.pass=="")
            $scope.errorStud ="*Email and password field is empty*";
        else if($scope.studLogin.pass=="")
            $scope.errorStud ="*Password field is empty*";
        else if($scope.studLogin.email=="")
            $scope.errorStud ="*Email field is empty*";
        else{
            
            $http({
                method : "GET",
                url : "../handler/passCheck.php?smail="+$scope.studLogin.email+"&pass="+$scope.studLogin.pass
            }).then(function mySuccess(response) {
                if(response.data!=-1){
                    $cookies.put("id", response.data.id);
                    $cookies.put("rand", response.data.rand);
                    $cookies.put("identity", response.data.identity);
                    $window.location.href = '/student';
                    $scope.errorStud="*valid email password*";
                }else{
                    $scope.errorStud="*Invalid email/ password*";
                }
                
                
            }, function myError(response) {
                console.log(response.statusText);
            });
            
            
            
        }
    };
    
    
    
    //TEACHER
    $scope.teachLogin={email: "", pass: ""};
    $scope.errorTeach="";
    
    $scope.validTeacher=function(){
       if($scope.teachLogin.email=="" && $scope.studLogin.pass=="")
            $scope.errorTeach ="*Email and password field is empty*";
        else if($scope.teachLogin.pass=="")
            $scope.errorTeach ="*Password field is empty*";
        else if($scope.teachLogin.email=="")
            $scope.errorTeach ="*Email field is empty*";
        else{
            $http({
                method : "GET",
                url : "../handler/passCheck.php?tmail="+$scope.teachLogin.email+"&pass="+$scope.teachLogin.pass
            }).then(function mySuccess(response) {
                if(response.data!=-1){
                    $cookies.put("id", response.data.id);
                    $cookies.put("rand", response.data.rand);
                    $cookies.put("identity", response.data.identity);
                    $window.location.href = '/teacher';
                    $scope.errorTeach="*valid email password*";
                }else{
                    $scope.errorTeach="*Invalid email/ password*";
                }
                
                
            }, function myError(response) {
                console.log(response.statusText);
            });
            
        }
    };
}]);