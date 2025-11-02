class MovableObject extends DrawableObject {

    speed = 0.2;
    otherDirection = false;
    speedY = 1.5;
    acceleration = 2.5;
    direction= 'left';
    health = 100;
    lastHit = 0;


applyGravity() {
    setInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.y = 150;     // Bodenposition
            this.speedY = 0;  // Stillstand
        }
    }, 1000 / 25);
}
    isAboveGround(){
        return this.y < 150;
    }   ;



moveLeftRight(levelStart = -750, levelEnd = 2250) {
    const interval = setInterval(() => {
        if (this.direction === "left") {
            this.x -= this.speed;
            this.otherDirection = false;
            if (this.x <= levelStart) {
                this.direction = "right";
            }
        } else {
            this.x += this.speed;
            this.otherDirection = true;
            if (this.x + this.width >= levelEnd) {
                this.direction = "left";
            }
        }
    }, 1000 / 60);

    return interval; // <--- das ist neu!
}

    remove() {
        this.isRemoved = true;
            
    };
            isColliding(mo) {
        return this.x + this.width > mo.x &&   
            this.x < mo.x + mo.width &&
            this.y + this.height > mo.y &&
            this.y < mo.y + mo.height;
    }
hit() {
    if (this.isHurt()) return; 
    this.health -= 20;
    if (this.health < 0) {
        this.health = 0;
        this.die?.();
    } else {
        this.lastHit = new Date().getTime();
    }
        if (this.world && this.world.statusBar) {
        this.world.statusBar.setPercent(this.health);
    }

}
    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
        timepassed = timepassed / 1000; //Difference in s
        return timepassed < 3;
    }
    isDead(){
        return this.health == 0;    
}
}
