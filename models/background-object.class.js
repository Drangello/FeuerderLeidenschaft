/**
 * Represents a background object that can be moved.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 400;

    /**
     * Creates an instance of BackgroundObject.
     * @param {string} imagePath - The path to the background image.
     * @param {number} x - The initial x-coordinate (default: 0).
     * @param {number} y - The initial y-coordinate (default: 0).
     */
    constructor(imagePath, x = 0, y = 0) {
        super();
        this.loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
    }
}