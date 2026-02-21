/**
 * Represents a game level containing all movable objects and level boundaries.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    level_end_x = 2250;

    /**
     * Creates an instance of Level.
     * @param {Array<MovableObject>} enemies - Array of enemy objects.
     * @param {Array<Cloud>} clouds - Array of cloud objects.
     * @param {Array<BackgroundObject>} backgroundObjects - Array of background objects.
     * @param {Array<Coin>} coins - Array of coin objects.
     */
    constructor(enemies, clouds, backgroundObjects, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}