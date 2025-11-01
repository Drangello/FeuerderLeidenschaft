class World {

    character = new Character();
    statusBar = new StatusBar();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [new ThrowableObject()];


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
    }
throwBottle() {
    const x = this.character.x + (this.character.otherDirection ? -50 : 100);
    const y = this.character.y + 100;
    const bottle = new ThrowableObject(x, y, this.character.otherDirection);
    this.throwableObjects.push(bottle);
}

    

    checkCollisions(){
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
             if (this.character.isColliding(enemy)) {
                this.character.hit();
                console.log('Collision with enemy detected', this.character.health);
                
             }
            });
        }, 200);

             this.throwableObjects.forEach(bottle => {
        this.level.enemies.forEach(enemy => {
        if (bottle.isColliding(enemy)) {
            enemy.hit(); // oder enemy.dead = true;
            bottle.remove = true;
        }

    });
    }, 200);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        
        this.statusBar.draw(this.ctx);


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
