let platformStore = (function(){
   let platforms = [];
   
   function run(){
      platforms.forEach((platform) => {
         platform.draw();
      })
   }
   
   function add(platform){
      platforms.push(platform);
   }
   
   function getPlatforms(){
      return platforms;
   }
   
   
   return {
      run,
      add,
      getPlatforms
   }
})();


class Platform{
   constructor(x,y,w,h){
      this.pos = new PVector(x,y);
      this.w = w;
      this.h = h;
      this.body = new Physio.Rectangle(this.pos,w,h);
      
      platformStore.add( this );
   }
   
   draw(){
    //  this.pos.x -= gameCamera.xOffset;
      //this.pos.y -= gameCamera.yOffset;

      fill(255);
      rect(this.pos.x, this.pos.y, this.w, this.h);
   }
}