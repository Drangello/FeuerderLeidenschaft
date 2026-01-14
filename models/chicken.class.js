class Chicken extends MovableObject {
    y = 350;
    width = 100;
    height = 100;
    health = 10;
    images_walking = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.images_walking);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.2 + Math.random() * 0.7;
        this.animate();
    }

    animate() {
        this.movingInterval = this.moveLeftRight(0, 2250);

        this.walkingAnimation = setInterval(() => {
            let i = this.currentImage % this.images_walking.length;
            let path = this.images_walking[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }

    die() {
        clearInterval(this.walkingAnimation);
        clearInterval(this.movingInterval);

        this.loadImage('img/3_enemies_chicken/chicken_normal/2_dead/dead.png');
        this.speed = 0;

        // Entferne das Chicken nach kurzer Zeit
        setTimeout(() => {
            this.isRemoved = true;

            // Flasche droppen beim Tod
            if (this.world) {
    const bottle = new ManaBottle(
        this.x + this.width / 2,
        this.y + this.height - 50
    );
    this.world.manaBottles.push(bottle);
}
        }, 1500);
    };
}
