function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("foot").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("foot").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}
shopping.controller("maincontroller", function($scope,$location,$anchorScroll){
 //$scope.mobi=true;
 $scope.mob = function(){
  //alert('yeah');
  closeNav();
  openNav();
  $scope.mobi =true;
  console.log("mobi"+$scope.mobi);
  $scope.tabi =false;
  console.log("tabi"+$scope.tabi);
  $scope.tvi = false;
  console.log("tvi"+$scope.tvi);
 }
 
 $scope.tab =function(){
  closeNav();
  openNav();
  $scope.mobi =false;
  console.log("mobi"+$scope.mobi);
  $scope.tabi = true;
  console.log("tabi"+$scope.tabi);
  $scope.tvi = false;
  console.log("tvi"+$scope.tvi);
 }
 
  $scope.tv =function(){
  closeNav();
  openNav();
  $scope.mobi =false;
  console.log("mobi"+$scope.mobi);
  $scope.tabi = false;
  console.log("tabi"+$scope.tabi);
  $scope.tvi = true;
   console.log("tvi"+$scope.tvi);
 }
  $scope.goToAbout = function(){
   $location.hash("about");
   $anchorScroll();
  }
  $scope.goToContact = function(){
   $location.hash("contact");
   $anchorScroll();
  }
});