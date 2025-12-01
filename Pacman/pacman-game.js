// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let score = 0;
let gameRunning = false;

//Pac-Man properties
const pacman = {
    x: 50,
    y: 50,
    radius: 15,
    speed: 3,
    direction: 'right',
    mouthAngle: 0.2,
    mouthSpeed: 0.1
};

//Dots array
let dots = [];
const dotCount = 50;

//Ghosts array
let ghosts = [];
const ghostCount = 3;

//Initialize game
function initGame() {
    // Create dots
    dots = [];
    for (let i = 0; i < dotCount; i++) {
        dots.push({
            x: Math.random() * (canvas.width - 20) + 10,
            y: Math.random() * (canvas.height - 20) + 10,
            radius: 3,
            collected: false
        });
    }
    
    //Create ghosts
    ghosts = [];
    for (let i = 0; i < ghostCount; i++) {
        ghosts.push({
            x: Math.random() * (canvas.width - 30) + 15,
            y: Math.random() * (canvas.height - 30) + 15,
            radius: 12,
            speed: 1.5,
            color: ['#FF0000', '#00FFFF', '#FFB8FF'][i] // Red, Cyan, Pink
        });
    }
    
    score = 0;
    scoreElement.textContent = score;
    pacman.x = 50;
    pacman.y = 50;
}

//Draw Pac-Man
function drawPacman() {
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    
    //Rotate based on direction
    switch(pacman.direction) {
        case 'right': ctx.rotate(0); break;
        case 'down': ctx.rotate(Math.PI / 2); break;
        case 'left': ctx.rotate(Math.PI); break;
        case 'up': ctx.rotate(-Math.PI / 2); break;
    }
    
    // Animate mouth
    pacman.mouthAngle += pacman.mouthSpeed;
    if (pacman.mouthAngle > 0.8 || pacman.mouthAngle < 0.2) {
        pacman.mouthSpeed = -pacman.mouthSpeed;
    }
    
    //Draw Pac-Man body
    ctx.beginPath();
    ctx.arc(0, 0, pacman.radius, pacman.mouthAngle * Math.PI, (2 - pacman.mouthAngle) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = '#FFFF00';
    ctx.fill();
    
    ctx.restore();
}

//Draw dots
function drawDots() {
    dots.forEach(dot => {
        if (!dot.collected) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }
    });
}

//Draw ghosts
function drawGhosts() {
    ghosts.forEach(ghost => {
        // Ghost body
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, ghost.radius, Math.PI, 0, false);
        ctx.lineTo(ghost.x + ghost.radius, ghost.y + ghost.radius);
        ctx.lineTo(ghost.x - ghost.radius, ghost.y + ghost.radius);
        ctx.closePath();
        ctx.fillStyle = ghost.color;
        ctx.fill();
        
        //Ghost eyes
        ctx.beginPath();
        ctx.arc(ghost.x - 4, ghost.y - 2, 3, 0, Math.PI * 2);
        ctx.arc(ghost.x + 4, ghost.y - 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(ghost.x - 4, ghost.y - 2, 1, 0, Math.PI * 2);
        ctx.arc(ghost.x + 4, ghost.y - 2, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    });
}

//Move Pac-Man
function movePacman() {
    switch(pacman.direction) {
        case 'right': pacman.x += pacman.speed; break;
        case 'left': pacman.x -= pacman.speed; break;
        case 'down': pacman.y += pacman.speed; break;
        case 'up': pacman.y -= pacman.speed; break;
    }
    
    //Boundary checking
    if (pacman.x < pacman.radius) pacman.x = pacman.radius;
    if (pacman.x > canvas.width - pacman.radius) pacman.x = canvas.width - pacman.radius;
    if (pacman.y < pacman.radius) pacman.y = pacman.radius;
    if (pacman.y > canvas.height - pacman.radius) pacman.y = canvas.height - pacman.radius;
}

// Move ghosts (simple AI)
function moveGhosts() {
    ghosts.forEach(ghost => {
        // Simple movement towards Pac-Man
        if (ghost.x < pacman.x) ghost.x += ghost.speed;
        if (ghost.x > pacman.x) ghost.x -= ghost.speed;
        if (ghost.y < pacman.y) ghost.y += ghost.speed;
        if (ghost.y > pacman.y) ghost.y -= ghost.speed;
    });
}



//Check collisions
function checkCollisions() {
    // Check dot collection
    dots.forEach(dot => {
        if (!dot.collected) {
            const dx = pacman.x - dot.x;
            const dy = pacman.y - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < pacman.radius + dot.radius) {
                dot.collected = true;
                score += 10;
                scoreElement.textContent = score;
            }
        }
    });
    
    //Check ghost collisions
    ghosts.forEach(ghost => {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < pacman.radius + ghost.radius) {
            gameOver();
        }
    });
    // Check win condition
    const remainingDots = dots.filter(dot => !dot.collected).length;
    if (remainingDots === 0) {
        winGame();
    }
}

// Game over function
function gameOver() {
    gameRunning = false;
    alert('Game Over! Ghost got you! Final Score: ' + score);
    resetGame();
}

// Win game function
function winGame() {
    gameRunning = false;
    alert('You Win! All dots collected! Final Score: ' + score);
    resetGame();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawDots();
    drawGhosts();
    drawPacman();
    
    // Update game state
    movePacman();
    moveGhosts();
    checkCollisions();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameLoop();
    }
}

// Reset game
function resetGame() {
    gameRunning = false;
    initGame();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
    drawGhosts();
    drawPacman();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight': pacman.direction = 'right'; break;
        case 'ArrowLeft': pacman.direction = 'left'; break;
        case 'ArrowDown': pacman.direction = 'down'; break;
        case 'ArrowUp': pacman.direction = 'up'; break;
    }
});

// Initialize game on load
window.onload = function() {
    initGame();
    drawDots();
    drawGhosts();
    drawPacman();
};