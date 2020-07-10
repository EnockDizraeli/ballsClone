      let ball;
      let ctx;
      let ground;
      let ms;
      
      
      function setup(){
          var canv = createCanvas(window.innerWidth * 1, window.innerHeight * 1);
          ctx = canv.elt.getContext('2d');
          ball = new Player(new PVector(width/3, height/2));
          /*--Add Gravitational Force--*/
          ball.addForce( new PVector(0, 0.1) );

          createEnemies(15);          
          createPlatforms(1);
          
          /*--Missile test--*/
          ms = new Missile(ball.pos);
          
          ground = new Platform(-width/2,height*2,width*3,20)
          Controls.init(ball); 
      }
      
      function createEnemies(len){
         for (var i = 0;i < len;i++){
            var pos = new PVector(random(0,width), random(0,height));
            new RedBallEnemy(pos);
         }
      }

      function createPlatforms(len){
         for (var i = 0;i < len;i++){
            new Platform(random(0,width),height - 20, random(50,90),20);
         }
      }
      
      
      function draw(){
         background(55); 
         /*--Camera Shit--*/
         gameCamera.start();
         gameCamera.centerOnEntity( ball );

         /*--Run all the stores--*/ 
         platformStore.run();
         particleStore.run();
         enemyStore.run();
         missileStore.run();
         
        // ms.attack(enemyStore.getEnemies());
         
       //  if (ms.hitsTarget()){
         //   enemyStore.destroy(ms.getTarget())
        // }
         
         /*--Player Logic--*/ 
         ball.run();
         ball.collidePlatforms( platformStore.getPlatforms() );         
         ball.collideEnemies( enemyStore.getEnemies() );
         gameCamera.end();
         
         ball.drawAirtime();
      }
      
