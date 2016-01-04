 var animatePoints = function() {
 
     var points = document.getElementsByClassName('point');
 
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