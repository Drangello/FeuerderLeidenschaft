class ManaBottle extends MovableObject {
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
    }

    remove() {
        this.isRemoved = true;
    }
}