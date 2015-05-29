BloggyApp.controller('NavCtrl',['$scope','$rootScope','AlertService','$modal','UserService',function($scope,$rootScope,AlertService,$modal,UserService){

  console.log('NavCtrl is loaded');

  $scope.UserService = UserService;
  console.log('UserService',UserService)

  $scope.showLogin = function(){
    $modal.open({
      templateUrl: '/views/auth/loginModal.html',
      controller: 'AuthLoginModalCtrl'
    })
  };

  $scope.logout = function(){
    UserService.logout(function(err, data){
      console.log('logout:',data)
    });
  };

  $scope.$watchCollection('UserService',function(){
    $scope.currentUser = UserService.currentUser;
  });

}]);