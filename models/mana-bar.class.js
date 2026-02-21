class ManaBar extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES[5]);
        this.x = 20;
        this.y = 20 + 50 + 10;
        this.width = 200;
        this.height = 50;
        this.icon = new Image();
        this.icon.src = 'img/6_salsa_bottle/salsa_bottle.png';
        this.iconSize = 32;
        this.iconPadding = 8;
    }
    /**
     * Updates the mana bar percentage.
     * @param {number} mana - The new percentage value (0-100).
     */
    setMana(mana, maxMana) {
        const percent = (mana / maxMana) * 100;
        let imageIndex;
        if (percent >= 100) imageIndex = 5;
        else if (percent >= 80) imageIndex = 4;
        else if (percent >= 60) imageIndex = 3;
        else if (percent >= 40) imageIndex = 2;
        else if (percent >= 20) imageIndex = 1;
        else imageIndex = 0;
        this.loadImage(this.IMAGES[imageIndex]);
    }
    /**
         * Draws the mana bar on the canvas.
         * @param {CanvasRenderingContext2D} ctx - The rendering context.
         */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

        if (this.icon.complete) {
            ctx.drawImage(
                this.icon,
                this.x + this.iconPadding,
                this.y + (this.height - this.iconSize) / 2,
                this.iconSize,
                this.iconSize
            );
        }
    }
}