   

'use strict';

angular.module('Tee-Designer', [])
.controller('mainController',mainController).config(['$httpProvider', function ($httpProvider) {
   $httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
}]).directive('myDirective', [ function () {

     return {
        link: link,
        restrict: 'A'           
     };

     function link(scope, element, attrs){
   
    
            angular.element(element[0]).on("click", function (e) {
                 angular.element(document.querySelectorAll('.list-group-item')).removeClass("active");
                 angular.element(element[0]).addClass("active");
                
                
            });
 



     }    
 }]);

mainController.$inject = ['$scope','$http','$compile'];
function mainController($scope, $http,$compile) {

var canvasDiv = $('.design-container');
var height = $(window).innerHeight()*0.9 ; 
var width = $(window).innerWidth()*0.75 ;
        
$scope.state; // past states
$scope.undostates = [];// reverted states
$scope.redostates = [];        
$scope.loader=false;
$scope.savedname;
$scope.Added=false;
$scope.notext=false;
$scope.undodisable=false;
$scope.redodisable=false;
$scope.activemenu='';
$scope.currentdesignarray=[];
$scope.canvas =  new fabric.Canvas('canvas');
$scope.canvas.setDimensions({width:width, height:height});
$scope.canvas.on('object:modified', function() {
             save();
          });
function save() {
          // clear the redo stack
          $scope.redostates = [];
          $('#redo').prop('disabled', true);
          // initial call won't have a state
          if ($scope.state) {
          $scope.undostates.push($scope.state);
          $scope.currentdesignarray.push($scope.state);
            $('#undo').prop('disabled', false);
            
          }
          $scope.state = JSON.stringify($scope.canvas);
        }
function replay(playStack, saveStack, buttonsOn, buttonsOff) {
          saveStack.push($scope.state);
          $scope.state = playStack.pop();
          var on = $(buttonsOn);
          var off = $(buttonsOff);
          // turn both buttons off for the moment to prevent rapid clicking
          on.prop('disabled', true);
          off.prop('disabled', true);
          if($scope.state){
          $scope.canvas.clear();
          $scope.canvas.loadFromJSON($scope.state, function() {
            $scope.canvas.renderAll();
            // now turn the buttons back on if applicable
            on.prop('disabled', false);
            if (playStack.length) {
              off.prop('disabled', false);
            }
          });
          }
        }
    
$scope.add = function() {
    var f = document.getElementById('file').files[0],
        r = new FileReader();

    r.onload = function(e) {
      var data = e.target.result;
        // $scope.canvas.setDimensions({width:width, height:height});
      fabric.Image.fromURL(data, function(oImg) {
    oImg.set({
     
        width:$scope.canvas.width / 2,
        height:$scope.canvas.height / 2,
        top:$scope.canvas.height / 4,
        left:$scope.canvas.width / 4
    });
      $scope.canvas.add(oImg);
      save()
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
      save();
        
    }
      
  }
 $scope.submit= function(){

      var json = JSON.stringify( $scope.canvas.toJSON() );
      

 if(!$scope.savedname==" "){
     $scope.loader=true;
         $http({
        url: '/',
        method: "POST",
        data:{ "name":$scope.savedname ,"designdata": json }
    })
    .then(function(response) {
            // success
            
            var designdata=response.data.inserteddata.designdata;
            var btnhtml = $compile("<a class='list-group-item' my-directive ng-click='changecurrentstate();loadCanvas($event,"+ designdata+")'><div class='delete'>"+response.data.inserteddata.name+"</div><button class='btn btn-danger btn-md' ng-click='deleteDesign($event,"+response.data.id+")'><span class='glyphicon glyphicon-trash'></span></button></a>")($scope);
            $scope.currentdesign=true;
   
             
             angular.element(document.querySelector('.list-group')).append(btnhtml);
             $scope.saved=true;
             $scope.text==" ";
             $scope.loader=false;
           $scope.savedname="";
    }, 
    function(response) { // optional
            // failed
             $scope.loader=false;
    });
        
    }
    else{
        
        $scope.notext=true;
     
    
        
    }
   
   }
   $scope.deleteDesign=function($event,name){
      
         $event.stopPropagation();
          $scope.loader=true;
    $http({
        url: '/',
        method: "DELETE",
        data:{ "name": name }
    })
    .then(function(response) {
            // success
            
            $event.target.parentNode.remove();
             $scope.loader=false;
           //
          console.log("deleted");
           
    }, 
    function(response) { 
            // failed
            console.log("Failed");
    });
      // 
   }
   
 $scope.loadCanvas= function($event,json) {
     if(!$scope.currentdesign){
           $('#redo').prop('disabled', true);
       $('#undo').prop('disabled', true);
     
     }

  $scope.canvas.clear();
  // parse the data into the $scope.canvas
  $scope.canvas.loadFromJSON(json);

  // re-render the $scope.canvas
  
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
$scope.undo=function() {
            replay($scope.undostates, $scope.redostates, '#redo', '#undo');
          }

$scope.redo=function() {
               replay($scope.redostates, $scope.undostates, '#undo', '#redo');
          }
    
 $scope.changecurrentstate=function (){
     
     $scope.currentdesign=false;
  
 }
 $scope.gotocurrentdesign=function(){
     
     $scope.undostates=$scope.currentdesignarray;
     $('#undo').prop('disabled', false);
       $scope.canvas.loadFromJSON($scope.state, function() {
            $scope.canvas.renderAll();
            
          });
 }
}





      
      