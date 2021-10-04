const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope, rope2, rope3;
var fruit;
var fruit_con;
var bg, food, rabbit,cut;
var bunny, button, button2, button3;
var blower, mute_btn;
var blink, eat, sad;
var bgSound, eatingSound, sadSound, cutSound, airSound;

function preload(){

  bg = loadImage("background.png");
  food = loadImage("melon.png");
  rabbit = loadImage("Rabbit.png");
  blink = loadAnimation("Blink1.png","Blink2.png","Blink3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  eat.looping = false;
  sad.looping = false;

  bgSound = loadSound("sound1.mp3");
  sadSound = loadSound("sad.wav");
  eatingSound = loadSound("eating_sound.mp3");
  cutSound = loadSound("rope_cut.mp3");
  airSound = loadSound("air.wav");
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile){
    cw = displayWidth;
    ch = displayHeight;
    createCanvas(displayWidth + 80, displayHeight);
  }
  else{
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(windowWidth, windowHeight);
  }
  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  ground = new Ground(cw/2,ch,cw,20);
  rope = new Rope(5,{x:100, y:120});
  rope2 = new Rope(7,{x:255, y:60});
  rope3 = new Rope(6,{x:405, y:190});
  bunny = createSprite(400,ch - 80,100,100);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("sad", sad);
  bunny.changeAnimation("blinking");
  bunny.scale = 0.2;
  imageMode(CENTER);

  button = createImg("cut_button.png");
  button.position(80,120)
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg("cut_button.png");
  button2.position(235,60)
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg("cut_button.png");
  button3.position(385,190)
  button3.size(50,50);
  button3.mouseClicked(drop3);

  bgSound.play();
  bgSound.setVolume(0.2);

  blower = createImg("balloon.png");
  blower.position(10,240);
  blower.size(120,100);

  blower.mouseClicked(airBlow);

  mute_btn = createImg("mute.png");
  mute_btn.position(450,30);
  mute_btn.size(40,40);

  mute_btn.mouseClicked(mute);

  var fruit_options = {
    density: 0.001,
    restitution: 0.00001
  }

  fruit = Bodies.circle(250,310,20,fruit_options);
  Matter.Composite.add(rope.body,fruit);
  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  fruit_con3 = new Link(rope3,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() {

  background(51);
  push()
  imageMode(CENTER)
  image(bg,displayWidth/2,displayHeight/2,displayWidth + 80,displayHeight);
  pop();

  ground.show();
  rope.show();
  rope2.show();
  rope3.show();

  if (fruit != null){
    image(food,fruit.position.x,fruit.position.y,50,50);
  } 

  Engine.update(engine);
  
  if (collide(fruit,bunny) == true){
    bunny.changeAnimation("eating");
    eatingSound.play()
  }

  if (fruit != null && fruit.position.y >= 650){
    bunny.changeAnimation("sad");
    bgSound.stop();
    sadSound.play();
    fruit = null;
  }

  drawSprites();
}

function drop(){
  rope.break()
  cutSound.play();
  fruit_con.detach()
  fruit_con = null;
}

function drop2(){
  rope2.break()
  cutSound.play();
  fruit_con2.detach()
  fruit_con2 = null;
}

function drop3(){
  rope3.break()
  cutSound.play();
  fruit_con3.detach()
  fruit_con3 = null;
}

function collide(body,sprite){
  if (body != null){
    var b = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if (b <= 80){
      World.remove(engine.world,fruit);
      fruit = null;
      return true;
    }
    else{
      return false;
    }
  }
}

function airBlow(){
  Matter.Body.applyForce(fruit, {x:0, y:0},{x:0.02, y:0})
  airSound.play()
}

function mute(){
  if(bgSound.isPlaying()){
    bgSound.stop();
  }
  else{
    bgSound.play();
  }
}