let brickArray = []; 
let id;

class Paddle {
    constructor () {
        this.width = 85;
        this.height = 12; 
        this.gameArea = document.getElementById("gameArea");  // By doing this I can access the div's properties.
        this.x = (this.gameArea.offsetWidth - this.width) /2;  
        this.y = 5;
        this.speed = 10;
        this.createPaddle(); 
    }

   createPaddle () {
        this.paddleElement = document.createElement("div");       
        this.paddleElement.id = "paddle";

        this.paddleElement.style.left = `${this.x}px`;
        this.paddleElement.style.bottom = `${this.y}px`;
        this.paddleElement.style.width = `${this.width}px`;
        this.paddleElement.style.height = `${this.height}px`;

        gameArea.appendChild(this.paddleElement);
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

class Ball {
    constructor () {
        this.width = 14;
        this.height = 14; 
        this.radius = this.width / 2;
        this.gameArea = document.getElementById("gameArea");  
        this.x = (this.gameArea.offsetWidth - this.width) /2;  
        this.y = 20;
        this.dx = 1;  // Direction (45 degrees).
        this.dy = 1; 
        this.createBall();
        
    }

    createBall () {
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
        
        if (this.y + this.width > this.gameArea.offsetHeight - this.radius) {  // Outside top.
            this.dy = -this.dy;
        }
        if (this.x < 0 || this.x + this.width > this.gameArea.offsetWidth - this.radius) {  // Outside left or right.
            this.dx = -this.dx; 
        }
        if (this.x > paddle.x && this.x < paddle.x + paddle.width && this.y < paddle.y + paddle.height) { // Bottom paddle.
            this.dy = -this.dy;
            } else if (this.y < paddle.y) { // Bottom game over.
                clearInterval (id);
                console.log ("GAME OVER!")
        }  
        
        // Collision with bricks goes down here.....
        
        /*
        Array.forEach(item => {
            if (this.x > item.x && this.x < item.x + item.width && this.y > item.y && this.y < item.y + item.height) {
                this.dy = -this.dy;
            }    
        });
        */
       
        this.ballElement.style.left = `${this.x}px`;
        this.ballElement.style.bottom = `${this.y}px`;
    }
    
}

class Wall {
    constructor () {
        this.width = 60;
        this.height = 20; 
        this.gameArea = document.getElementById("gameArea");
        this.x = 5;  
        this.y = this.gameArea.offsetHeight - 50; 
        this.createBricks();

    }

    createBricks () {
        const padding = 5;
        

        for (let row = 1; row < 4; row++) {
            for (let col = 1; col < 10; col++) {

            let x = col * (this.width + padding);
            let y = this.gameArea.offsetHeight - (row * (this.height + padding)) - 50;

            this.brickElement = document.createElement("div");       
            this.brickElement.classList.add("bricks");

            this.brickElement.style.left = `${x}px`;
            this.brickElement.style.bottom = `${y}px`;
            this.brickElement.style.width = `${this.width}px`;
            this.brickElement.style.height = `${this.height}px`;

            gameArea.appendChild(this.brickElement);

            brickArray.push (this.brickElement);
            }
        }
        console.log (brickArray);
        return brickArray;
    }
}

// To trigger everything from here and start the game.

/*
class Game {
    constructor () {

    }
}
*/

document.addEventListener("keydown", (event) => {
    if (event.code === 'ArrowLeft') {
        paddle.move(-1);    
    } 
    if (event.code === 'ArrowRight') {
        paddle.move(1); 
    }
    if (event.code === 'Space') {
        id = setInterval( () => {
            ball.move();
        }, 12);
    } 
});


const wall = new Wall();
const paddle = new Paddle(); 
const ball = new Ball(wall.brickArray); 


