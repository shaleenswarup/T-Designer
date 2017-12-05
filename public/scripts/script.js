   

'use strict';

angular.module('Tee-Designer', [])
.controller('mainController',mainController).config(['$httpProvider', function ($httpProvider) {
   $httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
}]).directive('myDirective', ['$window', function ($window) {

     return {
        link: link,
        restrict: 'A'           
     };

     function link(scope, element, attrs){
    //      var canvasDiv = $('.design-container');
    
    angular.element(element[0]).on("click", function (e) {
            //   angular.forEach(, function(button){});
            //         $(item).empty();
            //         if ($(item).hasClass("activeTool")) {
            //             $(item).append(activesvgs[index])
            //         }
            //         else {
            //             $(item).append(nonactivesvgs[index])
            //         }
            //     });
                //alert("hit"+e.target)
                // angular.element(document.querySelectorAll('canvas')).css("pointer-events", "none");
                 angular.element(document.querySelectorAll('.list-group-item')).removeClass("active");
                 angular.element(element[0]).addClass("active");
                
                
            });
 

    //     var height = $(canvasDiv).innerHeight() ; //inner container height minus 15px for the bottom padding
    //     var width = $(canvasDiv).innerWidth() ;
    //      $(".canvas-container").width(width);
    //      $(".canvas-container").height(height);
       
    //     //  $("#canvas,.upper-canvas").attr("width", width);
    //     //  $("#canvas,.upper-canvas").attr("height",height)
    //     //  $("#canvas,.upper-canvas").width(width);
    //     //  $("#canvas,.upper-canvas").height(height);
       
    //   angular.element($window).bind('resize', function(){
     
    // //   $("#canvas,.upper-canvas").attr("width", width);
    // //      $("#canvas,.upper-canvas").attr("height",height)
    // //       $("#canvas,.upper-canvas").width(width);
    // //      $("#canvas,.upper-canvas").height(height);
    // //       $(".canvas-container").width(width);
    // //      $(".canvas-container").height(height);


     }    
 }]);

mainController.$inject = ['$scope','$http','$compile'];
function mainController($scope, $http,$compile) {

      var canvasDiv = $('.design-container');
     
       var height = $(window).innerHeight()*0.9 ; 
        var width = $(window).innerWidth()*0.75 ;

$scope.activemenu='';
$scope.canvas =  new fabric.Canvas('canvas');
$scope.canvas.setDimensions({width:width, height:height});
    // $scope.canvas.setHeight(height);
    //       $scope.canvas.setWidth(width);
//       canvas.calcOffset();
    $scope.savedname;
    $scope.Added=false;
     $scope.notext=false;
    
    $scope.add = function() {
    var f = document.getElementById('file').files[0],
        r = new FileReader();

    r.onload = function(e) {
      var data = e.target.result;
        // $scope.canvas.setDimensions({width:width, height:height});
      fabric.Image.fromURL(data, function(oImg) {
    oImg.set({
     
        width : $scope.canvas.width / 2,
        height :$scope.canvas.height / 2,
        top:$scope.canvas.height / 4,
        left:$scope.canvas.width / 4
    });
      $scope.canvas.add(oImg);
                })
    }

    r.readAsDataURL(f);
}
$scope.changeimage=function(){
    
    $scope.Added=true;
}
  $scope.readText=function(input){
      
      //  var canvas = new fabric.Canvas('canvas');
    if(input){
        var text = new fabric.Text(input,{top:$scope.canvas.height / 4,
        left:$scope.canvas.width / 4});
        //   canvas.setDimensions({width:width, height:height});
      $scope.canvas.add(text);
        
    }
      
  }
 $scope.submit= function(){

      var json = JSON.stringify( $scope.canvas.toJSON() );

 if(!$scope.savedname==" "){
         $http({
        url: '/',
        method: "POST",
        data:{ "name":$scope.savedname ,"designdata": json }
    })
    .then(function(response) {
            // success
            var designdata=response.data.inserteddata.designdata;
            var btnhtml = $compile("<a class='list-group-item' my-directive ng-click='loadCanvas($event,"+ designdata+")'><div class='delete'>"+response.data.inserteddata.name+"</div><button class='btn btn-danger btn-md' ng-click='deleteDesign($event,"+response.data.id+")'><span class='glyphicon glyphicon-trash'></span></button></a>")($scope);
           
   
             
             angular.element(document.querySelector('.list-group')).append(btnhtml);
             $scope.saved=true;
             $scope.text==" "
           
    }, 
    function(response) { // optional
            // failed
            
    });
        
    }
    else{
        
        $scope.notext=true;
     
    
        
    }
   
   }
   $scope.deleteDesign=function($event,name){
       //$httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
        
    $http({
        url: '/',
        method: "DELETE",
        data:{ "name": name }
    })
    .then(function(response) {
            // success
            //angular.element(document.querySelector('.delete')).remove( ":contains('"+response.data+"')" );
            $event.target.parentElement.parentElement.remove();
            $event.stopPropagation();
          console.log("deleted");
           
    }, 
    function(response) { // optional
            // failed
    });
      // 
   }
   
   $scope.loadCanvas= function($event,json) {
    //   angular.forEach($scope.employees, function (value, key) {});
//     //   angular.element(".list-group").addClass("active");
//     var els = angular.element('.list-group');
//   angular.forEach(els, function( el ){
//   el.addClass('active')
// })
  $scope.canvas.clear();
  // parse the data into the $scope.canvas
  $scope.canvas.loadFromJSON(json);

  // re-render the $scope.canvas
  $scope.canvas.discardActiveGroup();
  $scope.canvas.renderAll();

}
$scope.clear=function(){
    
    $scope.canvas.clear();
    
}
$scope.changedesignname=function(text){
    
    if(text){
                
        $scope.notext=false;
     }
    
}
 
}





      
      