class Player extends Mover{
   constructor(pos){
      super(pos);
      this.pos = pos || new PVector(width/2, height/2);
      this.vel = new PVector(0,0);
      this.acc = new PVector(0,0);
      
      this.radius = 7.5;
      this.width = this.radius;
      this.body = new Physio.Circle(this.pos, this.radius);
      this.airtimeCapacity = 10;
      this.airtime = this.airtimeCapacity;
      this.topSpeed = 8.5;
      this.superLaunching = false;
      this.trailStartPoint = this.pos.get();
      this.maxTrailLength = 20;
      this.trailLength = this.maxTrailLength;  
      this.timeSpeed = 1;
      this.frictionCoefficient = 0.05;
     
      this.aiming = false;   
      this.aimPoint = new PVector(0,0);
   }
   
   run(){
      this.update();
      this.draw();
      this.applyForces();
      this.applyFriction();
     // this.passThroughWalls();   
   }
   
   aim(point){
      this.aiming = true;
      this.aimPoint = point;
      World.setSpeed(0.15);
      this.width = this.radius * 2;
   }
   
   isAiming(){
      return this.aiming;
   }
   
   endAim(){
      this.aiming = false;
      World.setSpeed(1);
      this.width = this.radius;
   }
   
   drawAim(){
      /*--Draw until where we can actually reach--*/
      var point = this.aimPoint;
      noStroke();
      fill(255, 255, 255, 180);
      triangle(
         this.pos.x - (this.radius / 4),this.pos.y,
         this.pos.x + (this.radius / 4),this.pos.y,
         point.x,point.y
      );
      
   }
   
   /*--A circle for now--*/
   draw(){
      
      if (this.superLaunching){
         fill(10, 10, 220);
      }else{
         fill(255);
      }
    
      ellipse(this.pos.x, this.pos.y,this.radius * 2, this.radius * 2);
      
      //Draw the radius
      line(this.pos.x, this.pos.y, this.pos.x + this.radius,this.pos.y);
      
      /*-Props and stuff-*/
      this.drawTrail();
      
      if (this.isAiming()){
         this.drawAim();
      }
   }
   
   drawTrail(){
      fill(255, 255, 255, 175);
      triangle(
         this.trailStartPoint.x, this.trailStartPoint.y,
         this.pos.x - this.radius, this.pos.y,
         this.pos.x + this.radius, this.pos.y
      );
   }
   
   drawAirtime(){
      var w = 140;
      var h = 10;
      
      noFill();
      stroke(0);
      rect(width/2 - w/2,30,w,h);
      /*--Mapped to fill in the bar--*/
      var airtime = map(this.airtime,0,this.airtimeCapacity,0,w);
      
      fill(255);
      noStroke();
      rect(width/2 -w/2,30,airtime,h);
   }
   
   drawSuperJuice(){
     
   }
   
   /*--Abstracted to physics engine--*/
   hits(entity){
      return this.body.boundTest(entity.body);
   }      
   
   resizeTo(platform){
      this.pos.y = ( platform.pos.y - this.radius );
   }
   
   launchTo(pos){
      if (!this.canLaunch) return;
      /*--Reset velocity so that other forces are not
      taken into account--*/
      this.vel.mult(0);
      this.goTowards(pos);
      
      if (!this.superLaunching){
         particleStore.emit('PlayerLaunch',this.pos.x,this.pos.y,5);
      }
   }
   
   /*--This is where the player attacks all 
   enemies automatically--*/
   superLaunch(enemies){
      if(enemies.length < 1) return;
      this.topSpeed *= 2;
      var closest = this.getClosestEntity(enemies);

      this.launchTo(closest.pos);
      this.superLaunching = true;
      this.topSpeed /= 2;      
   }
   
   update(){
      super.update();
      this.updateProps();
      
      if (this.hasNoAirtime()){
         this.canLaunch = false;
      }else{
         this.canLaunch = true;
      }
   }
   
   updateProps(){
      this.updateAirtime();
      this.updateTrail();
   }
   
   hasNoAirtime(){
      return (this.airtime <= 0);
   }
   
   updateAirtime(){
      this.airtime = constrain(this.airtime,0,this.airtimeCapacity);
      if (this.isMoving()){
         this.airtime -= 0.05;
      }else{
         this.airtime += 0.1;
      }
   }
   
   updateTrail(){
       /*--Map trailLength to velocity(Faster it goes longer the trail)--*/
       var fastness = (this.vel.mag() / this.topSpeed) * 1;
       this.trailLength = (this.maxTrailLength * fastness);
       
       var distance = PVector.dist(this.pos, this.trailStartPoint);
       if (distance > this.trailLength){
          var idealPoint = this.pos.get();
         
          var dir = this.vel.get();
          dir.mult(-1);
          dir.normalize();
          dir.setMag(this.trailLength);
          
          idealPoint.add(dir);
          this.trailStartPoint = idealPoint;
       }
   }
   
   isMoving(){
      return (this.vel.mag() > 1.5);
   }
   
   /*--Gives the player a score and stuff--*/
   scoreOnEnemy(enemy){
      this.airtime += 5;
   }
   
   collidePlatforms(platforms){
      var self = this;
      platforms.forEach((platform) => {
         if (self.hits(platform)){
            self.handlePlatformCollision(platform);
         }
      })
   }
   
   handlePlatformCollision(platform){
      this.vel.y *= -0.7;
      this.resizeTo(platform);
      this.airtime += 1;
      
      /*--If we hit that platform hard enough
      emit some particles--*/
      if (this.vel.mag() > (this.topSpeed * 1/5)){
         particleStore.emit('PlayerLaunch',this.pos.x,this.pos.y,10);
      }
   }
   
   collideEnemies(enemies){
      var self = this;
      enemies.forEach((enemy) => {
         if (self.hits(enemy)){
            self.handleEnemyCollision(enemy);
         }
      })
   }
   
   handleEnemyCollision(enemy){
      this.scoreOnEnemy(enemy);
      enemyStore.destroy(enemy);
      /*--Reduce velocity slightlty--*/
      ball.vel.setMag( ball.vel.mag() * 0.85);
      /*--Now bounce off--*/
      ball.vel.y *= -0.9;
   }
}


