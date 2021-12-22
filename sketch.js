var gameOver,resetButton,GameOverIcon,resetIcon;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var obststacleGroup,cloudGroup;
var ground,groundImage;
var trex ,trex_running;
var invisibleGround;
var r = 0;
var cloud,cloudImage;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score = 0;
var dieSound,checkPointSound,jumpSound;

function preload() {
  
  //loading animation
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png","trex1.png","trex3.png","trex4.png");
  trex_ded = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  overIcon = loadImage("gameOver.png");
  resetIcon = loadImage("restart.png");

  //loading sounds
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  jumpSound = loadSound("jump.mp3");

}

function setup(){
  
  createCanvas(windowWidth,windowHeight);

  //creating ground sprite and adding image 
  ground = createSprite(width/2,height-70,width,2);
  ground.addImage("bottom",groundImage);

  //create a trex sprite
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("run",trex_running);
  trex.addAnimation("ded",trex_ded);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("rectangle",0,0,130,trex.height);

  //creating invisible ground
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;

  //creating the groups for obstacles(cacti) and clouds
  obstacleGroup=new Group();
  cloudGroup = new Group();

  //adding gameOver sign
  gameOver=createSprite(width/2,height/2-50);
  gameOver.addImage("sign",overIcon);
  
  //adding reset icon
  resetButton=createSprite(width/2,height/2);
  resetButton.addImage("resetImage",resetIcon);
  resetButton.scale = 0.5;

  console.log(height)

}
function draw() {
  
  background("white")

 // console.log("frameRate: " + getFrameRate());

  //restarting game
  if (mousePressedOver(resetButton)) {

    reset();
  }
  if(gameState == PLAY) {
    
    //making ground move backwards
    ground.velocityX = -6 + score/100;
    
    //console.log(ground.x)
    gameOver.visible = false;
    resetButton.visible= false;
    
    //making the ground not escape the canvas
    if (ground.x<0) {
      ground.x = ground.width/2;

    }

    //increasing score
    score = score + Math.round(getFrameRate() / 200);
    
    if(score % 1000 == 0 && score > 0) {
      
      checkPointSound.play();

    }
    
    //spawning objects
    spawnCloud();
    spawnObstacles();

    //making the dinosaur jump
    jump();

    if (obstacleGroup.isTouching(trex)) {
      
      gameState = END;
      dieSound.play();
      
      /*trex.velocityY = -10;
      jumpSound.play();
      */
    }
  
  }else if(gameState == END) {
    
    ground.velocityX = 0;
    
    trex.changeAnimation("ded",trex_ded)
    
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);

    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    resetButton.visible = true;
    gameOver.visible = true;
    //trex.velocityY = 0;
  }

  //code for gravity 
  trex.velocityY += 0.9;
  trex.collide(invisibleGround);

  //displaying score
  text("score: "+ score,500,50);
  
  //console.log(gameState);

  drawSprites();

}

function jump() {
  
  if(touches.length>0 || keyDown("space") && (trex.y > height-120)) {
    trex.velocityY = -10;
    jumpSound.play();
    touches = [];
    
  } 

}
function spawnCloud() {
  
  //making clouds
  if(frameCount%100 ==  0)  {
    //random number
    r = Math.round(random(10,60));
    //console.log(r);

    //creating cloud and making it go backwards
    cloud = createSprite(600,r,40,10);
    cloud.velocityX = -3;

    //adding image and lifetime
    cloud.addImage("cloudanimation",cloudImage);
    cloud.scale = 0.4;
    cloud.lifetime = 200;
  
    //making the trex be infront of the clouds
    trex.depth = cloud.depth+1;

    //adding clouds to a group
    cloudGroup.add(cloud)

  }
  
}

function spawnObstacles() {
  
  if (frameCount % 60 == 0) {
    
    //creating obstacles, making them move backwards and setting their scale down
    var obstacle = createSprite(600,height-100,10,40);
    obstacle.scale = 0.4;
    obstacle.velocityX = -6 + score/100;
    
    //making random number and assigning each number to an obstacle's animation, thus making the generation random
    var r2 = Math.round(random(1,6));
    
    switch(r2) {
      
      case 1:
      obstacle.addImage("ob1", obstacle1);
      break;
      case 2:
      obstacle.addImage("ob2", obstacle2);
      break;
      case 3:
      obstacle.addImage("ob3", obstacle3);
      break;
      case 4:
      obstacle.addImage("ob4", obstacle4);
      break;
      case 5:
      obstacle.addImage("ob5", obstacle5);
      break;
      case 6:
      obstacle.addImage("ob6",obstacle6);
      break;
      default: 
      obstacle.addImage("ob1",obstacle1);
    
    }
    
    obstacle.lifetime = 123;
    obstacleGroup.add(obstacle);

  }

}

function reset() {
 
  //console.log("resetting the game");
  score = 0;
  gameState = PLAY;
  resetButton.visible = false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("run",trex_running);

}

