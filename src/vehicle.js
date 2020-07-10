class Vehicle{
   constructor(pos){
   }
   
   update(){
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.acc.mult(0);
   }
   
   run(){
      this.update();
      this.display();
   }
   
   display(){
      var angle = this.vel.angle();
      rectMode(CENTER);
      push();
      fill(175);
      stroke(0);
      translate(this.pos.x, this.pos.y);
      rotate(angle);
      this.drawHead();
      endShape(CLOSE);
      pop();
   }
   
   drawHead(){
      var size = this.size,
         x1 = -(size * 2),
         y1 = -size,
         x2 = 0,
         y2 = 0,
         x3 = -(size * 2),
         y3 = size;
      fill(255);
      stroke(0);
      triangle(x1,y1,x2,y2,x3,y3)
   }
   
   
   seek(target){
      //The velocity the vehicle desires to be at
      var desired = PVector.sub(target, this.pos);
      var d = desired.mag();
      desired.normalize();
      
      //If we are closer than 100px
      if (d < 100){
         //Implement arriving behaviour through mapping
         var m = map(d,0,100,0,this.maxSpeed);
         desired.mult(m);
      }else{
         //Otherwise move at maximum speed
         desired.mult(this.maxSpeed);
      }
      
      //But then the vehicle has to steer to that velocity
      var steer = PVector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
   }
   
   flee(target){
      //The velocity the vehicle desires to be at
      var desired = PVector.sub(target, this.pos);
      desired.normalize();
      desired.mult(-1);
      desired.mult(this.maxSpeed);
      
      //But then the vehicle has to steer to that velocity
      var steer = PVector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;  
   }
   
   applyForce(f){
      f.div(this.mass / 2);
      this.acc.add(f);
   }
   
   checkWalls(){
      var strength = this.maxForce * 3;
      if (this.pos.x > width - 20){
         this.applyForce(new PVector(-strength, 0));
      }
      
      if(this.pos.x < 20){
         this.applyForce(new PVector(strength,0));
      }
      if(this.pos.y > height - 20){
         this.applyForce(new PVector(0,-strength));        
      }
      
      if(this.pos.y < 20){
         this.applyForce(new PVector(0,strength));        
      }
   }
   
   passThroughWalls(){
       if (this.pos.x > width){
          this.pos.x = 0;
       }
       
       if (this.pos.x < 0){
          this.pos.x = width;
       }
      
       if (this.pos.y > height){
          this.pos.y = 0;
       }
       
       if (this.pos.y < 0){
          this.pos.y = height;
       }      
   }
   
   goTowards(v){
      var dir = PVector.sub(this.pos,v);
      dir.normalize();
      dir.mult(100);
      this.applyForce(v);
   }
   
}






