class Character extends MovableObject {
    y = 150;
    x = -20;
    width = 200;
    height = 300;
    speed = 2;

    images_walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    world;
    constructor() {
        super().loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
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
            this.world.camera_x = -this.x + 120;
            1000 / 60});
            

        setInterval(() => {
            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
                
                //walk animation
                this.playAnimation(this.images_walking);
            }
        }, 50);
    }

    jump() {
        // TODO: add jump behavior
    }
}