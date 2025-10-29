class MovableObject{
    x = 100 ;
    y = 250 ;
    img;
    height = 150;
    width = 100;
    imageCache = [];
    currentImage = 0;
    speed = 0.2;
    otherDirection = false;
    speedY = 1.5;
    acceleration = 2.5;
    direction= 'left';
    health = 100;


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


    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr){
        arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
        });
    }

moveLeftRight(levelStart = -750, levelEnd = 2250) {
        setInterval(() => {
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
    };
            isColliding(mo) {
        return this.x + this.width > mo.x &&   
            this.x < mo.x + mo.width &&
            this.y + this.height > mo.y &&
            this.y < mo.y + mo.height;
    }
    hit(){
        this.health -= 20;
        if(this.health < 0){
            this.health = 0;
        }
}
    isDead(){
        return this.health == 0;    
}
}
