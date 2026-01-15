let canvas;
let world;
let keyboard = new Keyboard();

/** Dein unverändertes init() */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/** Spiel starten */
function startGame() {
    document.getElementById("start-screen").classList.add("hidden");
    init();
    bindMobileControls();
    checkOrientation();
}

/** Spiel neustarten */
function restartGame() {
    location.reload();
}

/** Sobald alles geladen ist, wird der Button aktiv */
window.addEventListener("load", () => {
    const startBtn = document.getElementById("start-btn");
    startBtn.textContent = "Spiel starten";
    startBtn.disabled = false;
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

    const isPortrait = window.innerHeight > window.innerWidth;
    const rotateOverlay = document.getElementById("rotate-overlay");
    const mobileControls = document.getElementById("mobile-controls");

    if (isPortrait) {
        rotateOverlay.classList.remove("hidden");
        if (mobileControls) mobileControls.style.display = "none";
    } else {
        rotateOverlay.classList.add("hidden");
        if (mobileControls) mobileControls.style.display = "flex";
    }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);


