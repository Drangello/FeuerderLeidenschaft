/**
 * Represents a cloud background element.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    y = 20;
    height = 350;
    width = 300;
    speed = 0.8;

    /**
     * Creates a cloud instance and loads its image.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/2.png');

        this.x = Math.random() * 2500;
        this.animate();
    }

    /**
     * Starts the cloud animation by moving it left-right.
     */
    animate() {
        this.moveLeftRight(-800, 2250);
    }
}