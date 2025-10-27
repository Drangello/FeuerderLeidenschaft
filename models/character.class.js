class Character extends MovableObject {
    y = 150;
    x = -20;
    width = 200;
    height = 300;
    speed = 5;
    speedY = 0;
    acceleration = 2;
    jumpHeight = 25;

    images_walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
        images_jumping = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    world;
    constructor() {
        super();
        this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.applyGravity();    
        this.animate();
    }

    animate() {
                setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){
                this.x += this.speed;
                this.otherDirection = false;
            }

            if(this.world.keyboard.LEFT && this.x > -600){
                this.x -= this.speed;
                this.otherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }
            this.world.camera_x = -this.x + 120;
        },1000 / 60);
            

        setInterval(() => {
                if (this.isAboveGround()) {
                this.images_jumping;
                let i = this.currentImage % this.images_jumping.length;
                let path = this.images_jumping[i];
                this.img = this.imageCache[path];
                this.currentImage++;
                return;
                }
            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
                
                //walk animation
            let i = this.currentImage % this.images_walking.length;
            let path = this.images_walking[i];
            this.img = this.imageCache[path];
            this.currentImage++;
            }
        }, 50);
    }

    jump() {
        this.speedY = this.jumpHeight;
    }
}