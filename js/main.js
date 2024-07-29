
class Game {
    constructor() {
        this.gameArea = document.getElementById("gameArea");
        this.wall = new Wall(this.gameArea);
        this.paddle = new Paddle(this.gameArea);
        this.ball = new Ball(this.wall.brickArray, this.paddle, this.gameArea);
        this.id = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (event.code === 'ArrowLeft') {
                this.paddle.move(-1);
            }
            if (event.code === 'ArrowRight') {
                this.paddle.move(1);
            }
            if (event.code === 'Space') {
                if (!this.id) {
                    this.id = setInterval(() => {
                        this.ball.move();
                    }, 8);
                }
            }
        });
    }

    gameOver() {
        clearInterval(this.id);
        console.log("GAME OVER!");
    }

    win() {
        clearInterval(this.id);
        console.log("CONGRATULATIONS, YOU HAVE WON!");
    }
}

class Paddle {
    constructor (gameArea) {
        this.width = 85;
        this.height = 12; 
        this.gameArea = gameArea;
        this.x = (this.gameArea.offsetWidth - this.width) /2;  
        this.y = 5;
        this.speed = 20;

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
            this.x = this.gameArea.offsetWidth - this.width - 6;  // Hard-coded to make up for the paddle and game area borders.
        }
        this.paddleElement.style.left = `${this.x}px`;
    }
}

class Brick {
    constructor (x, y, width, height, gameArea) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
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
        this.distanceFromTop = 65;
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
        this.radius = this.width / 2;
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

    checkWallCollision () {
        if (this.y + this.width > this.gameArea.offsetHeight - this.radius) {  // Top.
            this.dy = -this.dy;
        }
        if (this.x < 0 || this.x + this.width > this.gameArea.offsetWidth - this.radius) {  // Left or right.
            this.dx = -this.dx; 
        }
        if (this.y < this.paddle.y) { // Bottom game over.
            game.gameOver();
        }     
    }

    checkPaddleCollision () {
        if (this.x > this.paddle.x && this.x < this.paddle.x + this.paddle.width && this.y < this.paddle.y + this.paddle.height) {
            this.dy = -this.dy;
            }
    }

    checkBrickCollision() {
        this.brickArray.forEach((brick, index) => {
            if (
                this.x + this.width > brick.x &&
                this.x < brick.x + brick.width &&
                this.y + this.height > brick.y &&
                this.y < brick.y + brick.height
            ) {
                this.dy = -this.dy;
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

