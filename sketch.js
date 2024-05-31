//This is a preliminary sketch for the group task, made by Yusong Xie
//Set properties for the Mondrian painting
let rectSize = 50;

//Make an object to hold the properties of the Mondrian design
let mondrian = {aspect: 0, width: 600, height: 600, xOffset: 0, yOffset: 0};
//Set width equal to height, because I want to make a square design

//A variable for the canvas aspect ratio
let canvasAspectRatio = 0;

//Make two arrays to store the horizontal and vertical lines
let horizontalLines = [];
let verticalLines = [];
let minRectangles = 10;
let maxRectangles = 15;
let squares=[];
let rectangles = [];
let smallRectangles = [];

class Rectangle {
  constructor(x,y,w,h,color,isHorizontal,noiseOffset,speed) {
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.color=color;
    this.isHorizontal=isHorizontal;
    this.noiseOffset=noiseOffset;
    this.speed=speed;
    this.smallRectangles=[]; // 用于存储小矩形
  }

  moveAndDraw() {
    fill(this.color);
    noStroke();
    strokeWeight(1);

    let directionOffset=this.isHorizontal?1:-1; // 方向偏移

    if(this.isHorizontal) {
      this.x+=directionOffset*this.speed; // 水平移动
      if(this.x>width)this.x=0; // 画布环绕
      if(this.x<0)this.x=width; // 画布环绕
    } else {
      this.y+=directionOffset*this.speed; // 垂直移动
      if(this.y>height)this.y=0; // 画布环绕
      if(this.y<0)this.y=height; // 画布环绕
    }

    rect(this.x+mondrian.xOffset,this.y+mondrian.yOffset,this.w,this.h);

    // 移动并绘制小矩形
    for(let smallRect of this.smallRectangles) {
      if(this.isHorizontal) {
        smallRect.x+=directionOffset*this.speed;
        if(smallRect.x>width)smallRect.x=0;
        if(smallRect.x<0)smallRect.x=width;
      } else {
        smallRect.y+=directionOffset*this.speed;
        if(smallRect.y>height)smallRect.y=0;
        if(smallRect.y<0)smallRect.y=height;
      }
      fill(smallRect.color);
      rect(smallRect.x+mondrian.xOffset,smallRect.y+mondrian.yOffset,smallRect.w,smallRect.h);
    }
  }

  addSmallRectangle(smallRect) {
    this.smallRectangles.push(smallRect);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 250, 240); //Floralwhite
  calculateMondrian();
  generateLine();
  generateSquares();
  calculateRectangle();
}

function draw() {
  background(255);//Refresh the background color
  drawLine(); // draw line first
  drawSquares();
  drawRectangles();
}


