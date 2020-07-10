let particleStore = (function(){
    let particles = [];
    
    /*--It is a function since the particle classes
    are undefined here--*/    
    let keyMap = function(){
        return {
          'DeadRedBall': RedParticle,
          'PlayerLaunch': WhiteLaunchParticle,
          'MissileSmoke': MissileSmokeParticle,
          'MissileFlame': MissileFlameParticle
        }
    };
    
    function run(){
       particles.forEach((particle, index) => {
          particle.run();
          if (particle.isDead()){
             particles.splice(index, 1);
          }
       })
    }
    
    function emit(type,x, y, count){
       var ParticleType = keyMap()[type];
       for (var i = 0;i < count;i++){
          var particle = new ParticleType(x,y);
       }
    }
    
    function add(particle){
       particles.push(particle);
    }
    
    function setTimeSpeed(v){
       particles.forEach((particle) => {
          particle.setTimeSpeed(v);
       })
    }
    
    return {
       run,
       emit,
       add,
       setTimeSpeed
    }
    
})();


function Particle(x,y){
   if (!y){
   this.pos = x.get();
   }else{
      this.pos = new PVector(x,y);
   }
   
   this.vel = new PVector(0,0);
   this.acc = new PVector(random(-5,5),random(-5,5));
   this.gravity = new PVector(0,0.1);
   this.lifespan = 2;
   this.maxSpeed = 1.5;
   this.mass = random(1,4);
   this.timeSpeed = 1;
   particleStore.add(this);
}


Particle.prototype = {
    run(){
       this.show();
       this.applyForce(this.gravity);
       this.update();
       this.lifespan -= (0.02 * this.timeSpeed);
    },
    show(){
       //Orange
       stroke(0,this.lifespan * 255);
       fill(255, 100, 0, 255 * this.lifespan);
       ellipse(this.pos.x, this.pos.y, 5,5);
    },
    update(){
       /*--Scale speed according to time Speed--*/
       var speed = (this.maxSpeed * this.timeSpeed);
       
       /*--Scale velocity without altering the original--*/
       var vel = this.vel.get();
       vel.setMag(vel.mag() * this.timeSpeed);
       
       this.vel.add(this.acc);
       
       /*--Add the scaled velocity--*/
       vel.limit(speed);
       this.pos.add(vel);
       
       this.acc.mult(0);
       
    },
    isDead(){
       return (this.lifespan <= 0);
    },
    applyForce(force){
       this.acc.add(force);
    },
    repel(particle){
       let G = 1;
       var force = PVector.sub(particle.pos, this.pos);
       var d = force.mag();
       d = constrain(d,5,25);
       force.mult(-1);
       force.normalize();
       //Magnitude
       var magnitude = (G * this.mass * particle.mass ) / (d * d);
       force.mult(magnitude);
       return force;
    },
    setTimeSpeed(speed){
       this.timeSpeed = speed;
    }
}


class RedParticle extends Particle{
    constructor(x,y){
       super(x,y);
       this.maxSpeed = 5;
       this.size = random(6,9);
       this.acc = new PVector(
          random(-this.maxSpeed,this.maxSpeed),
          random(-this.maxSpeed,this.maxSpeed)        
       );
    }
    show(){
       //Red little squares
       noStroke();
       fill(235, 0, 0);
       rect(this.pos.x, this.pos.y, this.size, this.size);
       this.size = (this.size <= 0) ? 0 : (this.size -= (0.2 * this.timeSpeed))
    }
}


class WhiteLaunchParticle extends Particle{
    constructor(x,y){
       super(x,y);
       this.maxSpeed = 4;
       this.size = random(5,7);
       this.opacity = random(70,255);
       this.startPoint = this.pos.get();
       this.trailLength = random(7,12);
    }
    show(){
       //White little squares
       noStroke();
       fill(255,255,255,this.opacity);
       rect(this.pos.x, this.pos.y, this.size, this.size);
       this.size = (this.size <= 0) ? 0 : (this.size -= (0.2 * this.timeSpeed));
       
       //Trail
       noStroke();
       fill(255,255,255,this.opacity);
       triangle(
          this.startPoint.x, this.startPoint.y,
          this.pos.x,this.pos.y,
          this.pos.x + this.size,this.pos.y
       );
    }
    
    update(){
       super.update();
       /*--Move the starting point--*/
       var requiredDistance = this.trailLength;
       var distance = PVector.dist(this.pos, this.startPoint);
       if (distance > requiredDistance){
          var idealPoint = this.pos.get();
          
          var dir = this.vel.get();
          dir.mult(-1);
          dir.normalize();
          dir.setMag(requiredDistance);
          
          idealPoint.add(dir);
          
          this.startPoint = idealPoint;
       }
    }
}





class MissileSmokeParticle extends Particle{
   constructor(x,y){
      super(x,y);
      this.vel = new PVector(0,0);
      this.acc = new PVector(
         random(-0.3,0.3),         
         random(-0.3,0.3)         
      );
      this.gravity = new PVector(0, 0);
   }
   
   show(){
      fill(255, 255, 255, (255 * this.lifespan));
      ellipse(this.pos.x, this.pos.y, 5, 5);
   }
}


class MissileFlameParticle extends Particle{
   constructor(x,y){
      super(x,y);
      this.vel = new PVector(0,0);
      this.acc = new PVector(
         random(-0.2,0.2),         
         random(-0.2,0.2)         
      );
      this.gravity = new PVector(0, 0);
   }
   
   show(){
      fill(255, 105, 5, (255 * this.lifespan));
      ellipse(this.pos.x, this.pos.y, 5, 5);
   }
}


