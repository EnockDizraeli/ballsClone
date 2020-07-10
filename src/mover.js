let allMovers = (function(){
   let movers = [];
   
   function forEach(fn){
      movers.forEach(fn);
   }
   
   function add(mover){
      movers.push( mover );
   }
   
   return {
      forEach,
      add
   }
})();


class Mover{
    constructor(pos){
       this.pos = pos.get() || new PVector(width/2, height/2);
       this.vel = new PVector(0,0);
       this.acc = new PVector(0, 0);
       this.topSpeed = 7;
       this.maxForce = 5;
       this.mass = 1;
       this.id = new Date().getTime(); 
       this.timeSpeed = 1;
       this.forces = [];
       if (allMovers){
          allMovers.add(this);
       }
    }
    
    setTimeSpeed(value){
       this.timeSpeed = value;
    }
   

    addForce(f){
       this.forces.push(f);
    }
    
    applyForces(){
       var self = this;
       this.forces.forEach((force) =>{
          self.applyForce(force);
       })
    }
    
    applyForce(v){
       //F = m * a /  a = F / m
       var force = v.get();
       force.div(this.mass);
       this.acc.add(force);
    }
    
    applyFriction(){
        var friction = this.vel.get();
        var normal = 1;
        var c = this.frictionCoefficient || 0.01;
        var frictionMag = normal * c;
        
        friction.mult(-1);
        friction.normalize();
        friction.mult(frictionMag);
        this.applyForce(friction);
    }
    
    update(){
       /*--Scale speed according to time Speed--*/
       var speed = (this.topSpeed * this.timeSpeed);
       
       /*--Scale velocity without altering the original--*/
       var vel = this.vel.get();
       vel.setMag(vel.mag() * this.timeSpeed);
       
       this.vel.add(this.acc);
       
       /*--Add the scaled velocity--*/
       vel.limit(speed);
       this.pos.add(vel);
       
       this.acc.mult(0);
       
    }
    
    checkEdges(){ 
       if (this.pos.x > width){
          this.pos.x = width;
          this.vel.x *= -1;
       }
       
       if (this.pos.x < 0){
          this.pos.x = 0;
          this.vel.x *= -1;
       }
      
       if (this.pos.y > height){
          this.pos.y = height;
          this.vel.y *= -1;
       }
       
       if (this.pos.y < 0){
          this.pos.y = 0;
          this.vel.y *= -1;
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
    
    
    drag(liquid){
       var speed = this.vel.mag();
       var dragMagnitude = liquid.c * speed * speed;
       var drag = this.vel.get();
       //Going in opposite direction
       drag.mult(-1);
       //Normalized
       drag.normalize();
       drag.mult(dragMagnitude);
       
       this.applyForce(drag);
    }
    
    isInLiquid(liquid){
       var pos = this.pos;
       return (pos.x >= liquid.x && pos.x < liquid.x + liquid.w
       && pos.y >= liquid.y && pos.y < liquid.y + liquid.h);
    }
    
    goTowards(v){
       //Get a vector pointing toward a vector v
       var resultant = PVector.sub(v,this.pos);
       //Normalize and scale
       resultant.normalize();
       resultant.mult(this.topSpeed);
       //Set it as acceleration
       this.applyForce(resultant);
    }
    
    attract(mover){
       var force = PVector.sub(mover.pos, this.pos);
       var distance = force.mag();
       distance = constrain(distance,5,25);
       force.normalize();
       //Get magnitude if attraction
       var magnitude = (this.G * mover.mass * this.mass) / (distance * distance);
       force.mult(magnitude );
       return force;
    }
    
    goTowardsGroup(vs){
       //Simply get the closest one from the group
       //and go Towards it
       var closest = this.getClosestVector(vs);
       this.goTowards(closest);
    }
    
    avoid(v){
       //Get a vector pointing toward a vector v
       var resultant = PVector.sub(v,this.pos);
       //Normalize and scale oppositely
       resultant.normalize();
       resultant.mult(-0.5);
       //Set it as acceleration
       this.applyForce(resultant);
   }
    
    avoidGroup(vs){
       //So if we are avoiding a group of 
       //position vectors the most logical thing to do
       //is avoid the closest one to our position
       var closest = this.getClosestVector(vs);
       this.avoid(closest);
    }//end avoid group
    
    getClosestEntity(ents){
       let self = this;
       var closest = new PVector(width / 2, height/2);
       var closestDistance = Infinity;
       ents.forEach((entity) => {
           if(!entity.pos) return;
           var distance = PVector.dist(self.pos, entity.pos);
           if (distance < closestDistance){
              closestDistance = distance;
              closest = entity;
           }
       })
       return closest;
    }
    
    seek(pos){
       //We desire to move at the target pos at maximum speed
       var desired = PVector.sub(pos, this.pos);
       desired.normalize();
       desired.mult(this.topSpeed);
            
       //We therefore have to steer
       var steer = PVector.sub(desired, this.vel);
       steer.limit(this.maxForce);
       return steer;
    }
}


