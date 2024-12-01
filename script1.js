let bullets = [];
let player1HP = 3;
let player2HP = 3;
let currentPlayer = 1;

// Game readiness check
function gameReady() {
    document.body.classList.add("no-animation");
}

// Call gameReady after initializing the game
function initializeGame() {
    loadGun();
    updateHP("player1", player1HP);
    updateHP("player2", player2HP);
    updateTurnIndicator();
    setTimeout(gameReady, 2000); // Delay to allow initial animations
}

// Other existing functions
function updateTurnIndicator() {
    const turnIndicator = document.getElementById("turn-indicator");
    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
}

function loadGun() {
    if (player1HP === 0 || player2HP === 0) {
        return;
    }

    const maxBullets = 6;
    const totalBullets = Math.floor(Math.random() * (maxBullets - 1)) + 2;

    const liveBullets = Math.max(1, Math.floor(Math.random() * (totalBullets - 1)) + 1);
    const blankBullets = totalBullets - liveBullets;

    bullets = Array(liveBullets).fill("live").concat(Array(blankBullets).fill("blank"));
    bullets.sort(() => Math.random() - 0.5);

    showBulletPattern();

    const ammoDetails = document.getElementById("ammo-details");
    ammoDetails.innerHTML = `
        Total bullets: <span>${totalBullets}</span><br>
        Live bullets: <span class="live">${liveBullets}</span><br>
        Blank bullets: <span class="blank">${blankBullets}</span>
    `;

    const modal = document.getElementById("ammo-notification");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 3000);
}

// Call the initialization
initializeGame();


function showBulletPattern() {
    const existingPattern = document.getElementById("bullet-pattern");
    if (existingPattern) {
        document.body.removeChild(existingPattern);
    }

    const patternContainer = document.createElement("div");
    patternContainer.id = "bullet-pattern";
    patternContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 10px;
        padding: 20px;
        z-index: 1000;
        display: flex;
        gap: 10px;
    `;

    bullets.slice().reverse().forEach((bullet) => {
        const bulletIndicator = document.createElement("div");
        bulletIndicator.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: ${bullet === "live" ? "red" : "white"};
        `;
        patternContainer.appendChild(bulletIndicator);
    });

    document.body.appendChild(patternContainer);

    setTimeout(() => {
        document.body.removeChild(patternContainer);
    }, 3000);
}

function notifyBulletType(bullet) {
    const liveSound = document.getElementById("gunshot-live");
    const blankSound = document.getElementById("gunshot-blank");

    if (bullet === "live") {
        liveSound.currentTime = 0;
        liveSound.play();
    } else {
        blankSound.currentTime = 0;
        blankSound.play();
    }
}

function rotateGun(target, action) {
    const gun = document.getElementById("gun");

    let rotationAngle;
    if (currentPlayer === 1) {
        if (action === "self") {
            rotationAngle = 180; // Player 1 shoots himself (gun points left)
        } else if (action === "opponent") {
            rotationAngle = 0; // Player 1 shoots Player 2 (gun points right)
        }
    } else if (currentPlayer === 2) {
        if (action === "self") {
            rotationAngle = 0; // Player 2 shoots himself (gun points right)
        } else if (action === "opponent") {
            rotationAngle = 180; // Player 2 shoots Player 1 (gun points left)
        }
    }

    gun.style.transform = `rotate(${rotationAngle}deg)`;
    gun.style.transition = "transform 0.5s ease-in-out";
}

function updateHP(player, hp) {
    const energyBars = document.getElementById(`${player}-energy`);
    energyBars.innerHTML = "";
    for (let i = 0; i < hp; i++) {
        const energy = document.createElement("img");
        energy.src = "HP.png";
        energy.alt = "Energy";
        energy.className = "energy";
        energyBars.appendChild(energy);
    }
}

function shoot(target) {
    if (bullets.length === 0) {
        loadGun();
    }

    const bullet = bullets.pop();
    notifyBulletType(bullet);

    setTimeout(() => {
        if (bullet === "live") {
            if (target === "player1") player1HP--;
            if (target === "player2") player2HP--;

            updateHP(target, target === "player1" ? player1HP : player2HP);
        }

        // Check if the game is over
        if (player1HP === 0 || player2HP === 0) {
            const winnerSound = new Audio("winner.ogg");
            winnerSound.play();

            const winner = target === "player1" ? "Player 2" : "Player 1";
            showWinnerMessage(`${winner} wins! Congratulations!`);
            
            // Clear bullets to avoid further notifications
            bullets = [];
            return; // Exit to prevent notifying about the next turn or bullets
        }

        // Update turn and notify the next player
        if ((target === "player1" && currentPlayer !== 1) || (target === "player2" && currentPlayer !== 2)) {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
        updateTurnIndicator();
    }, 500);
}


function showWinnerMessage(message) {
    const winnerMessage = document.createElement("div");
    winnerMessage.id = "winner-message";
    winnerMessage.textContent = message;

    winnerMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.9);
        color: gold;
        padding: 20px 40px;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        border: 3px solid gold;
        border-radius: 10px;
        z-index: 1000;
    `;

    document.body.appendChild(winnerMessage);

    setTimeout(() => {
        document.body.removeChild(winnerMessage);
    }, 5000);
}

function resetGame() {
    player1HP = 3;
    player2HP = 3;
    loadGun();
    updateHP("player1", player1HP);
    updateHP("player2", player2HP);
    currentPlayer = 1;
    updateTurnIndicator();
}

document.getElementById("shoot-self").addEventListener("click", () => {
    const target = currentPlayer === 1 ? "player1" : "player2";
    rotateGun(target, "self");
    setTimeout(() => shoot(target), 500);
});

document.getElementById("shoot-opponent").addEventListener("click", () => {
    const target = currentPlayer === 1 ? "player2" : "player1";
    rotateGun(target, "opponent");
    setTimeout(() => shoot(target), 500);
});

loadGun();
updateHP("player1", player1HP);
updateHP("player2", player2HP);
updateTurnIndicator();
