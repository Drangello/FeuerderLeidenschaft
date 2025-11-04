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
    if(e.keyCode == 68){
        keyboard.RIGHT = true;
    }
        if(e.keyCode == 65){
        keyboard.LEFT = true;
    }
        if(e.keyCode == 73){
        keyboard.UP = true;
    }
        if(e.keyCode == 83){
        keyboard.DOWN = true;
    }
        if(e.keyCode == 74){
        keyboard.SPACE = true;
    }

        console.log(e);

});
window.addEventListener("keyup", (e) => {
    if(e.keyCode == 68){
        keyboard.RIGHT = false;
    }
        if(e.keyCode == 65){
        keyboard.LEFT = false;
    }
        if(e.keyCode == 73){
        keyboard.UP = false;
    }
        if(e.keyCode == 83){
        keyboard.DOWN = false;
    }
        if(e.keyCode == 74){
        keyboard.SPACE = false;
    }

        console.log(e);

});
