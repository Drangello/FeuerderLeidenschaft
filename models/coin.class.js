/**
 * Represents a coin that can be collected by the player.
 * @extends MovableObject
 */
class Coin extends MovableObject {
    width = 100;
    height = 100;

    images_spin = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImages(this.images_spin);
        this.loadImage(this.images_spin[0]);
        this.animate();
    }

    /**
     * Starts the spinning animation for the object.
     * Cycles through the `images_spin` array at a fixed interval.
     */
    animate() {
        let i = 0;
        this.spinInterval = setInterval(() => {
            this.img = this.imageCache[this.images_spin[i]];
            i = (i + 1) % this.images_spin.length;
        }, 150);
    }

    /**
     * Stops the spinning animation and marks the object as removed.
     * Clears the interval to prevent memory leaks.
     */
    remove() {
        this.isRemoved = true;
        if (this.spinInterval) {
            clearInterval(this.spinInterval);
        }
    }
}
