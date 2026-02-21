/**
 * Represents a crazy variant of the chicken enemy that jumps.
 * @extends Chicken
 */
class CrazyChicken extends Chicken {
    y = 350;
    width = 80;
    height = 80;

    jumpHeight = 80;
    jumpSpeed = 6;
    isJumping = false;

    hitboxOffsetX = 0;
    hitboxOffsetY = 40;
    hitboxWidth = 20;
    hitboxHeight = 30;

    images_walking = [
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png'
    ];

    images_jumping = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /**
     * Creates an instance of CrazyChicken.
     * @param {number} [x] - Optional initial x-coordinate.
     */
    constructor(x = null) {
        super(x);

        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);

        if (x === null) {
            this.x = 800 + Math.random() * 1450;
        }
        this.speed = 0;

        clearInterval(this.movingInterval);
        clearInterval(this.walkingAnimation);

        this.animateIdle();
        this.startJumping();
    }

    /**
     * Starts the idle animation loop.
     */
    animateIdle() {
        this.walkingAnimation = setInterval(() => {
            if (!this.isJumping) {
                let i = this.currentImage % this.images_walking.length;
                let path = this.images_walking[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 200);
    }

    /**
     * Starts the jumping behavior loop.
     */
    startJumping() {
        this.jumpInterval = setInterval(() => {
            if (!this.isJumping) {
                this.jump();
            }
        }, 3500);
    }

    /**
     * Executes a jump action with animation and physics.
     */
    jump() {
        this.isJumping = true;
        this.currentImage = 0;

        let startY = this.y;
        let peakY = startY - this.jumpHeight;

        this.jumpAnimation = setInterval(() => {
            let i = this.currentImage % this.images_jumping.length;
            let path = this.images_jumping[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 120);

        this.upInterval = setInterval(() => {
            if (this.y > peakY) {
                this.y -= this.jumpSpeed;
            } else {
                clearInterval(this.upInterval);
                clearInterval(this.jumpAnimation);
                this.fallDown(startY);
            }
        }, 30);
    }

    /**
     * Handles the falling physics after a jump.
     * @param {number} startY - The y-coordinate to fall back to.
     */
    fallDown(startY) {
        this.downInterval = setInterval(() => {
            if (this.y < startY) {
                this.y += this.jumpSpeed;
            } else {
                this.y = startY;
                clearInterval(this.downInterval);
                this.isJumping = false;
                this.currentImage = 0;
            }
        }, 30);
    }

    /**
     * to fully stop the enemy's behavior.
     * Prevents memory leaks and unintended updates after death.
     */
    stopAllIntervals() {
        const intervals = [
            this.walkingAnimation,
            this.movingInterval,
            this.jumpInterval,
            this.jumpAnimation,
            this.upInterval,
            this.downInterval
        ];
        intervals.forEach(interval => clearInterval(interval))
    }

    /**
     * Displays the static dead sprite
     * and stops any remaining movement.
     */
    showDeadImage() {
        this.loadImage('img/3_enemies_chicken/chicken_small/2_dead/dead.png');
        this.speed = 0;
    }

    /**
     * Disables collision detection by
     * setting the hitbox dimensions to zero.
     */
    disableHitbox() {
        this.hitboxWidth = 0;
        this.hitboxHeight = 0;
    }

    /**
     * Spawns a mana bottle after a short delay
     * and marks the enemy as removed.
     * The bottle is added to the world's mana collection.
     */
    dropManaBottle() {
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
    }

    /**
     * Handles the complete death sequence:
     * - Stops all active intervals
     * - Shows the dead image
     * - Disables the hitbox
     * - Drops a mana bottle
     */
    die() {
        this.stopAllIntervals();
        this.showDeadImage();
        this.disableHitbox();
        this.dropManaBottle();
    }
}

