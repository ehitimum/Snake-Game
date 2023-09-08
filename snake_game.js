// Constants
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const TILE_SIZE = 10;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const GRID_SIZE = CANVAS_WIDTH / TILE_SIZE;

// Snake properties
let snake = [{ x: 5, y: 5 }];
let dx = 1;
let dy = 0;
let foodX, foodY;
let isGameOver = false;

// Touch control variables
let touchStartX, touchStartY;

// Initialize the game
function init() {
    // Initialize snake position and food
    snake = [{ x: 5, y: 5 }];
    dx = 1;
    dy = 0;
    spawnFood();

    // Initialize touch controls
    touchStartX = null;
    touchStartY = null;

    // Set up game loop
    isGameOver = false;
    gameLoop();
}

// Game loop
function gameLoop() {
    if (isGameOver) {
        // Handle game over logic
        return;
    }

    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();

    // Call the next frame
    requestAnimationFrame(gameLoop);
}

// Handle touch events for touch-based controls
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

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
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
        } else {
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
        }
    } else {
        if (deltaY > 0) {
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
        } else {
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
        }
    }

    touchStartX = null;
    touchStartY = null;
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Spawn food at a random position
function spawnFood() {
    foodX = Math.floor(Math.random() * GRID_SIZE);
    foodY = Math.floor(Math.random() * GRID_SIZE);
}

// Move the snake
function moveSnake() {
    if (isGameOver) {
        return;
    }

    // Create a new head for the snake
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for collisions with the wall or itself
    if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y >= GRID_SIZE ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        isGameOver = true;
        return;
    }

    // Add the new head to the beginning of the snake
    snake.unshift(newHead);

    // Check if the snake has eaten the food
    if (newHead.x === foodX && newHead.y === foodY) {
        // Increase the length of the snake
        spawnFood();
    } else {
        // Remove the tail segment if the snake didn't eat food
        snake.pop();
    }
}

// Draw the snake on the canvas
function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });
}

// Draw the food on the canvas
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(foodX * TILE_SIZE, foodY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

// Start the game
init();
