
class Game {
    constructor() {
        this.gameArea = document.getElementById("gameArea");
        this.startScreen = document.getElementById("startScreen");
        this.winScreen = document.getElementById("winScreen");
        this.gameOverScreen = document.getElementById("gameOverScreen");
        this.playButton = document.getElementById("playButton");
        this.playAgainWinButton = document.getElementById("playAgainWinButton");
        this.playAgainButton = document.getElementById("playAgainButton");
        this.gameInstructions = document.getElementById("gameInstructions");

        this.wall = null;
        this.paddle = null;
        this.ball = null;
        this.id = null;

        this.showStartScreen();
        this.initializeEventListeners();
    }

    showStartScreen() {
        this.startScreen.style.display = "flex";
    }

    clearGameArea () {
        this.gameArea.innerHTML = "";  // To remove all elements within de game area.
    }

    startGame() {
        this.startScreen.style.display = "none";
        this.winScreen.style.display = "none";
        this.gameOverScreen.style.display = "none";
        this.gameArea.style.display = "flex";
        this.gameInstructions.style.display = "flex";
        this.resetGame();

        document.addEventListener("keydown", (event) => {
            if (event.code === 'Space') {
                this.gameInstructions.style.display = "none";
                if (!this.id) {
                    this.id = setInterval(() => {
                        this.ball.move();
                    }, 8);
                }
            }
            
            if (!this.id) return; // To ensure that the loop is running.
            
            if (event.code === 'ArrowLeft') {
                this.paddle.move(-1);
            }
            if (event.code === 'ArrowRight') {
                this.paddle.move(1);
            }
        });
    }

    resetGame() {
        this.clearGameArea();
        this.wall = new Wall(this.gameArea);
        this.paddle = new Paddle(this.gameArea);
        this.ball = new Ball(this.wall.brickArray, this.paddle, this.gameArea);
    }

    initializeEventListeners() {
        this.playButton.addEventListener("click", () => {
            this.startGame();
        });

        this.playAgainWinButton.addEventListener("click", () => {
            this.startGame();
        });

        this.playAgainButton.addEventListener("click", () => {
            this.startGame();
        });
    }

    gameOver() {
        clearInterval(this.id);
        this.id = null;
        this.gameArea.style.display = "none";
        this.gameOverScreen.style.display = "flex";
    }

    win() {
        clearInterval(this.id);
        this.id = null;
        this.gameArea.style.display = "none";
        this.winScreen.style.display = "flex";
    }
}

class Paddle {
    constructor (gameArea) {
        this.width = 85;
        this.height = 12; 
        this.gameArea = gameArea;
        this.x = (this.gameArea.offsetWidth - this.width) /2;  
        this.y = 5;
        this.speed = 18;

        this.paddleElement = document.createElement("div");       
        this.paddleElement.id = "paddle";
        this.paddleElement.style.left = `${this.x}px`;
        this.paddleElement.style.bottom = `${this.y}px`;
        this.paddleElement.style.width = `${this.width}px`;
        this.paddleElement.style.height = `${this.height}px`;
        this.gameArea.appendChild(this.paddleElement);
    }

    move(direction) {
        this.x += direction * this.speed; 

        if (this.x < 0) {  
            this.x = 0; 
        }    
        if (this.x + this.width > this.gameArea.offsetWidth) {
            this.x = this.gameArea.offsetWidth - this.width;
        }
        this.paddleElement.style.left = `${this.x}px`;
    }
}

class Brick {
    constructor (x, y, width, height, gameArea) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gameArea = gameArea;

        this.brickElement = document.createElement("div");
        this.brickElement.classList.add("bricks");
        this.brickElement.style.left = `${x}px`;
        this.brickElement.style.bottom = `${y}px`;
        this.brickElement.style.width = `${this.width}px`;
        this.brickElement.style.height = `${this.height}px`;
        gameArea.appendChild(this.brickElement);
    }
}

class Wall {
    constructor (gameArea) {
        this.brickWidth = 60;
        this.brickHeight = 20;
        this.gameArea = gameArea;
        this.distanceFromTop = 50;
        this.x = 5;
        this.y = this.gameArea.offsetHeight - this.distanceFromTop;
        this.brickArray = [];
        this.createBricks();
    }

    createBricks () {
        const padding = 5;
        
        for (let row = 1; row < 4; row++) {
            for (let col = 1; col < 10; col++) {
            
            let x = col * (this.brickWidth + padding);
            let y = this.gameArea.offsetHeight - (row * (this.brickHeight + padding)) - this.distanceFromTop;
    
            const brick = new Brick(x, y, this.brickWidth, this.brickHeight, this.gameArea);
            this.brickArray.push(brick);
            }
        }
    }
}

