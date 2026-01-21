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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld(){ 
        this.character.world = this;
        this.level.enemies.forEach(e => e.world = this);
        if (this.level.endboss) this.level.endboss.world = this;
    }
throwBottle() {
    const x = this.character.x + (this.character.otherDirection ? -50 : 100);
    const y = this.character.y + 100;
    const bottle = new ThrowableObject(x, y, this.character.otherDirection, this);
    this.throwableObjects.push(bottle);
}

    

checkCollisions() {
    setInterval(() => {

        // === Character vs Enemy ===
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();

                if (this.character.health <= 0 && this.gameRunning) {
                    this.showEndScreen("lose");
                }
            }
        });

        // === Bottle vs Enemy ===
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (bottle.isColliding(enemy) && !enemy.isDead()) {
                    enemy.hit();
                    bottle.remove();

                    if (enemy.isDead() && enemy instanceof Endboss && this.gameRunning) {
                        this.showEndScreen("win");
                    }
                }
            });
        });

        // === ManaBottle aufsammeln ===
        this.manaBottles.forEach(bottle => {
            if (this.character.isColliding(bottle)) {
                if (this.character.mana < this.character.maxMana) {
                    bottle.remove();
                    this.character.mana = Math.min(
                        this.character.mana + 2,
                        this.character.maxMana
                    );
                }
            }
        });

        this.manaBottles = this.manaBottles.filter(b => !b.isRemoved);
        this.throwableObjects = this.throwableObjects.filter(o => !o.isRemoved);

        // === Coins ===
        if (this.level.coins) {
            this.level.coins.forEach(coin => {
                if (this.character.isColliding(coin)) {
                    if (!this.character.extraJumpAvailable) {
                        this.character.extraJumpAvailable = true;
                        coin.remove();
                    }
                }
            });
            this.level.coins = this.level.coins.filter(c => !c.isRemoved);
        }

        // === Endboss Aktivierung ===
        if (this.level.endboss) {
            const boss = this.level.endboss;
            const distance = Math.abs(this.character.x - boss.x);

            if (!boss.isAwake && !boss.isWakingUp && distance < 500) {
                boss.isWakingUp = true;
            }

            if (boss.isAwake) {
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
        }

    }, 1000 / 25);
}


    draw() {
        if (!this.gameRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.manaBottles);
        this.manaBottles = this.manaBottles.filter(b => !b.isRemoved);
        this.throwableObjects = this.throwableObjects.filter(obj => !obj.isRemoved);
        this.ctx.translate(-this.camera_x, 0);
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemoved);
        
        this.statusBar.draw(this.ctx);
        this.manaBar.setMana(this.character.mana, this.character.maxMana);
        this.manaBar.draw(this.ctx);


        //Draw() wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects){
          objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (!mo || !mo.img || !mo.img.complete) return;
        if(mo.otherDirection){
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1 ;
        }
        
this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);

        if(mo.otherDirection){
            mo.x = mo.x * -1 ;
            this.ctx.restore();
            
        }
}
showEndScreen(result) {
    this.gameRunning = false; // Stoppt draw()

    if (backgroundMusic) backgroundMusic.pause();
    if (bossMusic) bossMusic.pause();

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
