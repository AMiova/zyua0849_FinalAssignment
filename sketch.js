let rectSize = 50;
let rectangles = [];
let smallRectangles = [];
let horizontalLines = [];
let verticalLines = [];
let squares = [];
let minRectangles = 10;
let maxRectangles = 15;

class Rectangle {
  constructor(x, y, w, h, color, isHorizontal, noiseOffset, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.isHorizontal = isHorizontal;
    this.noiseOffset = noiseOffset;
    this.speed = speed;
  }

  draw(xOffset, yOffset) {
    fill(this.color);
    noStroke();
    strokeWeight(1);

    let directionOffset = this.isHorizontal ? 1 : -1; // Direction bias

    if (this.isHorizontal) {
      this.x += directionOffset * this.speed; // Move horizontally
      if (this.x > width) this.x = 0; // Wrap around the canvas
      if (this.x < 0) this.x = width; // Wrap around the canvas
    } else {
      this.y += directionOffset * this.speed; // Move vertically
      if (this.y > height) this.y = 0; // Wrap around the canvas
      if (this.y < 0) this.y = height; // Wrap around the canvas
    }

    rect(this.x + xOffset, this.y + yOffset, this.w, this.h);
  }
}

class Mondrian {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.canvasAspectRatio = 0;
  }

  setup() {
    this.width = windowWidth;
    this.height = windowHeight;
    this.canvasAspectRatio = this.width / this.height;
    createCanvas(this.width, this.height);
    background(255, 250, 240); // Floralwhite
    this.calculateCanvas();
    generateLine();
    generateSquares();
    calculateRectangle();
  }

  draw() {
    background(255); // Refresh the background color
    drawLine(); // draw line first
    drawSquares();
    drawRectangles();
  }

  windowResized() {
    this.width = windowWidth;
    this.height = windowHeight;
    resizeCanvas(this.width, this.height);
    this.calculateCanvas();
    background(255, 250, 240);
  }

  calculateCanvas() {
    this.canvasAspectRatio = width / height;

    if (1 > this.canvasAspectRatio) {
      this.width = width;
      this.height = width;
      this.yOffset = (height - this.height) / 2;
      this.xOffset = 0;
    } else if (1 < this.canvasAspectRatio) {
      this.width = height;
      this.height = height;
      this.xOffset = (width - this.width) / 2;
      this.yOffset = 0;
    } else {
      this.width = width;
      this.height = height;
      this.xOffset = 0;
      this.yOffset = 0;
    }
  }
}

let mondrian = new Mondrian();

function setup() {
  mondrian.setup();
}

function draw() {
  mondrian.draw();
}

function windowResized() {
  mondrian.windowResized();
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
      x = floor(random(width / rectSize)) * rectSize;
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
      let speed = random(0.5, 1.5);
      let rectangle = new Rectangle(x, y, w, h, randomColor, isHorizontal, noiseOffset, speed);
      rectangles.push(rectangle);
      calculateSmallRectangles(x, y, w, h, isHorizontal, noiseOffset);
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
    while (!validPosition && attempts < 1000) {
      y = floor(random(height / rectSize)) * rectSize;
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
      let speed = random(0.5, 1.5);
      let rectangle = new Rectangle(x, y, w, h, randomColor, isHorizontal, noiseOffset, speed);
      rectangles.push(rectangle);
      calculateSmallRectangles(x, y, w, h, isHorizontal, noiseOffset);
    }
  }

  // Generate additional rectangles if the minimum quantity is not met
  while (rectangles.length < minRectangles) {
    let yMin = floor(random(height / rectSize)) * rectSize;
    let xMin = floor(random(width / rectSize)) * rectSize;
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
      let speed = random(0.5, 1.5);
      let rectangle = new Rectangle(xMin, yMin, w, h, randomColor, isHorizontal, noiseOffset, speed);
      rectangles.push(rectangle);
      calculateSmallRectangles(xMin, yMin, w, h, isHorizontal, noiseOffset);
    }
  }
}

function calculateSmallRectangles(x, y, w, h, isHorizontal, noiseOffset) {
  if ((w > rectSize || h > rectSize) && h > w) {
    let smallRectW = w;
    let smallRectH = floor(random(h / 4, h / 2));
    let smallX = x;
    let smallY = y + floor(random(0, h - smallRectH));
    let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
    smallRectangles.push({ x: smallX, y: smallY, w: smallRectW, h: smallRectH, color: smallColor, isHorizontal: isHorizontal, parentIndex: rectangles.length - 1 });

    if (smallRectH > rectSize && smallRectW > rectSize) {
      let centerRectW = smallRectW / 2;
      let centerRectH = smallRectH / 2;
      let centerX = smallX + (smallRectW - centerRectW) / 2;
      let centerY = smallY + (smallRectH - centerRectH) / 2;
      let centerColor = random([color(238, 216, 34), color(200)]);
      smallRectangles.push({ x: centerX, y: centerY, w: centerRectW, h: centerRectH, color: centerColor, isHorizontal: isHorizontal, parentIndex: rectangles.length - 1 });
    }
  }

  if ((w > rectSize || h > rectSize) && h < w) {
    let smallRectW = floor(random(w / 4, w / 2));
    let smallRectH = h;
    let smallX = x + floor(random(0, w - smallRectW));
    let smallY = y;
    let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
    smallRectangles.push({ x: smallX, y: smallY, w: smallRectW, h: smallRectH, color: smallColor, isHorizontal: isHorizontal, parentIndex: rectangles.length - 1 });

    if (smallRectH > rectSize && smallRectW > rectSize) {
      let centerRectW = smallRectW / 2;
      let centerRectH = smallRectH / 2;
      let centerX = smallX + (smallRectW - centerRectW) / 2;
      let centerY = smallY + (smallRectH - centerRectH) / 2;
      let centerColor = random([color(238, 216, 34), color(200)]);
      smallRectangles.push({ x: centerX, y: centerY, w: centerRectW, h: centerRectH, color: centerColor, isHorizontal: isHorizontal, parentIndex: rectangles.length - 1 });
    }
  }
}

