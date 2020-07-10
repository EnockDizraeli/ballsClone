let missileStore = (() => {
   let missiles = [];
   
   function getMissiles(){
      return missiles;
   }
   
   function run(){
      getMissiles().forEach((missile) => {
         missile.update();
         missile.draw();
      });
   }
   
   function add(missile){
      missiles.push( missile );
   }
  
   return {
      getMissiles,
      run,
      add
   }
})();

class Missile extends Mover{
   constructor( pos ){
      super(pos);
      this.maxForce = 5;
      this.topSpeed = 20;
      this.target = false;
      this.size = 7;
      this.body = new Physio.Circle(this.pos, this.size);
      missileStore.add(this);
   }
   
   draw(){
      /*--Rotate in direction--*/
      rectMode(CENTER);
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.angle());
      this.drawShip();
      pop();
   }
   
   drawShip(){
      var size = this.size,
         height = size * 1.2;
         
      var x1 = -(size * 2),
         y1 = -size,
         x2 = 0,
         y2 = 0,
         x3 = -(size * 2),
         y3 = size;
      fill(255);
      stroke(0);
      triangle(x1,y1,x2,y2,x3,y3)
   }
   
   update(){
      super.update();
      if (!this.target) return;
      
      var force = this.seek( this.target.pos);
      this.applyForce( force );
      
      this.emitParticles();
   }
   
   emitParticles(){
       if (World.getFrameCount() % 10 === 0){
          particleStore.emit('MissileSmoke',this.pos.x,this.pos.y,1);
       }

       if (World.getFrameCount() % 15 === 0){
          particleStore.emit('MissileFlame',this.pos.x,this.pos.y,1);
       }
       
       
   }
   
   attack(enemies){
      var closestEnemy = this.getClosestEntity(enemies);
      this.setTarget(closestEnemy);
   }
   
   hitsTarget(){
      if (!this.target) return false;
      return this.body.boundTest(this.target.body);
   }
   
   setTarget(target){
      this.target = target;
   }
   
   getTarget(){
      return this.target;
   }
   
   
   
   
}


