class CrazyChicken extends Chicken {
    y = 350;
    width = 80;
    height = 80;

    jumpHeight = 80;
    jumpSpeed = 6;
    isJumping = false;

    hitboxOffsetX = 10;  // Abstand links/rechts
    hitboxOffsetY = 40;  // Etwas weniger als Chicken, da kleiner
    hitboxWidth = 60;    // Schmaler, da width=80
    hitboxHeight = 40;   // Kleiner

    images_walking = [
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png'
    ];

    images_jumping = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    constructor(x = null) {
        super(x);

        // andere Bilder laden
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);

        // zufällig auf der Karte verteilen
        if (x === null) {
            this.x = 800 + Math.random() * 1450; // Auf das ganze Feld verteilt
        }
        this.speed = 0;

        // normales Chicken-Verhalten stoppen
        clearInterval(this.movingInterval);
        clearInterval(this.walkingAnimation);

        // eigene Animationen starten
        this.animateIdle();
        this.startJumping();
    }

    /* ---------------- IDLE ---------------- */

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

    /* ---------------- JUMP ---------------- */

    startJumping() {
        this.jumpInterval = setInterval(() => {
            if (!this.isJumping) {
                this.jump();
            }
        }, 3500);
    }

    jump() {
        this.isJumping = true;
        this.currentImage = 0;

        let startY = this.y;
        let peakY = startY - this.jumpHeight;

        // Jump Animation
        this.jumpAnimation = setInterval(() => {
            let i = this.currentImage % this.images_jumping.length;
            let path = this.images_jumping[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 120);

        // Hochspringen
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

    /* ---------------- DEATH ---------------- */

    die() {
        clearInterval(this.walkingAnimation);
        clearInterval(this.movingInterval);
        clearInterval(this.jumpInterval);
        clearInterval(this.jumpAnimation);
        clearInterval(this.upInterval);
        clearInterval(this.downInterval);

        this.loadImage(
            'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
        );
        this.speed = 0;

        setTimeout(() => {
            this.isRemoved = true;

            if (this.world) {
    const bottle = new ManaBottle(
        this.x + this.width / 2,
        this.y + this.height - 50
    );
    this.world.manaBottles.push(bottle);
}
        }, 1500);
    }
}

