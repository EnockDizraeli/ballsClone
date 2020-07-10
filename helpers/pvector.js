function PVector(x,y){
   this.x = x;
   this.y = y;
}

PVector.prototype = {
   add(v){
      this.x += v.x;
      this.y += v.y;
   },
   sub(v){
      this.x -= v.x;
      this.y -= v.y;
   },
   mult(n){
      //w = u * n
      this.x *= n;
      this.y *= n;
   },
   div(n){
      this.x /= n;
      this.y /= n;
   },
   mag(){
      //Get magnitude(size/length) through pythagoras theorem
      return Math.sqrt(this.x*this.x + this.y*this.y);
   },
   normalize(){
      //Standardising into a unit vector
      //To attain a magnitude of 1
      var mag = this.mag();
      if (mag != 0) this.div(mag);
   },
   limit(max){
     if (this.mag() > max){
        this.setMag(max);
     }
   },
   setMag(num){
      this.normalize();
      this.mult(num);
   },
   get(){
      return new PVector(this.x, this.y);
   },
   angle(){
      return Math.atan2(this.y, this.x);
   },
   heading(){
      return this.angle();
   },
   setAngle(a){
      var mag = this.mag();
      this.x = mag * Math.cos(a);
      this.y = mag * Math.sin(a);
   },
   rotate(a){
      this.setAngle(this.angle() + a);
   }
}

PVector.sub = function(a,b){
   return new PVector(a.x - b.x, a.y - b.y);
}

PVector.add = function(a,b){
   return new PVector(a.x + b.x, a.y + b.y);
}

PVector.dist = function(a,b){
   return dist(a.x,a.y,b.x, b.y);
}

