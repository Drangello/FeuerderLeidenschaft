let canvas;
let world;
let keyboard = new Keyboard();
let backgroundMusic;
let bossMusic;
let currentMusicType = 'none';
let jumpAudio = null;
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // true wenn nicht gespeichert oder true

/** Level neu erstellen */
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

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}


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


function restartGame() {
    document.getElementById("end-screen").classList.add("hidden");
    startGame();
}


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
function isTouchDevice() {
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
    );
}

function checkOrientation() {
    if (!isTouchDevice()) return;

    const rotateOverlay = document.getElementById("rotate-overlay");
    const mobileControls = document.getElementById("mobile-controls");

    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait) {
        rotateOverlay.classList.remove("hidden");
        rotateOverlay.style.display = "flex";

        if (mobileControls) {
            mobileControls.style.display = "none";
        }
    } else {
        rotateOverlay.classList.add("hidden");
        rotateOverlay.style.display = "none";

        if (mobileControls && mobileControls.classList.contains("show")) {
            if (world && world.gameRunning) {
                mobileControls.style.display = "flex";
            } else {
                mobileControls.style.display = "none";
            }
        }
    }
}


window.addEventListener("resize", checkOrientation);

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    const soundBtn = document.getElementById("sound-btn");
    soundBtn.textContent = soundEnabled ? "Sound: An" : "Sound: Aus";
    const inGameSoundBtn = document.getElementById("in-game-sound-btn");
    if (inGameSoundBtn) {
        inGameSoundBtn.textContent = soundEnabled ? "🔊" : "🔈";
    }
    if (!soundEnabled) {
        if (backgroundMusic) backgroundMusic.pause();
        if (bossMusic) bossMusic.pause();
    } else {
        if (currentMusicType === 'background') {
            if (backgroundMusic) backgroundMusic.play();
            else playBackgroundMusic();
        } else if (currentMusicType === 'boss') {
            if (bossMusic) bossMusic.play();
            else switchToBossMusic();
        }
    }
}

function playSound(path, volume = 1, loop = false) {
    if (!soundEnabled) return null;
    const audio = new Audio(path);
    audio.volume = volume;
    audio.loop = loop;
    audio.play().catch(e => e);
    return audio;
}

function playBackgroundMusic() {
    currentMusicType = 'background';
    backgroundMusic = playSound('audio/mukke/Sound 1.mp3', 0.2, true);
}

function switchToBossMusic() {
    currentMusicType = 'boss';
    if (backgroundMusic) backgroundMusic.pause();
    bossMusic = playSound('audio/mukke/Sound 2 Boss.mp3', 0.2, true);
}
window.addEventListener("orientationchange", checkOrientation);

function openImprint() {
    document.getElementById("imprint-modal").classList.remove("hidden");
}

function closeImprint() {
    document.getElementById("imprint-modal").classList.add("hidden");
}
const imprintModal = document.getElementById("imprint-modal");

imprintModal.addEventListener("click", (event) => {
    if (event.target === imprintModal) {
        closeImprint();
    }
});


