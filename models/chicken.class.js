class Chicken extends MovableObject{  
    y = 350;
    width = 100;
    height = 100;
    images_walking = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor(){
        super().loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.2 + Math.random() * 0.7;
        
        this.animate();
    }

        animate() {
        setInterval(() => {
        this.playAnimation(this.images_walking);
        }, 100);
    }
}