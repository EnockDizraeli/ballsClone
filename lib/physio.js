let Physio = (() => {
   
   function isInRange(value, min, max){
      return ( (value >= min) && (value <= max) );
   }
   
   return {
      isInRange
   }
})();

Physio.Circle = (() => {
    function Circle(center, radius){
       this.center = center;
       this.radius = radius;
       this.type = "circle";
    }
    
    Circle.prototype = {
        /*--Essentially a facade--*/
        boundTest(body){
           if (body.type === "circle"){
              return this.boundCircleTest(body);
           }else if(body.type === "rectangle"){
              return this.boundRectTest(body);
           }else{
              return false;
           }
        },
        //Returns true if distance 
        //btwn them is less than combined radii)
        boundCircleTest(circle){
           var combinedRadii = circle.radius + this.radius;
           var distanceBetween = PVector.dist(this.center, circle.center);     
           return (distanceBetween < combinedRadii);
        },
        /*Returns true if colliding*/
        boundRectTest(rectangle){
           this.bottomTip = this.center.y + this.radius;
           this.leftTip = this.center.x + this.radius;

           return (
              Physio.isInRange(this.center.x,rectangle.origin.x,rectangle.origin.x + rectangle.width) 
           && Physio.isInRange(this.bottomTip,rectangle.origin.y,rectangle.origin.y+rectangle.height)
           );
        }
    }
    
    return Circle;
})();


Physio.Rectangle = (() => {
   function Rectangle(origin, width, height){
      this.origin = origin;
      this.width = width;
      this.height = height;
      this.type = "rectangle";
   }
   
   Rectangle.prototype = {
     
   }
   
   return Rectangle;
})();




