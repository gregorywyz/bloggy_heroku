BloggyApp.controller('PostShowCtrl',['$scope','$rootScope','Post','AlertService','$routeParams','PostComment','UserService',function($scope,$rootScope,Post,AlertService,$routeParams,PostComment,UserService){

  $scope.UserService = UserService;

  $scope.$watchCollection('UserService',function(){
    $scope.currentUser = UserService.currentUser;
  });

  $rootScope.loading = true;

  console.log("post show controller here")

  Post.get({id:$routeParams.id},function(data){
    console.log('post:',data);
    $scope.post = data;
    $rootScope.loading = false;
  })

  $scope.addComment = function(){
    var comment = new PostComment();
    comment.body = $scope.commentText;
    comment.$save({postId:$scope.post.id},function(data){
      $scope.post = data;
      $scope.commentText = '';
    });
  }

}]);