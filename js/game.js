let canvas;
let world;
let keyboard = new Keyboard();
let backgroundMusic;
let bossMusic;
let currentMusicType = 'none';
let jumpAudio = null;
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

/**
 * Resets the level by creating a new Level instance including enemies, clouds, backgrounds, and coins.
 */
function resetLevel() {
    level1 = new Level(
        [
            new Chicken(500),
            new Chicken(650),
            new Chicken(800),
            new Chicken(950),
            new Chicken(1100),
            new Chicken(1250),
            new Chicken(1400),
            new Chicken(1500),
            new Chicken(1600),
            new Chicken(1850),
            new Chicken(1900),
            new Chicken(2100),
            new Chicken(2200),
            new Chicken(2250),
            new CrazyChicken(600),
            new CrazyChicken(900),
            new CrazyChicken(1200),
            new CrazyChicken(1500),
            new CrazyChicken(1800),
            new CrazyChicken(2100),
            new Endboss()
        ],
        [
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
        ],

        [
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 1440),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 1440),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 1440),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720 * 3),
        ],

        [
            new Coin(-500, 140),
            new Coin(200, 140),
            new Coin(900, 140),
            new Coin(1600, 140),
            new Coin(2200, 140)
        ],
    );
}

/**
 * Initializes the main game logic by fetching the canvas element and instantiating the World object.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/**
 * Starts the game. Hides the start screen, displays relevant buttons, initializes the level and controls, and plays background music.
 */
function startGame() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("in-game-sound-btn").classList.remove("hidden");
    if (isTouchDevice()) {
        document.getElementById("mobile-controls").classList.add("show");
    }
    resetLevel();
    init();
    bindMobileControls();
    checkOrientation();
    playBackgroundMusic();
}

/**
 * Restarts an already running or finished game. Hides the end screen and calls startGame().
 */
function restartGame() {
    document.getElementById("end-screen").classList.add("hidden");
    startGame();
}

/**
 * Ends the current game state and returns the user to the main menu. Pauses music and resets UI screens.
 */
function backToMenu() {
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("in-game-sound-btn").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
    document.getElementById("mobile-controls").classList.remove("show");
    document.getElementById("mobile-controls").style.display = "none";
    if (backgroundMusic) backgroundMusic.pause();
    if (bossMusic) bossMusic.pause();
    currentMusicType = 'none';
}

window.addEventListener("load", () => {
    const startBtn = document.getElementById("start-btn");
    startBtn.textContent = "Spiel starten";
    startBtn.disabled = false;
    const soundBtn = document.getElementById("sound-btn");
    soundBtn.textContent = soundEnabled ? "Sound: An" : "Sound: Aus";
    const inGameSoundBtn = document.getElementById("in-game-sound-btn");
    if (inGameSoundBtn) {
        inGameSoundBtn.textContent = soundEnabled ? "🔊" : "🔈";
    }
});

window.addEventListener("keydown", (e) => {
    if (e.keyCode === 65) keyboard.LEFT = true;   // A
    if (e.keyCode === 68) keyboard.RIGHT = true;  // D
    if (e.keyCode === 74) keyboard.JUMP = true;   // J
    if (e.keyCode === 73) keyboard.THROW = true;  // I
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode === 65) keyboard.LEFT = false;
    if (e.keyCode === 68) keyboard.RIGHT = false;
    if (e.keyCode === 74) keyboard.JUMP = false;
    if (e.keyCode === 73) keyboard.THROW = false;
});

/**
 * Binds touch events to the mobile control buttons, enabling playing on touch-enabled devices.
 */
