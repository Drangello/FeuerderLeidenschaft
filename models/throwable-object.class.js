class ThrowableObject extends MovableObject {
    images_rotation = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor(x, y, otherDirection) {
        super();
        this.loadImages(this.images_rotation);
        this.loadImage(this.images_rotation[0]);

        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;

        // Startgeschwindigkeit
        this.speedY = 15;                  // nach oben
        this.acceleration = 1.5;           // Schwerkraft
        this.speedX = otherDirection ? -8 : 8;

        this.groundY = 350; // Bodenhöhe (anpassen, wo dein Charakter steht)
        this.applyGravity();
        this.animate();
    }

    applyGravity() {
        let gravityInterval = setInterval(() => {
            if (this.y < this.groundY || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = this.groundY;
                this.speedY = 0;
                this.speedX = 0;           // stoppt seitliche Bewegung
                clearInterval(gravityInterval);
            }
        }, 1000 / 25);
    }

    animate() {
        let moveInterval = setInterval(() => {
            this.x += this.speedX;
        }, 25);

        let i = 0;
        let rotationInterval = setInterval(() => {
            this.img = this.imageCache[this.images_rotation[i]];
            i = (i + 1) % this.images_rotation.length;
        }, 100);
    }
}