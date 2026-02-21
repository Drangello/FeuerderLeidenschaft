/**
 * Base class for all drawable objects in the game.
 * Handles image loading and drawing.
 */
class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 100;
    y = 250;
    height = 150;
    width = 100;

    /**
     * Loads a single image from a given source path.
     * @param {string} path - The relative file path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images and stores them in an image cache for quick access.
     * @param {Array<string>} arr - An array of image paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the loaded image onto the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The 2D canvas rendering context.
     */
    draw(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}