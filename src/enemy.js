let enemyStore = (function(){
   let enemies = [];
   
   function run(){
      enemies.forEach((enemy) => {
         enemy.draw();
         enemy.update();
      })
   }
   
   function add(enemy){
      enemies.push(enemy);
   }
   
   function getEnemies(){
      return enemies;
   }
   
   function destroy(enemy){
      /*--Destruction effects--*/
      particleStore.emit('DeadRedBall',enemy.pos.x,enemy.pos.y,15);
      shakeCanvas();
     
      /*--Now remove--*/
      remove(enemy);
      
      /*--TO DO:Remove this--*/
      createEnemies(1);
   }
   
   function remove(enemy){
      var index = enemies.indexOf(enemy);
      enemies.splice(index,1);
   }
   
   return {
      run,
      add,
      getEnemies,
      destroy
   }
})();

class Enemy extends Mover{
   constructor(pos){
      super(pos);
      this.pos = pos;
      this.radius = 16;
      this.body = new Physio.Circle(this.pos, this.radius);
      enemyStore.add(this);
   }
}