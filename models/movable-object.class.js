/**
 * Base class for all moving objects in the game.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {

    speed = 0.2;
    otherDirection = false;
    speedY = 1.5;
    acceleration = 2.5;
    direction = 'left';
    health = 100;
    lastHit = 0;


<<<<<<< HEAD
    /**
     * Applies gravity to the object, pulling it downwards.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = 150;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean} True if above ground.
     */
    isAboveGround() {
        return this.y < 150;
    };


    /**
     * Moves the object back and forth between two points.
     * @param {number} levelStart - Left boundary.
     * @param {number} levelEnd - Right boundary.
     * @returns {number} The interval ID.
     */
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

        return interval;
    }
=======
    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    };

    loadImages(arr){
        arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
        });
    };

    playAnimation(images){
             let i = this.currentImage % this.images_walking.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
            }
>>>>>>> 575f1ab20bf9e59fec3bcd419e4d9b7c4b0f3864

    /**
     * Marks the object as removed.
     */
    remove() {
        this.isRemoved = true;
    };

    /**
     * Checks for collision with another object.
     * @param {MovableObject} mo - The other object.
     * @returns {boolean} True if colliding.
     */
    isColliding(mo) {
        const ax = this.x + (this.hitboxOffsetX || 0);
        const ay = this.y + (this.hitboxOffsetY || 0);
        const aw = (this.hitboxWidth || this.width);
        const ah = (this.hitboxHeight || this.height);

        const bx = mo.x + (mo.hitboxOffsetX || 0);
        const by = mo.y + (mo.hitboxOffsetY || 0);
        const bw = (mo.hitboxWidth || mo.width);
        const bh = (mo.hitboxHeight || mo.height);

        return ax + aw > bx &&
            ax < bx + bw &&
            ay + ah > by &&
            ay < by + bh;
    }

    /**
     * Reduces health when hit and updates status bar if applicable.
     */
    hit() {
        if (this.isHurt()) return;
        this.health -= 20;

        if (this.health <= 0) {
            this.health = 0;
            this.die?.();
        } else {
            this.lastHit = new Date().getTime();
            this.playHurtAnimation?.();
        }
        if (this instanceof Character && this.world && this.world.statusBar) {
            this.world.statusBar.setPercent(this.health);
        }

    }

    /**
     * Checks if the object is currently in a hurt state (cooldown).
     * @returns {boolean} True if hurt.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 3;
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} True if health is 0.
     */
    isDead() {
        return this.health == 0;
    }
}
