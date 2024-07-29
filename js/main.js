
let id;

class Paddle {
    constructor () {
        this.width = 85;
        this.height = 12; 
        this.gameArea = document.getElementById("gameArea");  
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
            this.x = this.gameArea.offsetWidth - this.width; 
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
    constructor () {
        this.brickWidth = 60;
        this.brickHeight = 20;
        this.gameArea = document.getElementById("gameArea");
        this.x = 5;
        this.y = this.gameArea.offsetHeight - 50;
        this.brickArray = [];
        this.gameArea = document.getElementById("gameArea");
        this.createBricks();
    }

    createBricks () {
        const padding = 5;
        
        for (let row = 1; row < 2; row++) {
            for (let col = 1; col < 10; col++) {
    
            let x = col * (this.brickWidth + padding);
            let y = this.gameArea.offsetHeight - (row * (this.brickHeight + padding)) - 80;
    
            const brick = new Brick(x, y, this.brickWidth, this.brickHeight, this.gameArea);
            this.brickArray.push(brick);
            }
        }
    }
}


class Ball {
    constructor (brickArray) {
        this.width = 14;
        this.height = 14; 
        this.radius = this.width / 2;
        this.gameArea = document.getElementById("gameArea");  
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

    updatePosition() {
        this.ballElement.style.left = `${this.x}px`;
        this.ballElement.style.bottom = `${this.y}px`;
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
        if (this.y + this.width > this.gameArea.offsetHeight - this.radius) {  // Outside top.
            this.dy = -this.dy;
        }
        if (this.x < 0 || this.x + this.width > this.gameArea.offsetWidth - this.radius) {  // Outside left or right.
            this.dx = -this.dx; 
        }
        if (this.y < paddle.y) { // Bottom game over.
            clearInterval (id);
            console.log ("GAME OVER!");
        }     
    }

    checkPaddleCollision () {
        if (this.x > paddle.x && this.x < paddle.x + paddle.width && this.y < paddle.y + paddle.height) {
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
                    clearInterval(id);
                    console.log("CONGRATULATIONS, YOU HAVE WON!");
                }
            }
        });
    }
    
    updatePosition() {
        this.ballElement.style.left = `${this.x}px`;
        this.ballElement.style.bottom = `${this.y}px`;
    }
    
}

document.addEventListener("keydown", (event) => {

    if (event.code === 'ArrowLeft') {
        paddle.move(-1);    
    } 
    if (event.code === 'ArrowRight') {
        paddle.move(1); 
    }
    if (event.code === 'Space') {
        if (!id) {
            id = setInterval(() => {
                ball.move();
            }, 8);
        }  
    }         
});


const wall = new Wall();
const paddle = new Paddle(); 
const ball = new Ball(wall.brickArray); 


