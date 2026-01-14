class ManaBar extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];
    percent = 100;
    constructor() {
        super();
        this.loadImage(this.IMAGES[5]);
        this.x = 500;  // etwas nach rechts verschoben
        this.y = 20;
        this.width = 200;
        this.height = 50;
    }

    /**
     * Aktualisiert die Mana-Anzeige (0–5 Mana → 0–100%)
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
}