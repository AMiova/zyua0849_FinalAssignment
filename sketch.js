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
let squares=[];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 250, 240); //Floralwhite
  calculateMondrian();
  //noLoop(); //make the draw function only run once
  generateLine();

  generateSquares();
  drawRectangle();
}

function draw() {
  drawLine(); // draw line first
  drawSquares();
}


function drawRectangle() {
  let rectangles = []; // Array to store generated rectangles
  let minRectangles = 10; // Minimum number of rectangles
  let maxRectangles = 15; // Maximum number of rectangles

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
      fill(randomColor);
      noStroke();
      strokeWeight(1);
      rect(x + mondrian.xOffset, y + mondrian.yOffset, w, h);
      rectangles.push({x: x, y: y, w: w, h: h}); // Add the rectangle to the array
      if((w>rectSize||h>rectSize)&&h>w){
        let smallRectW = w;
        let smallRectH = floor(random(h/4,h/2));
        let smallX = x;
        let smallY = y + floor(random(0, h - smallRectH));
        let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
        fill(smallColor);
        noStroke();
        rect(smallX + mondrian.xOffset, smallY + mondrian.yOffset, smallRectW, smallRectH);
        //To generate a smaller rectangle in the middle of a larger rectangle
        if(smallRectH>rectSize&&smallRectW>rectSize){
          let centerRectW = smallRectW / 2;
          let centerRectH = smallRectH / 2;
          let centerX = smallX + (smallRectW - centerRectW) / 2;
          let centerY = smallY + (smallRectH - centerRectH) / 2;
          let centerColor = random([color(238, 216, 34),color(200)]);
          fill(centerColor);
          noStroke();
          rect(centerX + mondrian.xOffset, centerY + mondrian.yOffset, centerRectW, centerRectH);
        }
      }
      if((w>rectSize||h>rectSize)&&h<w){
        let smallRectW = floor(random(w/4,w/2));
        let smallRectH = h;
        let smallX = x + floor(random(0, w - smallRectW));
        let smallY = y;
        let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
        fill(smallColor);
        noStroke();
        rect(smallX + mondrian.xOffset, smallY + mondrian.yOffset, smallRectW, smallRectH);
        //To generate a smaller rectangle in the middle of a larger rectangle
        if(smallRectH>rectSize&&smallRectW>rectSize){
          let centerRectW = smallRectW / 2;
          let centerRectH = smallRectH / 2;
          let centerX = smallX + (smallRectW - centerRectW) / 2;
          let centerY = smallY + (smallRectH - centerRectH) / 2;
          let centerColor = random([color(238, 216, 34),color(200)]);
          fill(centerColor);
          noStroke();
          rect(centerX + mondrian.xOffset, centerY + mondrian.yOffset, centerRectW, centerRectH);
        }
      }
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
      let randomColor = random([color(238,216,34), color(173,57,42), color(67,103,187), color(200)]);
      fill(randomColor);
      noStroke();
      strokeWeight(1);
      rect(x + mondrian.xOffset, y + mondrian.yOffset, w, h);
      rectangles.push({x: x, y: y, w: w, h: h}); // Add the rectangle to the array
      if((w>rectSize||h>rectSize)&&h>w){
        let smallRectW = w;
        let smallRectH = floor(random(h/4,h/2));
        let smallX = x;
        let smallY = y + floor(random(0, h - smallRectH));
        let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
        fill(smallColor);
        noStroke();
        rect(smallX + mondrian.xOffset, smallY + mondrian.yOffset, smallRectW, smallRectH);
        //To generate a smaller rectangle in the middle of a larger rectangle
        if(smallRectH>=rectSize&&smallRectW>=rectSize){
          let centerRectW = smallRectW / 2;
          let centerRectH = smallRectH / 2;
          let centerX = smallX + (smallRectW - centerRectW) / 2;
          let centerY = smallY + (smallRectH - centerRectH) / 2;
          let centerColor = random([color(238, 216, 34),color(200)]);
          fill(centerColor);
          noStroke();
          rect(centerX + mondrian.xOffset, centerY + mondrian.yOffset, centerRectW, centerRectH);
        }
      }
      if((w>rectSize||h>rectSize)&&h<w){
        let smallRectW = floor(random(w/4,w/2));
        let smallRectH = h;
        let smallX = x + floor(random(0, w - smallRectW));
        let smallY = y;
        let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
        fill(smallColor);
        noStroke();
        rect(smallX + mondrian.xOffset, smallY + mondrian.yOffset, smallRectW, smallRectH);
        //To generate a smaller rectangle in the middle of a larger rectangle
        if(smallRectH>=rectSize&&smallRectW>=rectSize){
          let centerRectW = smallRectW / 2;
          let centerRectH = smallRectH / 2;
          let centerX = smallX + (smallRectW - centerRectW) / 2;
          let centerY = smallY + (smallRectH - centerRectH) / 2;
          let centerColor = random([color(238, 216, 34),color(200)]);
          fill(centerColor);
          noStroke();
          rect(centerX + mondrian.xOffset, centerY + mondrian.yOffset, centerRectW, centerRectH);
        }
      }
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
      let randomColor = random([color(238,216,34), color(173,57,42), color(67,103,187), color(200)]);
      fill(randomColor);
      noStroke();
      strokeWeight(1);
      rect(xMin + mondrian.xOffset, yMin + mondrian.yOffset, w, h);
      rectangles.push({x: xMin, y: yMin, w: w, h: h}); // Add the rectangle to the array
    }
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
      //
      if(vertical.x < mondrian.width && horizontal.y < mondrian.height){ 
        let randomColor = random([color(173,57,42),   //red
                                  color(67,103,187),    //blue
                                  color(200, 200, 200)]);  //grey
        squares.push({x:vertical.x,y:horizontal.y,color:randomColor,noiseOffset:random(1000)});
      }
    }
  }

  //Add random colored squares along the vertical line
  for(let vertical of verticalLines){
    for (let i = rectSize; i < mondrian.height; i += rectSize){
      if(random() > 0.5){
        let randomColor = random([color(238,216,34), //yellow
                                  color(173,57,42), //red
                                  color(67,103,187), //blue
                                  color(200, 200, 200)]); //grey
        squares.push({x:vertical.x,y:i.y,color:randomColor,noiseOffset:random(1000)});
      }
    }
  }

   //Add random colored squares along the horizontal line to mimic 
  //Mondrian painting
  for(let horizontal of horizontalLines){
    for (let i = rectSize; i < mondrian.width; i += rectSize){
      if(random() > 0.5){ //Randomly decide to place a colored square
        let randomColor = random([color(238,216,34), //yellow
                                    color(173,57,42), //red
                                    color(67,103,187), //blue
                                    color(200, 200, 200)]); //grey
        squares.push({x:i,y:horizontal.y,color:randomColor,noiseOffset:random(1000)});
      }
    }
  }
}
function drawSquares(){
  //draw small squares
  for(let square of squares){
    fill(square.color);
    noStroke();

    let noiseX=noise(square.noiseOffset+frameCount*0.01)*50-25;
    let noiseY=noise(square.noiseOffset+1000+frameCount*0.01)*50-25;

    push();
    translate(square.x+mondrian.xOffset+noiseX,square.y+mondrian.yOffset+noiseY);
    rect(0,0,rectSize/2,rectSize/2);
    pop();
    //let animatedY = square.y+sin(frameCount * 0.1)*2;
    //rect(square.x+mondrian.xOffset,animatedY+mondrian.yOffset,rectSize/2);
  }
}



function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  background(255, 250, 240);
  calculateMondrian(); 
  setup();
}
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  background(255, 250, 240);
  calculateMondrian(); 
  setup();
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
  } else if (1 == canvasAspectRatio){
    mondrian.width = width;
    mondrian.height = height;
    mondrian.xOffset = 0;
    mondrian.yOffset = 0;
  }
}