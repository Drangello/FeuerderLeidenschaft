class StatusBar extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];
    percent = 100;
    constructor() {
        super();
        this.loadImage(this.IMAGES[5]);
        this.x = 20;
        this.y = 20;
        this.width = 200;
        this.height = 50;
    }

    /**
     * Updates the health bar percentage.
     * @param {number} percent - The new percentage value (0-100).
     */
    setPercent(percent) {
        this.percent = percent;
        let imageIndex;
        if (percent >= 80) {
            imageIndex = 4;
        } else if (percent >= 60) {
            imageIndex = 3;
        } else if (percent >= 40) {
            imageIndex = 2;
        } else if (percent >= 20) {
            imageIndex = 1;
        } else if (percent > 0) {
            imageIndex = 0;
        } else {
            imageIndex = 0;
        }

        this.loadImage(this.IMAGES[imageIndex]);
    }

    /**
     * Draws the status bar on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    draw(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}