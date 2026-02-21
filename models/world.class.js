/**
 * Represents the game world, managing all objects and the game loop.
 */
class World {

    character = new Character();
    statusBar = new StatusBar();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameRunning = true;
    throwableObjects = [new ThrowableObject()];
    manaBottles = [];
    manaBar = new ManaBar();

    /**
     * Creates an instance of World.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    /**
     * Assigns the world instance to the character and enemies.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(e => e.world = this);
        if (this.level.endboss) this.level.endboss.world = this;
    }

    /**
     * Throws a bottle if available.
     */
    throwBottle() {
        const x = this.character.x + (this.character.otherDirection ? -50 : 100);
        const y = this.character.y + 100;
        const bottle = new ThrowableObject(x, y, this.character.otherDirection, this);
        this.throwableObjects.push(bottle);
    }

    /**
     * Starts the collision detection loop.
     */
    checkCollisions() {
        setInterval(() => {
            this.checkEnemyCollisions();
            this.checkThrowObjectCollisions();
            this.checkManaCollisions();
            this.checkCoinCollisions();
            this.checkEndbossActivation();
            this.cleanupObjects();
        }, 1000 / 25);
    }

    /**
     * Checks for collisions between the character and enemies.
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !enemy.isDead()) {
                this.character.hit();
                if (this.character.health <= 0 && this.gameRunning) {
                    this.showEndScreen("lose");
                }
            }
        });
    }

    /**
     * Checks if threw bottles collide with enemies.
     */
    checkThrowObjectCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (bottle.isColliding(enemy) && !enemy.isDead()) {
                    this.handleBottleCollision(bottle, enemy);
                }
            });
        });
    }

    /**
     * Handles the logic when a bottle hits an enemy.
     * @param {ThrowableObject} bottle - The thrown bottle.
     * @param {MovableObject} enemy - The enemy hit.
     */
    handleBottleCollision(bottle, enemy) {
        enemy.hit();
        bottle.remove();
        if (enemy.isDead() && enemy instanceof Endboss && this.gameRunning) {
            this.showEndScreen("win");
        }
    }

    /**
     * Checks if the character collects mana bottles.
     */
    checkManaCollisions() {
        this.manaBottles.forEach(bottle => {
            if (this.character.isColliding(bottle)) {
                if (this.character.mana < this.character.maxMana) {
                    bottle.remove();
                    this.character.mana = Math.min(this.character.mana + 2, this.character.maxMana);
                }
            }
        });
    }

    /**
     * Checks if the character collects coins.
     */
    checkCoinCollisions() {
        if (!this.level.coins) return;
        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(coin);
            }
        });
    }

    /**
     * Collects a coin and enables double jump if applicable.
     * @param {MovableObject} coin - The collected coin.
     */
    collectCoin(coin) {
        if (!this.character.extraJumpAvailable) {
            this.character.extraJumpAvailable = true;
            coin.remove();
        }
    }

    /**
     * Removes objects marked for deletion from the game arrays.
     */
    cleanupObjects() {
        this.manaBottles = this.manaBottles.filter(b => !b.isRemoved);
        this.throwableObjects = this.throwableObjects.filter(o => !o.isRemoved);
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemoved);
        if (this.level.coins) {
            this.level.coins = this.level.coins.filter(c => !c.isRemoved);
        }
    }

    /**
     * Checks if the endboss should wake up or move.
     */
    checkEndbossActivation() {
        if (!this.level.endboss) return;
        const boss = this.level.endboss;
        const distance = Math.abs(this.character.x - boss.x);

        if (!boss.isAwake && !boss.isWakingUp && distance < 500) {
            boss.isWakingUp = true;
        }
        if (boss.isAwake) {
            this.moveEndboss(boss);
        }
    }

    /**
     * Moves the endboss back and forth.
     * @param {Endboss} boss - The endboss instance.
     */
    moveEndboss(boss) {
        if (boss.direction === "left" || boss.direction === undefined) {
            boss.x -= boss.speed;
            boss.otherDirection = false;
            if (boss.x < 2000) boss.direction = "right";
        } else {
            boss.x += boss.speed;
            boss.otherDirection = true;
            if (boss.x > 2600) boss.direction = "left";
        }
    }

    /**
     * Main draw loop of the game.
     */
    draw() {
        if (!this.gameRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawBackground();
        this.drawGameObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawUI();
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Draws background objects.
     */
    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Draws game entities (character, enemies, items).
     */
    drawGameObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.manaBottles);
    }

    /**
     * Draws UI elements (status bar, mana bar).
     */
    drawUI() {
        this.statusBar.draw(this.ctx);
        this.manaBar.setMana(this.character.mana, this.character.maxMana);
        this.manaBar.draw(this.ctx);
    }

    /**
     * Helper to add a list of objects to the map.
     * @param {MovableObject[]} objects 
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single object to the map.
     * @param {MovableObject} mo 
     */
    addToMap(mo) {
        if (!mo || !mo.img || !mo.img.complete) return;
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }

    /**
     * Displays the end screen (win or lose).
     * @param {string} result - "win" or "lose".
     */
    showEndScreen(result) {
        this.gameRunning = false;
        if (backgroundMusic) backgroundMusic.pause();
        if (bossMusic) bossMusic.pause();
        this.character.stopAllSounds();
        this.character.stopAllIntervals();
        document.getElementById("mobile-controls").classList.remove("show");
        document.getElementById("mobile-controls").style.display = "none";
        document.getElementById("in-game-sound-btn").classList.add("hidden");
        const endScreen = document.getElementById("end-screen");
        const endText = document.getElementById("end-text");
        endScreen.classList.remove("hidden", "end-win", "end-lose");
        if (result === "win") {
            endScreen.classList.add("end-win");
        } else {
            endScreen.classList.add("end-lose");
        }
    }
}
