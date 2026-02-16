/**
 * Represents the final boss enemy.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    y = 80;
    x = 2500;
    width = 300;
    height = 400;
    speed = 2.5;
    health = 80;
    isAwake = false;
    isWakingUp = false;
    sightRange = 500;
    musicSwitched = false;
    isSprinting = false;
    sprintSpeed = 25;
    normalSpeed = 2.5;
    sprintDuration = 5000;
    sprintChance = 0.02;

    images_alert = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    images_wakeup = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png'
    ];

    images_hurt = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    images_walking = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    images_dead = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates an instance of Endboss.
     * Loads images and starts the animation loop.
     */
    constructor() {
        super();
        this.loadImage(this.images_alert[0]);
        this.loadImages(this.images_alert);
        this.loadImages(this.images_wakeup);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_dead);
        this.animate();
    }

    /**
     * Starts the main animation loop for the boss.
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.character) {
                this.checkBossStatus();
            }
            if (this.isWakingUp) {
                this.playWakeupOnce();
            } else if (this.isAwake) {
                this.handleBossBehavior();
            } else {
                this.playAnimation(this.images_alert);
            }
        }, 150);
    }

    /**
     * Checks if the boss should wake up based on character distance.
     */
    checkBossStatus() {
        const distance = Math.abs(this.world.character.x - this.x);
        if (!this.isAwake && !this.isWakingUp &&
            distance < this.sightRange && !this.musicSwitched) {
            this.isWakingUp = true;
            this.musicSwitched = true;
            switchToBossMusic();
        }
    }

    /**
     * Manages boss behavior when awake (sprinting or walking).
     */
    handleBossBehavior() {
        if (!this.isSprinting && Math.random() < this.sprintChance) {
            this.startSprintAttack();
        }
        if (this.isSprinting) {
            this.sprintToCharacter();
        } else {
            this.moveAndWalkAnimation();
        }
    }

    /**
     * Plays the wakeup animation once, then sets the boss to awake state.
     */
    playWakeupOnce() {
        this.isWakingUp = false;
        let i = 0;
        const interval = setInterval(() => {
            this.img = this.imageCache[this.images_wakeup[i]];
            i++;
            if (i >= this.images_wakeup.length) {
                clearInterval(interval);
                this.isAwake = true;
            }
        }, 150);
    }

    /**
     * Handles movement and walking animation towards the character.
     */
    moveAndWalkAnimation() {
        this.playAnimation(this.images_walking);

        if (this.world && this.world.character) {
            const charX = this.world.character.x;

            if (this.x > charX + 50) {
                this.x -= this.speed;
                this.otherDirection = false;
            } else if (this.x < charX - 50) {
                this.x += this.speed;
                this.otherDirection = true;
            }
        }
    }

    /**
     * Plays the hurt animation.
     */
    playHurtAnimation() {
        if (this.hurtAnimationRunning) return;
        this.hurtAnimationRunning = true;
        let i = 0;
        const interval = setInterval(() => {
            if (i < this.images_hurt.length) {
                this.img = this.imageCache[this.images_hurt[i]];
                i++;
            } else {
                clearInterval(interval);
                this.hurtAnimationRunning = false;
            }
        }, 150);
    }

    /**
     * Handles the death animation and triggers the win screen.
     */
    die() {
        if (this.deadAnimationRunning) return;
        this.deadAnimationRunning = true;
        this.speed = 0;

        let repeat = 0;
        const playOnce = () => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < this.images_dead.length) {
                    this.img = this.imageCache[this.images_dead[i]];
                    i++;
                } else {
                    clearInterval(interval);
                    repeat++;
                    if (repeat < 3) {
                        playOnce();
                    } else {
                        this.remove();
                        this.world.showEndScreen("win");
                    }
                }
            }, 200);
        };
        playOnce();
    }

    /**
     * Plays a standard animation from an array of images.
     * @param {string[]} images - Array of image paths.
     */
    playAnimation(images) {
        const i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    /**
     * Initiates a sprint attack.
     */
    startSprintAttack() {
        this.isSprinting = true;
        this.speed = this.sprintSpeed;
        this.playAlertBeforeSprint();
    }

    /**
     * Plays the alert animation before sprinting.
     */
    playAlertBeforeSprint() {
        let i = 0;
        const alertInterval = setInterval(() => {
            this.img = this.imageCache[this.images_alert[i]];
            i++;
            if (i >= this.images_alert.length) {
                clearInterval(alertInterval);
                this.startSprintDurationTimer();
            }
        }, 120);
    }

    /**
     * Sets a timer to end the sprint after a duration.
     */
    startSprintDurationTimer() {
        setTimeout(() => {
            this.isSprinting = false;
            this.speed = this.normalSpeed;
        }, this.sprintDuration);
    }

    /**
     * Moves the boss rapidly towards the character during a sprint.
     */
    sprintToCharacter() {
        if (!this.world || !this.world.character) return;

        const charX = this.world.character.x;

        if (this.x > charX) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }
}