class Ball {
    constructor (brickArray, paddle, gameArea) {
        this.width = 14;
        this.height = 14; 
        this.gameArea = gameArea;
        this.paddle = paddle;  
        this.x = (this.gameArea.offsetWidth - this.width) /2;  
        this.y = 20;
        this.dx = 1;  // Direction (45 degrees).
        this.dy = 1; 
        this.brickArray = brickArray;

        this.ballElement = document.createElement("div");       
        this.ballElement.id = "ball";
        this.ballElement.style.left = `${this.x}px`;
        this.ballElement.style.bottom = `${this.y}px`;
        this.ballElement.style.width = `${this.width}px`;
        this.ballElement.style.height = `${this.height}px`;
        gameArea.appendChild(this.ballElement);
    } 

    move() {
        this.x += this.dx;
        this.y += this.dy;  
        this.checkCollitions();
        this.updatePosition();     
    }

    checkCollitions () {
        this.checkWallCollision();
        this.checkPaddleCollision();
        this.checkBrickCollision();
    }

    checkWallCollision() {
        if (this.y + this.height > this.gameArea.offsetHeight) {  // Top collision
            this.dy = -this.dy;
        }
        if (this.x < 0) {  // Left collision
            this.dx = Math.abs(this.dx);  
        } else if (this.x + this.width > this.gameArea.offsetWidth) {  // Right collision
            this.dx = -Math.abs(this.dx);  
        }
        if (this.y < 0) { // Bottom game over
            game.gameOver();
        }
    }

    checkPaddleCollision() {
        const nextX = this.x + this.dx;
        const nextY = this.y + this.dy;
    
        if (nextX < this.paddle.x + this.paddle.width &&
            nextX + this.width > this.paddle.x &&
            nextY < this.paddle.y + this.paddle.height &&
            nextY + this.height > this.paddle.y) {
    
            const ballBottom = this.y;
            const ballTop = this.y + this.height;
            const ballLeft = this.x;
            const ballRight = this.x + this.width;
            const paddleTop = this.paddle.y + this.paddle.height;
            const paddleLeft = this.paddle.x;
            const paddleRight = this.paddle.x + this.paddle.width;
    
            if (ballBottom >= paddleTop - Math.abs(this.dy)) {
                this.dy = -Math.abs(this.dy);
            } else if (ballRight <= paddleLeft + Math.abs(this.dx)) {
                this.dx = -Math.abs(this.dx);
            } else if (ballLeft >= paddleRight - Math.abs(this.dx)) {
                this.dx = Math.abs(this.dx);
            } else {
                this.dy = -this.dy;
            }
        }
    }
   
    checkBrickCollision() {
        this.brickArray.forEach((brick, index) => {
            if (
                this.x < brick.x + brick.width &&
                this.x + this.width > brick.x &&
                this.y < brick.y + brick.height &&
                this.y + this.height > brick.y
            ) {
                const ballCenterX = this.x + this.width / 2;  // Determine the center of the ball and the brick
                const ballCenterY = this.y + this.height / 2;
                const brickCenterX = brick.x + brick.width / 2;
                const brickCenterY = brick.y + brick.height / 2;
    
                const distX = Math.abs(ballCenterX - brickCenterX);  // Calculate the distance between the centers
                const distY = Math.abs(ballCenterY - brickCenterY);
    
                const overlapX = (this.width / 2 + brick.width / 2) - distX;  // Calculate the overlap on each axis
                const overlapY = (this.height / 2 + brick.height / 2) - distY;
    
                if (overlapX > overlapY) {  // Determine the direction of collision
                    if (this.y < brickCenterY) {
                        this.dy = -Math.abs(this.dy); 
                    } else {
                        this.dy = Math.abs(this.dy); 
                    }

                } else {
                    if (this.x < brickCenterX) {
                        this.dx = -Math.abs(this.dx); 
                    } else {
                        this.dx = Math.abs(this.dx); 
                    }
                }
    
                document.getElementById('gameArea').removeChild(brick.brickElement);
                this.brickArray.splice(index, 1);
    
                if (this.brickArray.length === 0) {
                    game.win();
                }
            }
        });
    }

    updatePosition() {
        this.ballElement.style.left = `${this.x}px`;
        this.ballElement.style.bottom = `${this.y}px`;
    }  
}

const game = new Game();

