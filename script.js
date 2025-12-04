const cardEl = document.querySelector(".card");
const frontTextEl = document.querySelector(".card-front");
const backTextEl = document.querySelector(".card-back");

const nextBtn = document.querySelector("#next");
const prevBtn = document.querySelector("#prev");
const deleteBtn = document.querySelector("#delete");
const addBtn = document.querySelector("#add");
const randomBtn = document.querySelector("#randomize");

const addDialog = document.querySelector("#add-dialog");
const frontInput = document.querySelector("#front-input");
const backInput = document.querySelector("#back-input");
const submitBtn = document.querySelector("#submit");
const closeBtn = document.querySelector("#close");

async function fetchJson(path, options = {}) {
    // TODO: handle errors
    const response = await fetch(path, options);
    const data = await response.json();
    return data;
}

async function postJson(path, body) {
    return fetchJson(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getCards = () => fetchJson("/cards");
const getCardById = (id) => fetchJson(`/card/${id}`);
const addCard = (front, back) => postJson("/new", { front, back });
const deleteCardById = (id) => fetchJson(`/delete/${id}`);

let allCards = [];
let cardIndex = -1;

async function updateCards() {
    allCards = await getCards();

    for (const btn of [nextBtn, prevBtn, deleteBtn, randomBtn]) {
        btn.disabled = allCards.length === 0;
    }

    showCard(cardIndex);
}

function showCard(newIndex) {
    if (newIndex >= allCards.length) newIndex = 0;
    if (newIndex <= -1) newIndex = allCards.length - 1;

    cardIndex = newIndex;

    let backText;

    if (allCards.length === 0 || cardIndex === -1) {
        frontTextEl.innerHTML = "Welcome to your Flashcard App!\n<small>(click to flip card)</small>";
        backText = "Get started by adding a Flashcard...";
    } else {
        frontTextEl.textContent = allCards[cardIndex].front;
        backText = allCards[cardIndex].back;
    }

    if (cardEl.classList.contains("reveal")) {
        cardEl.classList.remove("reveal");

        // wait for the card animation to finish before showing the back
        // (somewhat error-prone way to do this, but it works for our purposes)
        setTimeout(() => (backTextEl.textContent = backText), 800);
    } else {
        backTextEl.textContent = backText;
    }
}

nextBtn.addEventListener("click", () => showCard(cardIndex + 1));
prevBtn.addEventListener("click", () => showCard(cardIndex - 1));
cardEl.addEventListener("click", () => cardEl.classList.toggle("reveal"));

addBtn.addEventListener("click", () => addDialog.showModal());
closeBtn.addEventListener("click", () => addDialog.close());

submitBtn.addEventListener("click", async () => {
    const frontText = frontInput.value.trim();
    const backText = backInput.value.trim();

    if (frontText === "" || backText === "") return;

    await addCard(frontText, backText);
    await updateCards();

    frontInput.value = "";
    backInput.value = "";

    addDialog.close();
});

deleteBtn.addEventListener("click", async () => {
    await deleteCardById(allCards[cardIndex]._id);
    await updateCards();
});

randomBtn.addEventListener("click", () => {
    showCard(randomInteger(0, allCards.length - 1));
});

updateCards();
