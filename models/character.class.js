class Character extends MovableObject {
    y = 150;
    x = -20;
    width = 200;
    height = 300;
    speed = 5;
    speedY = 0;
    acceleration = 2;
    jumpHeight = 25;
    health = 100;
    isJumping = false;

    images_walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
        images_jumping = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    images_dead = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'

    ];
    images_hurt = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    images_idele = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    world;
    constructor() {
        super();
        this.loadImage(this.images_idele[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_idele);
        this.applyGravity();    
        this.animate();
    }

    animate() {
                setInterval(() => {
            if (this.isDead()) return;

            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){
                this.x += this.speed;
                this.otherDirection = false;
            }

            if(this.world.keyboard.LEFT && this.x > -600){
                this.x -= this.speed;
                this.otherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround() && !this.isJumping) {
                this.jump();
            }
            this.world.camera_x = -this.x + 120;

            if(this.isAboveGround() && this.isJumping) {
                this.isJumping = false;
            }
        }, 1000 / 60);
            

        setInterval(() => {
            if (this.isDead()) {
                this.playDeadAnimation();
                return;
            }
            else if(this.isJumping){
                return;
            }
            else if (this.isAboveGround()) {
                return;
            }
            else if (this.isHurt()) {
            this.playHurtAnimation();
                return;
            }
            else if (!this.isAboveGround()) {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playWalkingAnimation();
            }
            else {
                this.playIdleAnimation();
            }
        }
        }, 100);
    }

    playWalkingAnimation() {
        let i = this.currentImage % this.images_walking.length;
        let path = this.images_walking[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        this.speedY = this.jumpHeight;
        this.isJumping = true;
        this.playJumpAnimation(); // Animation einmalig starten
    }
    playHurtAnimation() {
    if (this.hurtAnimationRunning) return; // Wenn schon läuft, nicht nochmal starten
    this.hurtAnimationRunning = true;

    let i = 0;
    let interval = setInterval(() => {
        if (i < this.images_hurt.length) {
            let path = this.images_hurt[i];
            this.img = this.imageCache[path];
            i++;
        } else {
            i = 0; // Wiederhole, solange "hurt" aktiv
        }

        // Nach 3 Sekunden Animation stoppen
        if (!this.isHurt()) {
            clearInterval(interval);
            this.hurtAnimationRunning = false;
        }
    }, 150); // Geschwindigkeit der Hurt-Bilder
}

    playJumpAnimation() {
        if (this.jumpAnimationRunning) return; // schon aktiv → nicht nochmal starten
        this.jumpAnimationRunning = true;

        let i = 0;
        let interval = setInterval(() => {
            // Animation einmal komplett abspielen
            if (i < this.images_jumping.length) {
                let path = this.images_jumping[i];
                this.img = this.imageCache[path];
                i++;
            } else {
                clearInterval(interval);
                this.jumpAnimationRunning = false;
            }
        }, 120); // Geschwindigkeit der Sprungframes
    }

    playDeadAnimation() {
        if (this.deadAnimationStarted) return;
        this.deadAnimationStarted = true;

        let i = 0;
        let interval = setInterval(() => {
            if (i < this.images_dead.length) {
                let path = this.images_dead[i];
                this.img = this.imageCache[path];
                i++;
            } else {
                clearInterval(interval);
                this.img = this.imageCache[this.images_dead[this.images_dead.length - 1]];
            }
        }, 150);
    }
    playIdleAnimation() {
        let i = this.currentImage % this.images_idele.length;
        let path = this.images_idele[i];
    if (this.imageCache[path]) {
        this.img = this.imageCache[path];
    }
    this.currentImage++;
    }
}