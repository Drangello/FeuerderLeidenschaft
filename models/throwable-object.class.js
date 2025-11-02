class ThrowableObject extends MovableObject {
    hitboxOffsetX = 5;
    hitboxOffsetY = 5;
    hitboxWidth = 15;
    hitboxHeight = 15;

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
        this.world = world;

        // Startgeschwindigkeit
        this.speedY = 15;                  // nach oben
        this.acceleration = 1.5;           // Schwerkraft
        this.speedX = otherDirection ? -8 : 8;

        this.groundY = 350; // Bodenhöhe (anpassen, wo dein Charakter steht)
        this.applyGravity();
        this.animate();
        
    }

    applyGravity() {
    this.gravityInterval = setInterval(() => {
        if (this.y < this.groundY || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.y = this.groundY;
            this.speedY = 0;
            this.speedX = 0;
            clearInterval(this.gravityInterval);
            setTimeout(() => this.remove(), 300);
        }
    }, 1000 / 25);
}

animate() {
    this.moveInterval = setInterval(() => {
        this.x += this.speedX;
        this.checkEnemyCollision();
    }, 25);

    let i = 0;
    this.rotationInterval = setInterval(() => {
        this.img = this.imageCache[this.images_rotation[i]];
        i = (i + 1) % this.images_rotation.length;
    }, 100);
}

    checkEnemyCollision() {
        if (!this.world || !this.world.level || !this.world.level.enemies) return;

        this.world.level.enemies.forEach(enemy => {
            if (this.isCollidingWithHitbox(enemy) && !enemy.isDead()) {
                enemy.hit();     // Gegner nimmt Schaden
                this.remove();   // Flasche verschwindet
            }
        });
    }
    isCollidingWithHitbox(mo) {
    const hitboxX = this.x + this.hitboxOffsetX;
    const hitboxY = this.y + this.hitboxOffsetY;

    return (
        hitboxX + this.hitboxWidth > mo.x &&
        hitboxX < mo.x + mo.width &&
        hitboxY + this.hitboxHeight > mo.y &&
        hitboxY < mo.y + mo.height
    );
}


   remove() {
    this.isRemoved = true;

    // Laufende Animationen stoppen
    if (this.moveInterval) clearInterval(this.moveInterval);
    if (this.rotationInterval) clearInterval(this.rotationInterval);
    if (this.gravityInterval) clearInterval(this.gravityInterval);
}
}