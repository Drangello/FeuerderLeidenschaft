class Character extends MovableObject {
    y = 150;
    x = -20;
    width = 200;
    height = 300;

    images_walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    constructor() {
        super();
        this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.images_walking);
        this.animate();
    }

    animate() {
        setInterval(() => {
            let i = this.currentImage % this.images_walking.length;
            let path = this.images_walking[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 150);
    }

    jump() {
        // TODO: add jump behavior
    }
}