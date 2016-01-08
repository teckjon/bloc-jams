 var pointsArray = document.getElementsByClassName('point');
 
 var animatePoints = function(points) {
 
     var revealPoint = function(list) {
         points[list].style.opacity = 1;
         points[list].style.transform = "scaleX(1) translateY(0)";
         points[list].style.msTransform = "scaleX(1) translateY(0)";
         points[list].style.WebkitTransform = "scaleX(1) translateY(0)";
     };
     
     for (var a = 0; a < points.length; a++) {
        revealPoint(a);
     }
 };

     var revealPoint = function(list) {
         list.style.opacity = 1;
         list.style.transform = "scaleX(1) translateY(0)";
         list.style.msTransform = "scaleX(1) translateY(0)";
         list.style.WebkitTransform = "scaleX(1) translateY(0)";
     };
     
window.onload = function() {      
     if (window.innerHeight > 950) {
         forEach(pointsArray,revealPoint);
     }
         
        var sellingPoints = document.getElementsByClassName('selling-points')[0];      
        var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;         
        
         window.addEventListener('scroll', function(event) {
         if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             forEach(pointsArray,revealPoint);
             //animatePoints(pointsArray);   
         }
     });   
 };