function calculateRectangle() {
  // Generate rectangles between adjacent horizontal lines, ensuring no overlap
  for (let i = 0; i < horizontalLines.length - 1 && rectangles.length < maxRectangles; i++) {
    // Determine boundaries for the rectangle
    let yMin = horizontalLines[i].y + horizontalLines[i].h;
    let yMax = horizontalLines[i + 1].y;
    let h = yMax - yMin;

    // Attempt to place the rectangle without overlap, with a maximum number of attempts
    let attempts = 0;
    let validPosition = false;
    let x, y, w;
    while (!validPosition && attempts < 1000) {
      //The floor method is a mathematical function used for rounding down. It rounds a number down to the nearest integer.
      x = floor(random(mondrian.width / rectSize)) * rectSize;
      w = rectSize; // Keep rectangle width constant

      // Adjust rectangle position to align with horizontal lines
      y = yMin; // Set top edge of rectangle to bottom edge of horizontal line
      if (y + h > yMax) {
        y -= (y + h - yMax); // Adjust position if exceeding top boundary
      }

      validPosition = true;

      // Check for overlap with existing rectangles
      for (let rect of rectangles) {
        if (!(x + w < rect.x || x > rect.x + rect.w || y + h < rect.y || y > rect.y + rect.h)) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    // Draw the rectangle if a valid position is found
    if (validPosition && h > 0) {
      // Draw the rectangle with a random color
      let randomColor = random([color(238,216,34), color(173,57,42), color(67,103,187), color(200)]);
      let isHorizontal;
      if (h > w) {
        isHorizontal = false; // Vertical movement
      } else if (h < w) {
        isHorizontal = true; // Horizontal movement
      } else {
        isHorizontal = random() > 0.5; // Random movement direction
      }
      let noiseOffset = random(1000);
      let speed=random(0.5,1.5);
      let rectangle=new Rectangle(x,y,w,h,randomColor,isHorizontal,noiseOffset,speed);
      rectangles.push(rectangle);
      calculateSmallRectangles(rectangle,x, y, w, h, isHorizontal, noiseOffset);
    }
  }

  // Generate rectangles between adjacent vertical lines, ensuring no overlap
  for (let i = 0; i < verticalLines.length - 1 && rectangles.length < maxRectangles; i++) {
    // Determine boundaries for the rectangle
    let xMin = verticalLines[i].x + verticalLines[i].w;
    let xMax = verticalLines[i + 1].x;
    let w = xMax - xMin;

    // Attempt to place the rectangle without overlap, with a maximum number of attempts
    let attempts = 0;
    let validPosition = false;
    let x, y, h;
    while (!validPosition && attempts < 1000) { // Increase maximum attempts
      y = floor(random(mondrian.height / rectSize)) * rectSize;
      h = rectSize; // Keep rectangle height constant

      // Adjust rectangle position to align with vertical lines
      x = xMin; // Set left edge of rectangle to right edge of vertical line
      if (x + w > xMax) {
        x -= (x + w - xMax); // Adjust position if exceeding left boundary
      }

      validPosition = true;

      // Check for overlap with existing rectangles
      for (let rect of rectangles) {
        if (!(x + w < rect.x || x > rect.x + rect.w || y + h < rect.y || y > rect.y + rect.h)) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    // Draw the rectangle if a valid position is found
    if (validPosition && w > 0) {
      // Draw the rectangle with a random color
      let randomColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
      let isHorizontal;
      if (h > w) {
        isHorizontal = false; // Vertical movement
      } else if (h < w) {
        isHorizontal = true; // Horizontal movement
      } else {
        isHorizontal = random() > 0.5; // Random movement direction
      }
      let noiseOffset = random(1000);
      let speed=random(0.5,1.5);
      let rectangle=new Rectangle(x,y,w,h,randomColor,isHorizontal,noiseOffset,speed);
      rectangles.push(rectangle);
      calculateSmallRectangles(rectangle,x, y, w, h, isHorizontal, noiseOffset);
    }
  }

  // Generate additional rectangles if the minimum quantity is not met
  while (rectangles.length < minRectangles) {
    let yMin = floor(random(mondrian.height / rectSize)) * rectSize;
    let xMin = floor(random(mondrian.width / rectSize)) * rectSize;
    let w = rectSize;
    let h = rectSize;
    let validPosition = true;

    // Check for overlap with existing rectangles
    for (let rect of rectangles) {
      if (!(xMin + w < rect.x || xMin > rect.x + rect.w || yMin + h < rect.y || yMin > rect.y + rect.h)) {
        validPosition = false;
        break;
      }
    }

    // Draw the rectangle if a valid position is found
    if (validPosition) {
      // Draw the rectangle with a random color
      let randomColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
      let isHorizontal = random() > 0.5; // Random movement direction for equal width and height
      let noiseOffset = random(1000);
      let speed=random(0.5,1.5);
      let rectangle=new Rectangle(xMin,yMin,w,h,randomColor,isHorizontal,noiseOffset,speed);
      rectangles.push(rectangle);
      calculateSmallRectangles(rectangle,xMin, yMin, w, h, isHorizontal, noiseOffset);
    }
  }
}
function calculateSmallRectangles(rectangle,x, y, w, h, isHorizontal) {
  if ((w > rectSize || h > rectSize) && h > w) {
    let smallRectW = w;
    let smallRectH = floor(random(h / 4, h / 2));
    let smallX = x;
    let smallY = y + floor(random(0, h - smallRectH));
    let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
    rectangle.addSmallRectangle({x: smallX, y: smallY, w: smallRectW, h: smallRectH, color: smallColor, isHorizontal: isHorizontal, parentIndex: rectangles.length - 1});

    if (smallRectH > rectSize && smallRectW > rectSize) {
      let centerRectW = smallRectW / 2;
      let centerRectH = smallRectH / 2;
      let centerX = smallX + (smallRectW - centerRectW) / 2;
      let centerY = smallY + (smallRectH - centerRectH) / 2;
      let centerColor = random([color(238, 216, 34), color(200)]);
      rectangle.addSmallRectangle({x: centerX, y: centerY, w: centerRectW, h: centerRectH, color: centerColor, isHorizontal: isHorizontal, parentIndex: rectangles.length - 1});
    }
  }

  if ((w > rectSize || h > rectSize) && h < w) {
    let smallRectW = floor(random(w / 4, w / 2));
    let smallRectH = h;
    let smallX = x + floor(random(0, w - smallRectW));
    let smallY = y;
    let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
    rectangle.addSmallRectangle({x: smallX, y: smallY, w: smallRectW, h: smallRectH, color: smallColor, isHorizontal: isHorizontal, parentIndex: rectangles.length - 1});

    if (smallRectH > rectSize && smallRectW > rectSize) {
      let centerRectW = smallRectW / 2;
      let centerRectH = smallRectH / 2;
      let centerX = smallX + (smallRectW - centerRectW) / 2;
      let centerY = smallY + (smallRectH - centerRectH) / 2;
      let centerColor = random([color(238, 216, 34), color(200)]);
      rectangle.addSmallRectangle({x: centerX, y: centerY, w: centerRectW, h: centerRectH, color: centerColor, isHorizontal: isHorizontal, parentIndex: rectangles.length - 1});
    }
  }
}

function drawRectangles() {
  for (let rectangle of rectangles) {
   rectangle.moveAndDraw();
  }
}
function generateLine(){
   //Make two arrays to store the horizontal and vertical lines
   horizontalLines = [];
   verticalLines = [];
 //The starting point coordinates of Y, this is the position of the first horizontal line, and the subsequent vertical lines are arranged based on this.
     let firstY=floor(random(0,2))*rectSize;
     let firstX=floor(random(0,2))*rectSize;

      //Draw Horizontal lines
  for (let i = 0; i < random(10,12); i ++){
    let y=firstY+floor(random(i,i*2))*rectSize+rectSize;

    //Limit the maximum value
    if(y>mondrian.height){
      y=mondrian.height
    }
    let h = rectSize/2;
    
    //store the y and h values in the array, so the cross points can be 
    //drawn later
    horizontalLines.push({y: y, h: h, x: 0, w: mondrian.width});
  }

  //Draw Vertical lines
  for (let i = 0; i < random(10,12); i ++){
    let x = firstX+floor(random(i,i*2))*rectSize+rectSize;
    if(x>mondrian.width){
      x=mondrian.width
    }

    let w =  rectSize/2;
    
    //store the x and w values in the array
    verticalLines.push({x: x, w: w, y: 0, h: mondrian.height});
  }
}

function drawLine(){
  fill(238,216,34);
  noStroke();
  for(let line of horizontalLines){
    rect(mondrian.xOffset,line.y + mondrian.yOffset, mondrian.width,line.h);
  }
  for(let line of verticalLines){
    rect(line.x + mondrian.xOffset, mondrian.yOffset, line.w, mondrian.height);
  }
}

function generateSquares(){
  //Calculate cross points with new color, the cross points are the 
  //intersection of the horizontal and vertical lines
  for (let horizontal of horizontalLines){ 
    for (let vertical of verticalLines){
      if(vertical.x < mondrian.width && horizontal.y < mondrian.height){ 
        squares.push({x:vertical.x,y:horizontal.y,noiseOffsetX:random(1000),noiseOffsetY: random(1000)});
      }
    }
  }

  //Add random colored squares along the vertical line
  for(let vertical of verticalLines){
    for (let i = rectSize; i < mondrian.height; i += rectSize){
      if(random() > 0.5){
        squares.push({x:vertical.x,y:i,noiseOffsetX:random(1000),noiseOffsetY: random(1000)});
      }
    }
  }

   //Add random colored squares along the horizontal line to mimic 
  //Mondrian painting
  for(let horizontal of horizontalLines){
    for (let i = rectSize; i < mondrian.width; i += rectSize){
      if(random() > 0.5){ //Randomly decide to place a colored square
        squares.push({x:i,y:horizontal.y,noiseOffsetX:random(1000),noiseOffsetY: random(1000)});
      }
    }
  }
}
function drawSquares(){
  //draw small squares
  for(let square of squares){
    //perlin noise
    let noiseVal = noise(square.noiseOffsetX + frameCount * 0.01);
    let lerpedColor;
    if (noiseVal < 0.33) {
      //The lerpColor method generates a transition color by blending two colors based on a noise value, and it is used to create gradient effects.
      lerpedColor = lerpColor(color(238, 216, 34), color(173, 57, 42), noiseVal / 0.33); // Yellow to red
    } else if (noiseVal < 0.66) {
      lerpedColor = lerpColor(color(173, 57, 42), color(200, 200, 200), (noiseVal - 0.33) / 0.33); // Red to grey
    } else {
      lerpedColor = lerpColor(color(200, 200, 200), color(67, 103, 187), (noiseVal - 0.66) / 0.34); // Grey to blue
    }
    fill(lerpedColor);
    noStroke();

    rect(square.x + mondrian.xOffset, square.y + mondrian.yOffset, rectSize / 2, rectSize / 2);
  }
}



function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  calculateMondrian(); 
  background(255, 250, 240);
}

function calculateMondrian(){
  canvasAspectRatio = width/height;
  mondrian.aspect = 1; //Square aspect ratio
  
  if(1 > canvasAspectRatio){
    mondrian.width = width;
    mondrian.height = width / mondrian.aspect;
    mondrian.yOffset = (height - mondrian.height) / 2;
    mondrian.xOffset = 0;
  } else if (1 < canvasAspectRatio){
    mondrian.width = height * mondrian.aspect;
    mondrian.height = height;
    mondrian.xOffset = (width - mondrian.width) / 2;
    mondrian.yOffset = 0;
  } else{
    mondrian.width = width;
    mondrian.height = height;
    mondrian.xOffset = 0;
    mondrian.yOffset = 0;
  }
}