let pet = null;

const monsterIcons = {
    Dragon: "🐉",
    Slime: "🟢",
    Ghost: "👻",
    "Bat Beast": "🦇",
    "Mushroom Buddy": "🍄"
};

const title = document.getElementById("pet-title");
const mood = document.getElementById("mood");
const display = document.getElementById("monster-display");
const levelEl = document.getElementById("level");

const healthBar = document.getElementById("health-bar");
const hungerBar = document.getElementById("hunger-bar");
const energyBar = document.getElementById("energy-bar");
const happyBar = document.getElementById("happy-bar");
const xpBar = document.getElementById("xp-bar");

const game = document.getElementById("game");
const selection = document.getElementById("monster-selection");

const continueCard =
    document.getElementById("continue-card");

const continueBtn =
    document.getElementById("continue-btn");

const instructionsBtn =
    document.getElementById("instructions-btn");

const instructionsModal =
    document.getElementById("instructions-modal");

const closeModal =
    document.getElementById("close-modal");

loadPet();

document
.querySelectorAll(".monster-btn")
.forEach(button => {

    button.addEventListener("click", () => {

        const petName =
            document
            .getElementById("pet-name")
            .value
            .trim() || "Nugget";

        pet = {
            name: petName,
            species: button.dataset.monster,
            health: 100,
            hunger: 100,
            energy: 100,
            happiness: 100,
            level: 1,
            xp: 0,
            lastPlayed: Date.now()
        };

        savePet();

        selection.classList.add("hidden");
        game.classList.remove("hidden");

        updateUI();

        log(`🏠 Welcome home, ${pet.name}!`);
    });
});

function updateUI() {

    if (!pet) return;

    title.textContent =
        `${pet.name} the ${pet.species}`;

    display.textContent =
        monsterIcons[pet.species];

    levelEl.textContent =
        pet.level;

    healthBar.style.width =
        pet.health + "%";

    hungerBar.style.width =
        pet.hunger + "%";

    energyBar.style.width =
        pet.energy + "%";

    happyBar.style.width =
        pet.happiness + "%";

    xpBar.style.width =
        pet.xp + "%";

    updateMood();
}

function updateMood() {

    if (pet.health < 25) {

        mood.textContent =
            "Mood: 🤢 Sick";

    } else if (pet.hunger < 25) {

        mood.textContent =
            "Mood: 😫 Hungry";

    } else if (pet.energy < 25) {

        mood.textContent =
            "Mood: 😴 Sleepy";

    } else if (pet.happiness > 80) {

        mood.textContent =
            "Mood: 😁 Thriving";

    } else {

        mood.textContent =
            "Mood: 😊 Happy";
    }
}

function gainXP(amount) {

    pet.xp += amount;

    if (pet.xp >= 100) {

        pet.level++;
        pet.xp = 0;

        log(
            `🎉 ${pet.name} reached Level ${pet.level}!`
        );
    }
}

function clampStats() {

    pet.health =
        Math.max(0, Math.min(100, pet.health));

    pet.hunger =
        Math.max(0, Math.min(100, pet.hunger));

    pet.energy =
        Math.max(0, Math.min(100, pet.energy));

    pet.happiness =
        Math.max(0, Math.min(100, pet.happiness));
}

function savePet() {

    if (!pet) return;

    pet.lastPlayed = Date.now();

    localStorage.setItem(
        "monsterHaven",
        JSON.stringify(pet)
    );
}

function loadPet() {

    const saved =
        localStorage.getItem("monsterHaven");

    if (!saved) return;

    pet = JSON.parse(saved);

    continueCard.classList.remove("hidden");

    continueBtn.textContent =
        `🐾 Continue with ${pet.name}`;
}

continueBtn.addEventListener("click", () => {

    continueCard.classList.add("hidden");
    selection.classList.add("hidden");
    game.classList.remove("hidden");

    const hoursAway =
        (Date.now() - pet.lastPlayed)
        / 3600000;

    pet.hunger -= Math.floor(hoursAway * 5);
    pet.energy -= Math.floor(hoursAway * 4);
    pet.happiness -= Math.floor(hoursAway * 3);

    clampStats();
    updateUI();

    log(
        `💖 Welcome back! ${pet.name} missed you.`
    );
});

document
.getElementById("home-new-pet-btn")
.addEventListener("click", () => {

    if (
        pet &&
        !confirm(
            `Delete ${pet.name} and start a new monster?`
        )
    ) {
        return;
    }

    localStorage.removeItem("monsterHaven");

    pet = null;

    continueCard.classList.add("hidden");

    selection.classList.remove("hidden");

    document.getElementById("pet-name").value = "";
});

function log(message) {

    const logBox =
        document.getElementById("log");

    const div =
        document.createElement("div");

    div.classList.add("log-entry");
    div.textContent = message;

    logBox.prepend(div);
}

document.getElementById("feed-btn").addEventListener("click", () => {

    pet.hunger += 20;

    gainXP(10);

    clampStats();
    updateUI();
    savePet();

    log("🍖 Fed your monster.");
});

document.getElementById("play-btn").addEventListener("click", () => {

    pet.happiness += 20;
    pet.energy -= 10;

    gainXP(15);

    clampStats();
    updateUI();
    savePet();

    log("🎾 You played together.");
});

document.getElementById("sleep-btn").addEventListener("click", () => {

    pet.energy += 25;

    gainXP(10);

    clampStats();
    updateUI();
    savePet();

    log("😴 Nap time.");
});

document.getElementById("clean-btn").addEventListener("click", () => {

    pet.health += 10;

    gainXP(5);

    clampStats();
    updateUI();
    savePet();

    log("🧼 Nice and clean.");
});

document.getElementById("medicine-btn").addEventListener("click", () => {

    pet.health += 20;
    pet.happiness -= 5;

    gainXP(5);

    clampStats();
    updateUI();
    savePet();

    log("💊 Medicine administered.");
});

document.getElementById("menu-btn").addEventListener("click", () => {

    game.classList.add("hidden");

    if (pet) {
        selection.classList.add("hidden");

        continueCard.classList.remove("hidden");

        continueBtn.textContent =
            `🐾 Continue with ${pet.name}`;
    } else {
        selection.classList.remove("hidden");
    }
});

document.getElementById("new-pet-btn").addEventListener("click", () => {

    if (
        !confirm(
            `Replace ${pet.name} with a new monster?`
        )
    ) {
        return;
    }

    localStorage.removeItem("monsterHaven");

    pet = null;

    game.classList.add("hidden");
    continueCard.classList.add("hidden");
    selection.classList.remove("hidden");

    document.getElementById("pet-name").value = "";
});

/* Instructions Modal */

instructionsBtn.addEventListener("click", () => {
    instructionsModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
    instructionsModal.classList.add("hidden");
});

instructionsModal.addEventListener("click", (e) => {

    if (e.target === instructionsModal) {
        instructionsModal.classList.add("hidden");
    }
});

setInterval(() => {

    if (!pet) return;

    pet.hunger -= 1;
    pet.energy -= 1;

    if (pet.hunger < 20) {
        pet.health -= 1;
    }

    if (pet.energy < 20) {
        pet.health -= 1;
    }

    clampStats();
    updateUI();
    savePet();

}, 10000);

setInterval(() => {

    if (!pet) return;

    const events = [
        "✨ Found a shiny rock!",
        "🍎 Found a snack!",
        "🎵 Sang a weird song!",
        "🦋 Chased a butterfly!",
        "😎 Practiced looking cool!"
    ];

    log(
        events[
            Math.floor(
                Math.random() * events.length
            )
        ]
    );

}, 45000);
