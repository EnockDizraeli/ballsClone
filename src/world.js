let World = (function(){
   var timeSpeed = 1;
  
   function setSpeed(speed){
      particleStore.setTimeSpeed(speed);
      allMovers.forEach((mover) => {
         mover.setTimeSpeed(speed);
      })
      
      timeSpeed = speed;
   }
   
   function getSpeed(){
     return timeSpeed;
   }
   
   function getFrameCount(){
      return (frameCount * timeSpeed);
   }
   
   return {
      setSpeed,
      getSpeed,
      getFrameCount
   }
})();