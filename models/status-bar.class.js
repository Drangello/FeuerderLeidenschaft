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
    constructor(){
        super();
        this.loadImage(this.IMAGES[5]);
        this.x = 20; // Position von links
        this.y = 20; // Position von oben
        this.width = 200; // Breite der StatusBar (falls nötig)
        this.height = 50; // Höhe der StatusBar (falls nötig)
    }

    setPercent(percent){
        this.percent = percent;
        // Bild je nach Leben auswählen
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
    
    draw(ctx){
        if(this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}