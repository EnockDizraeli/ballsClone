let Controls = (() => {
   function init(player){
      handleControls( player );
   }
   
   let aimedPoint = new PVector(0,0);
   let aiming = false;

   function handleControls(player){
      window.onmousedown = function(e){
         e.preventDefault();
         aimedPoint.x = e.pageX + gameCamera.getOffsetX();
         aimedPoint.y = e.pageY + gameCamera.getOffsetY();          
         ball.aim(aimedPoint);
		 aiming = true;
         return false;
      }
          
      window.onmousemove = function(e){
        e.preventDefault();
		
		if (aiming){
			aimedPoint.x = e.pageX + gameCamera.getOffsetX();
			aimedPoint.y = e.pageY + gameCamera.getOffsetY();             
			ball.aim(aimedPoint);
		}
        
        return false;
      }
          
      window.onmouseup = function(e){
         ball.endAim();
         ball.launchTo(aimedPoint);
         aiming = false;
         e.preventDefault();
         return false;
      }        
   }

   return {
      init: init
   }
})();