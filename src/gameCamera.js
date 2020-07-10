let gameCamera = (() => {
   let offsetX = 0;
   let offsetY = 0;
   
   function start(){
      ctx.save();
      ctx.translate(-offsetX, -offsetY);
   }
   
   function end(){
      ctx.restore();
   }
   
   function centerOnEntity( entity ){
      offsetX = entity.pos.x - width/2;
      offsetY = entity.pos.y - height/2;
   }
   
   function getOffsetY(){
      return offsetY;
   }
   
   function getOffsetX(){
      return offsetX;
   }
   
   
   let component = {
      start,
      end,
      centerOnEntity,
      getOffsetX,
      getOffsetY
   }
   
   return component;
})();