function bindMobileControls() {
    const left = document.getElementById("btn-left");
    const right = document.getElementById("btn-right");
    const jump = document.getElementById("btn-jump");
    const throwBtn = document.getElementById("btn-throw");

    if (!left) return;

    left.addEventListener("touchstart", e => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    left.addEventListener("touchend", () => keyboard.LEFT = false);

    right.addEventListener("touchstart", e => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    right.addEventListener("touchend", () => keyboard.RIGHT = false);

    jump.addEventListener("touchstart", e => {
        e.preventDefault();
        keyboard.JUMP = true;
    });
    jump.addEventListener("touchend", () => keyboard.JUMP = false);

    throwBtn.addEventListener("touchstart", e => {
        e.preventDefault();
        keyboard.THROW = true;
    });
    throwBtn.addEventListener("touchend", () => keyboard.THROW = false);
}

/**
 * Checks if the user is playing on a touch-compatible device.
 * @returns {boolean} True if the device supports touch interactions.
 */
function isTouchDevice() {
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
    );
}

/**
 * Monitors the device orientation and displays an overlay prompting the user to rotate their device if they are holding it in portrait format.
 */
function checkOrientation() {
    if (!isTouchDevice()) return;

    const rotateOverlay = document.getElementById("rotate-overlay");
    const mobileControls = document.getElementById("mobile-controls");
    const isPortrait = window.innerHeight > window.innerWidth;

    toggleDisplay(rotateOverlay, !isPortrait ? "none" : "flex", !isPortrait);
    if (!mobileControls) return;

    if (isPortrait) toggleDisplay(mobileControls, "none");
    else toggleDisplay(mobileControls, (mobileControls.classList.contains("show") && world?.gameRunning) ? "flex" : "none");
}

function toggleDisplay(el, display, hiddenClass = false) {
    el.style.display = display;
    if (hiddenClass) el.classList.add("hidden");
    else el.classList.remove("hidden");
}


window.addEventListener("resize", checkOrientation);

/**
 * Toggles global game sound on or off, saves choice to localStorage, and updates UI control elements and active music.
 */
function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);

    updateButton("sound-btn", soundEnabled ? "Sound: An" : "Sound: Aus");
    updateButton("in-game-sound-btn", soundEnabled ? "🔊" : "🔈");

    handleMusic();
}

function updateButton(id, text) {
    const btn = document.getElementById(id);
    if (btn) btn.textContent = text;
}

function handleMusic() {
    if (!soundEnabled) return pauseAllMusic();
    if (currentMusicType === 'background') playOrResume(backgroundMusic, playBackgroundMusic);
    else if (currentMusicType === 'boss') playOrResume(bossMusic, switchToBossMusic);
}

function pauseAllMusic() {
    if (backgroundMusic) backgroundMusic.pause();
    if (bossMusic) bossMusic.pause();
}

function playOrResume(musicObj, fallbackFn) {
    if (musicObj) musicObj.play();
    else fallbackFn();
}

/**
 * Handles playing an individual audio clip.
 * @param {string} path - The relative file path to the audio file.
 * @param {number} [volume=1] - Adjusts volume of the playback from 0.0 to 1.0.
 * @param {boolean} [loop=false] - Whether or not the sound should repeat indefinitely.
 * @returns {HTMLAudioElement|null} The created audio HTML element, or null if sound is disabled.
 */
function playSound(path, volume = 1, loop = false) {
    if (!soundEnabled) return null;
    const audio = new Audio(path);
    audio.volume = volume;
    audio.loop = loop;
    audio.play().catch(e => e);
    return audio;
}

/**
 * Initiates the looping playback of the main background level music track.
 */
function playBackgroundMusic() {
    currentMusicType = 'background';
    backgroundMusic = playSound('audio/mukke/Sound 1.mp3', 0.2, true);
}

/**
 * Stops standard background music and transitions to the boss battle music track.
 */
function switchToBossMusic() {
    currentMusicType = 'boss';
    if (backgroundMusic) backgroundMusic.pause();
    bossMusic = playSound('audio/mukke/Sound 2 Boss.mp3', 0.2, true);
}
window.addEventListener("orientationchange", checkOrientation);

/**
 * Displays the imprint (legal notice) modal to the screen.
 */
function openImprint() {
    document.getElementById("imprint-modal").classList.remove("hidden");
}

/**
 * Closes the imprint (legal notice) modal.
 */
function closeImprint() {
    document.getElementById("imprint-modal").classList.add("hidden");
}
const imprintModal = document.getElementById("imprint-modal");

imprintModal.addEventListener("click", (event) => {
    if (event.target === imprintModal) {
        closeImprint();
    }
});
