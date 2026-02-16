/**
 * Represents a standard enemy chicken.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    y = 350;
    width = 100;
    height = 100;
    health = 10;
    hitboxOffsetX = 0;
    hitboxOffsetY = 50;
    hitboxWidth = 30;
    hitboxHeight = 60;
    images_walking = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /**
     * Creates an instance of Chicken.
     * @param {number} [x] - Optional initial x-coordinate.
     */
    constructor(x = null) {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.images_walking);

        this.x = x !== null ? x : 400 + Math.random() * 1850;
        this.speed = 0.2 + Math.random() * 0.7;
        this.animate();
    }

    /**
     * Starts the movement and animation loops.
     */
    animate() {
        this.movingInterval = this.moveLeftRight(0, 2250);

        this.walkingAnimation = setInterval(() => {
            let i = this.currentImage % this.images_walking.length;
            let path = this.images_walking[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }

    /**
     * Handles death logic, plays animation, drops loot, and removes the object.
     */
    die() {
        clearInterval(this.walkingAnimation);
        clearInterval(this.movingInterval);

        this.loadImage('img/3_enemies_chicken/chicken_normal/2_dead/dead.png');
        this.speed = 0;

        this.hitboxWidth = 0;
        this.hitboxHeight = 0;


        setTimeout(() => {
            this.isRemoved = true;

            if (this.world) {
                const bottle = new ManaBottle(
                    this.x + this.width / 2,
                    400
                );
                this.world.manaBottles.push(bottle);
            }
        }, 1500);
    };
}
