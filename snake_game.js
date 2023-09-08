// Snake Game Constants
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const DOT_SIZE = 10;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const GRID_SIZE = CANVAS_WIDTH / DOT_SIZE;
const SPEED = 200; // milliseconds per frame (adjust as needed)

// Snake Initial State
const snake = [{ x: 5, y: 5 }];
let direction = "right";
let apple = { x: getRandomX(), y: getRandomY() };

// Score
let score = 0;

// Game Loop
function gameLoop() {
    if (!isGameOver()) {
        moveSnake();
        checkCollision();
        drawGame();
        setTimeout(gameLoop, SPEED);
    } else {
        endGame();
    }
}

// Handle User Input (Touch Controls)
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);

let touchStartX, touchStartY;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            if (direction !== "left") direction = "right";
        } else {
            if (direction !== "right") direction = "left";
        }
    } else {
        if (deltaY > 0) {
            if (direction !== "up") direction = "down";
        } else {
            if (direction !== "down") direction = "up";
        }
    }

    touchStartX = null;
    touchStartY = null;
}

// Rest of the code (unchanged)

// Clear the canvas
function clearCanvas() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Spawn food at a random position
function spawnFood() {
    apple.x = getRandomX();
    apple.y = getRandomY();
}

// Move the snake
function moveSnake() {
    if (isGameOver) {
        return;
    }

    // Create a new head for the snake
    const newHead = { x: snake[0].x, y: snake[0].y };

    // Check for collisions with the wall or itself
    if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        isGameOver = true;
        return;
    }

    // Add the new head to the beginning of the snake
    snake.unshift(newHead);

    // Check if the snake has eaten the food
    if (newHead.x === apple.x && newHead.y === apple.y) {
        // Increase the length of the snake
        spawnFood();
    } else {
        // Remove the tail segment if the snake didn't eat food
        snake.pop();
    }
}

// Draw the snake on the canvas
function drawSnake() {
    context.fillStyle = "green";
    snake.forEach(segment => {
        context.fillRect(segment.x * DOT_SIZE, segment.y * DOT_SIZE, DOT_SIZE, DOT_SIZE);
    });
}

// Draw the food on the canvas
function drawFood() {
    context.fillStyle = "red";
    context.fillRect(apple.x * DOT_SIZE, apple.y * DOT_SIZE, DOT_SIZE, DOT_SIZE);
}

// Draw the Game
function drawGame() {
    clearCanvas();
    drawFood();
    drawSnake();

    // Display the score
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 20);
}

// Game Over
function endGame() {
    clearCanvas();
    context.fillStyle = "red";
    context.font = "30px Arial";
    context.fillText("Game Over", CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2);
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, CANVAS_WIDTH / 2 - 30, CANVAS_HEIGHT / 2 + 30);
}

// Get a Random X Coordinate
function getRandomX() {
    return Math.floor(Math.random() * GRID_SIZE);
}

// Get a Random Y Coordinate
function getRandomY() {
    return Math.floor(Math.random() * GRID_SIZE);
}

// Check for Collisions
function checkCollision() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= GRID_SIZE ||
        snake[0].y < 0 ||
        snake[0].y >= GRID_SIZE
    ) {
        isGameOver = true; // Snake hit the wall
        return;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            isGameOver = true; // Snake collided with itself
            return;
        }
    }
}

// Start the Game
init();
