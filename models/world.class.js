class World {

    character = new Character();
    statusBar = new StatusBar();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
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
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                console.log('Collision with enemy detected', this.character.health);
            }
        });

        // === Bottle vs Enemy ===
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !enemy.isDead()) {
                    enemy.hit();
                    bottle.remove();
                    console.log('Bottle hit enemy! Enemy health:', enemy.health);

                    // Optional: Gegner "sterben" lassen, falls health = 0
                    if (enemy.isDead()) {
                        console.log('Enemy is dead!');
                        // Gegner optional aus dem Level entfernen:
                        // this.level.enemies = this.level.enemies.filter(e => !e.isDead());
                    }
                }
            });
        });
// === ManaBottle aufsammeln ===
this.manaBottles.forEach((bottle) => {
    if (this.character.isColliding(bottle)) {
        // Nur aufheben, wenn Mana noch nicht voll ist
        if (this.character.mana < this.character.maxMana) {
            bottle.remove();
            this.character.mana = Math.min(this.character.mana + 2, this.character.maxMana);
            console.log(`Mana bottle collected! Mana: ${this.character.mana}`);
        } else {
            // Optional: kurze Meldung, wenn Mana bereits voll ist
            console.log("Mana already full – bottle ignored.");
        }
    }
});
this.manaBottles = this.manaBottles.filter(b => !b.isRemoved);
        // === Alte Flaschen entfernen ===
        this.throwableObjects = this.throwableObjects.filter(obj => !obj.isRemoved);
if (this.level.coins) {
    this.level.coins.forEach((coin) => {
        if (this.character.isColliding(coin)) {
            if (!this.character.extraJumpAvailable) {
                this.character.extraJumpAvailable = true;
                console.log('Double Jump aufgeladen!');
                coin.remove(); // 🪙 Coin verschwindet nach Aktivierung
            }
        }
        if (this.level.endboss) {
    const boss = this.level.endboss;

const distance = Math.abs(this.character.x - boss.x); // Entfernung zwischen Spieler und Boss

if (!boss.isAwake && !boss.isWakingUp && distance < 500) { // 👈 500 = "Sichtweite" in Pixeln
    boss.isWakingUp = true;
    console.log("Endboss hat dich gesehen und wacht auf!");
}

    // Wenn Boss aktiv ist → läuft nach links/rechts
    if (boss.isAwake) {
        // einfache Patrouille oder Verfolgung
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
    });

    // Entferne Coins, die markiert wurden
    this.level.coins = this.level.coins.filter(c => !c.isRemoved);
}

    }, 1000 / 25);
}

    draw() {
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

if (mo instanceof Character || mo instanceof Chicken || mo instanceof Endboss) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'violet';
    this.ctx.rect(mo.x, mo.y, mo.width, mo.height);
    this.ctx.stroke();
}

        if(mo.otherDirection){
            mo.x = mo.x * -1 ;
            this.ctx.restore();
            
        }
}

}
