
        // Collision with bricks.
        
        this.brickArray.forEach(item => {
            if (this.x > item.x && this.x < item.x + item.width && this.y > item.y && this.y < item.y + item.height) {
                this.dy = -this.dy;
            }    
        });
     
        