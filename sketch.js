let centerMass = 1600;

let centerMassWidth = 20;

let meteorArr = [];

let numberOfDots = 60;

let velocityX = 2;
let velocityY = 0;

let centerMassX;
let centerMassY;

let kineticEnergyColorConstant = 0.000001;

let backgroundFade = 0;

let initialDistance = 400;

let maxMeteors = 5;

let meteorCount = 0;

let colorArr = [[255, 165, 0],[0, 201, 138],[34, 70, 218],[215, 0, 219],[255, 0, 109]];
let colorArrHex = ["#ffa500","#00c98a","#2545d9","#d700db","#ff0070"];

let bgOpacity = 5;

let upperDivHeight;

var released = true;

var keplerFlag = false;

class meteor{
  constructor(positionArr, velocityArr, meteorMass,meteorColor, index) {
    this.index = index;
    this.positionArr = positionArr;
    this.velocityArr = velocityArr;
    this.meteorMass = meteorMass;   
    this.momentumArr = [meteorMass*velocityArr[0],meteorMass*velocityArr[1]];
    this.meteorVelocity = Math.sqrt(velocityArr[0]**2 + velocityArr[1]**2);
    this.meteorColor = colorArr[index];
    this.kineticEnergy = (meteorMass*(this.meteorVelocity**2))/2;
    this.updateUX();
    meteorCount += 1;
  }
  updateVelocity(){
    this.meteorVelocity = Math.sqrt(this.velocityArr[0]**2 + this.velocityArr[1]**2);
  }
  updateKineticEnergy(){
    this.kineticEnergy = (this.meteorMass*(this.meteorVelocity**2))/2;    
  }
  updateUX(){
    document.getElementsByClassName("meteor-button")[this.index].classList.add("meteor-button-active");
    document.getElementsByClassName("meteor-button")[this.index].style.backgroundColor = String(colorArrHex[this.index]);
  }
}

function setup() {

  createCanvas(windowWidth,windowHeight);

  background(0);
  frameRate(60);

  // for(let x = 1; x<width-300; x += width/numberOfDots){
  //   for(let y = 20; y<height-850; y += height/numberOfDots){
  //       meteorArr.push(new meteor([x,y],[velocityX,velocityY], 1, [255,255,255]));
  //   }
  // }

  meteorArr.push(new meteor([width/2,height/2-initialDistance],[velocityX,velocityY], 2, [255,255,255], meteorCount));

  centerMassX = width/2;
  centerMassY = height/2;
  background(0);
}

function draw() {
  background(0,bgOpacity);
  noFill();
  fill(62,62,62);
  noStroke();
  circle(centerMassX, centerMassY, centerMassWidth);
  for(let i = 0; i<meteorArr.length;i++){

    let meteor = meteorArr[i];
    let x1;
    let x2;
    let x3;
    let x4;
    let y1;
    let y2;
    let y3;
    let y4;

    if(!insideCircle(centerMassX, centerMassY, centerMassWidth/2, meteor.positionArr[0], meteor.positionArr[1])){

      diffX = centerMassX - meteor.positionArr[0];
      diffY = centerMassY - meteor.positionArr[1];

      distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      force =  (meteor.meteorMass * centerMass) / distance**2;

      angle = Math.acos(diffX / distance)*(180/PI);
      angleInRadian = (angle/180)*PI;
 
      if(diffY < 0 ){ 
        angleInRadian = -angleInRadian;
      }

      meteor.momentumArr[0] += cos(angleInRadian)*force;
      meteor.momentumArr[1] += sin(angleInRadian)*force;

      meteor.velocityArr[0] = meteor.momentumArr[0] / meteor.meteorMass;
      meteor.velocityArr[1] = meteor.momentumArr[1] / meteor.meteorMass;

      x1 = meteor.positionArr[0];

      x2 = x1+meteor.velocityArr[0];

      y1 = meteor.positionArr[1];

      y2 = y1+meteor.velocityArr[1];

      // bezier(x1,y1,x2,y2,x3,y3,x4,y4); 
      // strokeWeight(Math.min(2+meteor.meteorMass*(meteor.kineticEnergy/10),10));

      if(keplerFlag){
        strokeWeight(6);
        stroke(meteor.meteorColor[0],meteor.meteorColor[1],meteor.meteorColor[2], 20);
        line(x1, y1, width/2, height/2);
      }

      strokeWeight(3);
      stroke(meteor.meteorColor[0],meteor.meteorColor[1],meteor.meteorColor[2]);
      line(x1,y1,x2,y2);

      meteor.positionArr[0] += meteor.velocityArr[0];
      meteor.positionArr[1] += meteor.velocityArr[1];

      meteor.updateVelocity();
      meteor.updateKineticEnergy();

      // line(meteor.positionArr[0],meteor.positionArr[1],xNext,yNext);  
    }else{
      meteorArr.splice(i, 1);
    }
  }
}

function insideCircle(x1, y1, r, x2, y2){
  let diffX = x2 - x1;
  let diffY = y2 - y1;
  if( r **2 > diffX ** 2 + diffY ** 2){
    return true;
  }
  return false;
}

function touchStarted(){
  let posX = mouseX;
  let posY = mouseY;
  if(meteorArr.length <= maxMeteors-1 && mouseX > 128){
    meteorArr.push(new meteor([mouseX,mouseY],[2,0],2,[255,255,255],meteorCount));
  }
}

function drawCenterMass(){
  noFill();
  for(let i = centerMass; 0<i; i -= 3){
    stroke(255,255,255,i**2);
    circle(centerMassX, centerMassY, i);
  }
}

function giveMeColor(r,g,b){
  let newColor = [random(r),random(g),random(b)];
  return newColor;
}

function clearMeteors(){
  meteorArr = [];
  let meteorButtonArr = document.getElementsByClassName("meteor-button");
  for(let i = 0; i<maxMeteors; i++){
    meteorButtonArr[i].classList.remove("meteor-button-active");
    meteorButtonArr[i].style.backgroundColor = "#000000";
  }
  meteorCount = 0;
  background(0);
  noStroke();
  fill(62,62,62);
  circle(centerMassX, centerMassY, centerMassWidth);
}

function permanent(){
  if(bgOpacity == 5){
      document.getElementById("perm-button").classList.add("active-button"); 
      document.getElementById("kepler-button").classList.remove("unclickable"); 
  }else{
      document.getElementById("perm-button").classList.remove("active-button");
      document.getElementById("kepler-button").classList.add("unclickable"); 
  }
  bgOpacity = (bgOpacity + 5) % 10;
}

function kepler(){
  keplerFlag = true;
  setTimeout(function() {keplerFlag = false} ,1000);
  setTimeout(function() {keplerFlag = true} ,3000);
  setTimeout(function() {keplerFlag = false} ,4000);
}


