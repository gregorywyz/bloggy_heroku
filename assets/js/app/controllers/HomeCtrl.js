BloggyApp.controller('HomeCtrl',['$scope','$rootScope','Post','AlertService',function($scope,$rootScope,Post,AlertService){

  console.log('HomeCtrl is loaded');

  $rootScope.loading = true;

  $scope.posts = [];

  $scope.createPost = function(){
    var post = new Post();
    post.title = "My new post title";
    post.body = "This is my new post body";
    post.$save(function(data){
      console.log("new post saved:",data);
      // $scope.loadPosts();
    });
  }

  $scope.showPost = function(postId){
    Post.get({id: postId}, function(data){
      console.log('showing post',data);
    });
  }

  $scope.deletePost = function(postId){
    Post.delete({id: postId}, function(data){
      console.log('deleted post:',data);
      AlertService.add('info','The post "' + data.title + '" was deleted.');
      // $scope.loadPosts();
    });
  }

  $scope.loadPosts = function(){
    // socketIO way
    io.socket.get('/api/post',function(data, jwRes){
      // console.log('data from socket:',data)
      $scope.$evalAsync(function(){
        $scope.posts = data;
        $rootScope.loading = false;
      });
    });

    // Original way
    // Post.query(function(data){
    //   $scope.posts = data;
    //   $rootScope.loading = false;
    // });

  }

  $scope.loadPosts();

  io.socket.on('post',function(msg){
    console.log('msg:',msg)
    if (msg && msg.verb) {
      switch (msg.verb) {
        case 'created':
          $scope.$evalAsync(function(){
            $scope.posts.push(msg.data);
          });
          break;
        case 'updated':
          $scope.$evalAsync(function(){
            for (var i = 0; i < $scope.posts.length; i++) {
              if ($scope.posts[i].id == msg.id) {
                for (var key in msg.data) {
                  $scope.posts[i][key] = msg.data[key];
                }
                break;
              }
            }
          });
          break;
        case 'destroyed':
          $scope.$evalAsync(function(){
            for (var i = 0; i < $scope.posts.length; i++) {
              if ($scope.posts[i].id == msg.id) {
                $scope.posts.splice(i,1);
                break;
              }
            }
          });
          break;
      }
    }
  });



  // $http.get('/api/post').success(function(data){
  //   console.log(data);
  //   $scope.posts = data;
  // });

}]);
