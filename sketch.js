var trex, trex_running, edges;
var trex_collider;
var groundImg, ground;
var invisibleground;
var cloud, cloudImg, cloudsGroup;
var cactus,  cactus1, cactus2, cactus3, cactus4, cactus5, cactus6, cactusGroup;
var PLAY=1,END=0;
var gamestate=PLAY;
var score=0;
var gameover, gameoverImg;
var restart, restartImg;
var checkpoint;
var die; 
var jump;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collider = loadAnimation("trex_collided.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  cactus1 = loadImage("obstacle1.png");
  cactus2= loadImage("obstacle2.png");
  cactus3= loadImage("obstacle3.png");
  cactus4= loadImage("obstacle4.png");
  cactus5= loadImage("obstacle5.png");
  cactus6= loadImage("obstacle6.png");
  restartImg = loadImage("restart.png");
  gameoverImg = loadImage("gameOver.png");
  checkpoint = loadSound("checkpoint.mp3");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
}

function setup(){
  createCanvas(600,200);
  
  //crear sprite de Trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collider);
  edges = createEdgeSprites();
  gameover = createSprite(300,100);
  gameover.addImage(gameoverImg);
  gameover.scale=0.5;
  gameover.visible=false;
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale=0.5;
  restart.visible=false;
  
  //agregar tamaño y posición al Trex
  trex.scale = 0.5;
  trex.x = 50;

  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImg);
  invisibleground = createSprite(200,190,400,10);
  invisibleground.visible = false;
  cloudsGroup=createGroup();
  cactusGroup=createGroup();

  trex.debug=false;
  trex.setCollider("circle",0,0,40);
  //trex.setCollider("rectangle",0,0,150,80);
}

function draw(){
  //establecer color de fondo.
  background(200);

  if(gamestate==PLAY){
    ground.velocityX = -(6+score/100);
    score=score+Math.round(getFrameRate()/60);
    if(score>0 && score%100==0){
      checkpoint.play();
    }
    if(ground.x < 0){
      ground.x = ground.width/2;
    }
    //hacer que el Trex salte al presionar la barra espaciadora
    if(keyDown("space") && trex.y > 150){
      trex.velocityY = -10; 
      jump.play();
    }
  
    trex.velocityY = trex.velocityY + 0.5;

    clouds();
    obstacle();

    if(cactusGroup.isTouching(trex)){
      gamestate=END;
      die.play();
      //trex.velocityY=-10;
    }
  }
  else if(gamestate==END){
    trex.changeAnimation("collided",trex_collider);
    ground.velocityX=0;
    cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    cactusGroup.setLifetimeEach(-1);
    gameover.visible=true;
    restart.visible=true;
    trex.velocityY = 0;
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  
  
  //evitar que el Trex caiga
  trex.collide(invisibleground);
  //trex.bounceOff(edges);
  
  drawSprites();
  text("Score: "+score,500,50);
}

function clouds(){
  if(frameCount%60===0){
    cloud = createSprite(600,100,40,10);
    cloud.addImage("cloud",cloudImg);
    cloud.velocityX =-3;
    cloud.y = Math.round(random(10,100));
    cloud.depth = trex.depth;
    trex.depth+=1;
    cloud.lifetime = 220;
    cloudsGroup.add(cloud);
  }
}

function obstacle(){
  if(frameCount%60===0){
    cactus=createSprite(600,165,10,40);
    cactus.velocityX= -(6+score/100);;
    
    var ran=Math.round(random(1,6));
    switch(ran){
        
      case 1:cactus.addImage(cactus1);
        break;
        
        case 2:cactus.addImage(cactus2);
        break;
        
        case 3:cactus.addImage(cactus3);
        break;
        
        case 4:cactus.addImage(cactus4);
        break;
        
        case 5:cactus.addImage(cactus5);
        break;
        
        case 6:cactus.addImage(cactus6);
        break;
        
        default:
        break;
    }
    cactus.scale = 0.5;
    cactus.lifetime = 210;
    cactusGroup.add(cactus);
  }
}
 function reset(){
  gamestate=PLAY;
  gameover.visible=false;
  restart.visible=false;
  cactusGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
  trex.changeAnimation("running", trex_running);
} 

