/**
 * Represents the main character of the game.
 * @extends MovableObject
 */
class Character extends MovableObject {
    y = 150;
    x = -200;
    width = 200;
    height = 300;
    speed = 5;
    speedY = 0;
    acceleration = 2;
    jumpHeight = 25;
    health = 100;
    mana = 5;
    maxMana = 5;
    isJumping = false;
    hitboxOffsetX = 0;
    hitboxOffsetY = 200;
    hitboxWidth = 150;
    hitboxHeight = this.height - 150;
    idleTime = 0;
    sleepIdleAfter = 10000;
    isSleeping = false;
    snorePlayed = false;
    snoreAudio = null;


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
    images_sleep = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    world;

    /**
     * Creates an instance of Character.
     * Loads all necessary images and starts the animation loop.
     */
    constructor() {
        super();
        this.loadImage(this.images_idele[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_idele);
        this.loadImages(this.images_sleep);
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts the animation and movement loops.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts the interval that handles character movement and physics.
     */
    startMovementLoop() {
        this.animationInterval = setInterval(() => {
            this.checkIdleState();
            if (this.isDead()) return;
            this.moveCharacter();
            this.handleJump();
            this.world.camera_x = -this.x + 120;
            if (this.isAboveGround() && this.isJumping) {
                this.isJumping = false;
            }
            this.handleThrowObjects();
        }, 1000 / 60);
    }

    /**
     * Checks if the character is idle and resets the idle timer if any action occurs.
     */
    checkIdleState() {
        const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT ||
            this.world.keyboard.SPACE || this.world.keyboard.UP;
        if (isMoving || this.isHurt() || this.isAboveGround()) {
            this.idleTime = 0;
            this.isSleeping = false;
            this.snorePlayed = false;
            if (this.snoreAudio) {
                this.snoreAudio.pause();
                this.snoreAudio.currentTime = 0;
                this.snoreAudio = null;
            }
        } else {
            this.idleTime += 1000 / 60;
        }
    }

    /**
     * Moves the character left or right based on keyboard input.
     */
    moveCharacter() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > -600) {
            this.x -= this.speed;
            this.otherDirection = true;
        }
    }

    /**
     * Handles jumping logic including double jumps.
     */
    handleJump() {
        if (this.world.keyboard.JUMP) {
            if (!this.isAboveGround() && !this.isJumping) {
                this.jump();
            } else if (this.isAboveGround() && this.extraJumpAvailable) {
                this.extraJumpAvailable = false;
                this.jump();
            }
        }
    }

    /**
     * Handles throwing bottles if the appropriate key is pressed and mana is available.
     */
    handleThrowObjects() {
        if (this.world.keyboard.THROW && !this.throwCooldown) {
            if (this.mana > 0) {
                this.world.throwBottle();
                this.mana--;
                this.throwCooldown = true;
                setTimeout(() => this.throwCooldown = false, 500);
            }
        }
    }

    /**
     * Starts the interval that handles character animations.
     */
    startAnimationLoop() {
        setInterval(() => {
            if (this.isDead()) { this.playDeadAnimation(); return; }
            if (this.isJumping || this.isAboveGround()) return;
            if (this.isHurt()) { this.playHurtAnimation(); return; }

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playWalkingAnimation();
            } else {
                this.handleIdleAnimations();
            }
        }, 120);
    }

    /**
     * Selects between normal idle and sleep idle animations.
     */
    handleIdleAnimations() {
        if (this.idleTime >= this.sleepIdleAfter) {
            this.playSleepIdleAnimation();
        } else {
            this.playIdleAnimation();
        }
    }

    /**
     * Plays the walking animation.
     */
    playWalkingAnimation() {
        let i = this.currentImage % this.images_walking.length;
        let path = this.images_walking[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Executes the jump action.
     */
    jump() {
        this.speedY = this.jumpHeight;
        this.isJumping = true;
        this.playJumpAnimation();
        if (!jumpAudio || jumpAudio.ended) {
            jumpAudio = playSound('audio/effects/jump.mp3', 1.0);
        }
    }

    /**
     * Plays the hurt animation for a specific duration.
     */
    playHurtAnimation() {
        if (this.hurtAnimationRunning) return;
        this.hurtAnimationRunning = true;
        let i = 0;
        const interval = setInterval(() => {
            this.img = this.imageCache[this.images_hurt[i]];
            i = (i + 1) % this.images_hurt.length;

            if (!this.isHurt()) {
                clearInterval(interval);
                this.hurtAnimationRunning = false;
            }
        }, 150);
    }

    /**
     * Plays the jump animation once.
     */
    playJumpAnimation() {
        if (this.jumpAnimationRunning) return;
        this.jumpAnimationRunning = true;
        let i = 0;
        let interval = setInterval(() => {
            if (i < this.images_jumping.length) {
                let path = this.images_jumping[i];
                this.img = this.imageCache[path];
                i++;
            } else {
                clearInterval(interval);
                this.jumpAnimationRunning = false;
            }
        }, 120);
    }

    /**
     * Plays the dead animation and triggers the lose screen.
     */
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
                this.world.showEndScreen("lose");
            }
        }, 150);
    }

    /**
     * Plays the idle animation.
     */
    playIdleAnimation() {
        let i = this.currentImage % this.images_idele.length;
        let path = this.images_idele[i];
        if (this.imageCache[path]) {
            this.img = this.imageCache[path];
        }
        this.currentImage++;
    }

    /**
     * Plays the sleeping animation and snore sound.
     */
    playSleepIdleAnimation() {
        this.isSleeping = true;

        if (!this.snorePlayed) {
            this.snoreAudio = playSound('audio/effects/snore.mp3', 0.8, true);
            this.snorePlayed = true;
        }

        let i = this.currentImage % this.images_sleep.length;
        let path = this.images_sleep[i];

        if (this.imageCache[path]) {
            this.img = this.imageCache[path];
        }

        this.currentImage++;
    }

    /**
     * Stops all active character sounds.
     */
    stopAllSounds() {
        if (this.jumpAudio) {
            this.jumpAudio.pause();
            this.jumpAudio.currentTime = 0;
        }
        if (this.snoreAudio) {
            this.snoreAudio.pause();
            this.snoreAudio.currentTime = 0;
        }
    }

    /**
     * Stops all character intervals.
     */
    stopAllIntervals() {
        clearInterval(this.animationInterval);
    }

}