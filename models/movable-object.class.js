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

    moveRight(){
            console.log('Moving right');
    };

    moveLeft(){
                setInterval(() =>{
            this.x -= this.speed;
        }, 1000 /  60);
    };
}
