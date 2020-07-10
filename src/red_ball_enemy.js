class RedBallEnemy extends Enemy{
   constructor(pos){
      super(pos);
      this.radius = 9.5;
   }
   
   draw(){
      noStroke();
      fill(255, 15, 10);
      ellipse(this.pos.x, this.pos.y, this.radius*2,this.radius*2);
   }
}