function drawRectangles() {
  for (let rectangle of rectangles) {
    rectangle.draw(0, 0);

    // Move and draw small rectangles within the moving rectangle
    for (let smallRect of smallRectangles) {
      if (smallRect.parentIndex === rectangles.indexOf(rectangle)) {
        let directionOffset = rectangle.isHorizontal ? 1 : -1;
        if (rectangle.isHorizontal) {
          smallRect.x += directionOffset * rectangle.speed;
          if (smallRect.x > width) smallRect.x = 0;
          if (smallRect.x < 0) smallRect.x = width;
        } else {
          smallRect.y += directionOffset * rectangle.speed;
          if (smallRect.y > height) smallRect.y = 0;
          if (smallRect.y < 0) smallRect.y = height;
        }
        fill(smallRect.color);
        rect(smallRect.x, smallRect.y, smallRect.w, smallRect.h);
      }
    }
  }
}

function generateLine() {
  // Make two arrays to store the horizontal and vertical lines
  horizontalLines = [];
  verticalLines = [];

  // The starting point coordinates of Y, this is the position of the first horizontal line, and the subsequent vertical lines are arranged based on this.
  let firstY = floor(random(0, 2)) * rectSize;
  let firstX = floor(random(0, 2)) * rectSize;

  // Draw Horizontal lines
  for (let i = 0; i < random(10, 12); i++) {
    let y = firstY + floor(random(i, i * 2)) * rectSize + rectSize;

    // Limit the maximum value
    if (y > height) {
      y = height;
    }
    let h = rectSize / 2;

    // Store the y and h values in the array, so the cross points can be drawn later
    horizontalLines.push({ y: y, h: h, x: 0, w: width });
  }

  // Draw Vertical lines
  for (let i = 0; i < random(10, 12); i++) {
    let x = firstX + floor(random(i, i * 2)) * rectSize + rectSize;
    if (x > width) {
      x = width;
    }

    let w = rectSize / 2;

    // Store the x and w values in the array
    verticalLines.push({ x: x, w: w, y: 0, h: height });
  }
}

function drawLine() {
  fill(238, 216, 34);
  noStroke();
  for (let line of horizontalLines) {
    rect(0, line.y, width, line.h);
  }
  for (let line of verticalLines) {
    rect(line.x, 0, line.w, height);
  }
}

function generateSquares() {
  // Calculate cross points with new color, the cross points are the intersection of the horizontal and vertical lines
  for (let horizontal of horizontalLines) {
    for (let vertical of verticalLines) {
      if (vertical.x < width && horizontal.y < height) {
        squares.push({ x: vertical.x, y: horizontal.y, noiseOffsetX: random(1000), noiseOffsetY: random(1000) });
      }
    }
  }

  // Add random colored squares along the vertical line
  for (let vertical of verticalLines) {
    for (let i = rectSize; i < height; i += rectSize) {
      if (random() > 0.5) {
        squares.push({ x: vertical.x, y: i, noiseOffsetX: random(1000), noiseOffsetY: random(1000) });
      }
    }
  }

  // Add random colored squares along the horizontal line to mimic Mondrian painting
  for (let horizontal of horizontalLines) {
    for (let i = rectSize; i < width; i += rectSize) {
      if (random() > 0.5) { // Randomly decide to place a colored square
        squares.push({ x: i, y: horizontal.y, noiseOffsetX: random(1000), noiseOffsetY: random(1000) });
      }
    }
  }
}

function drawSquares() {
  // Draw small squares
  for (let square of squares) {
    // Perlin noise
    let noiseVal = noise(square.noiseOffsetX + frameCount * 0.01);
    let lerpedColor;
    if (noiseVal < 0.33) {
      lerpedColor = lerpColor(color(238, 216, 34), color(173, 57, 42), noiseVal / 0.33); // Yellow to red
    } else if (noiseVal < 0.66) {
      lerpedColor = lerpColor(color(173, 57, 42), color(200, 200, 200), (noiseVal - 0.33) / 0.33); // Red to grey
    } else {
      lerpedColor = lerpColor(color(200, 200, 200), color(67, 103, 187), (noiseVal - 0.66) / 0.34); // Grey to blue
    }
    fill(lerpedColor);
    noStroke();

    rect(square.x, square.y, rectSize / 2, rectSize / 2);
  }
}
