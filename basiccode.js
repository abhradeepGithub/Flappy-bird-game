// Game variables and settings
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

const birdImg = new Image();
const pipeImg = new Image();

birdImg.src = "https://i.postimg.cc/sgw3Tr9L/bird.png";
pipeImg.src = "https://i.postimg.cc/8CXPzS7v/pipe.jpg";

const gravity = 0.5;
let bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  velocityY: 0,
};

let pipes = [];
let pipeWidth = 50;
let pipeGap = 120;
let frame = 0;
let score = 0;
let gameover = false;

document.addEventListener("keydown", flap);

// Function to handle bird's flap
function flap() {
  bird.velocityY = -8;
}

// Function to create pipes
function createPipe() {
  let pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 20;
  pipes.push({
    x: canvas.width,
    y: pipeHeight,
  });
}

// Function to draw the bird
function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Function to draw pipes
function drawPipes() {
  pipes.forEach((pipe, index) => {
    // Top pipe
    ctx.drawImage(pipeImg, pipe.x, pipe.y - pipeGap - pipeImg.height);
    // Bottom pipe
    ctx.drawImage(pipeImg, pipe.x, pipe.y);

    pipe.x -= 2;

    // Remove pipe if off-screen
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
    }

    // Collision detection
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.y - pipeGap || bird.y + bird.height > pipe.y)
    ) {
      gameover = true;
    }
  });
}

// Function to update the bird's position
function updateBird() {
  bird.velocityY += gravity;
  bird.y += bird.velocityY;

  // Bird falls off the screen
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameover = true;
  }
}

// Function to display score
function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  updateBird();

  if (frame % 100 === 0) {
    createPipe();
  }

  frame++;

  if (!gameover) {
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
    ctx.fillText(`Final Score: ${score}`, canvas.width / 4, canvas.height / 2 + 40);
  }
}

// Start the game when images are loaded
birdImg.onload = function () {
  pipeImg.onload = function () {
    gameLoop();
  };
};
