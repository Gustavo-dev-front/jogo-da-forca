const KEYBOARD_BOX = document.querySelector(".keyboard");
const GAME_MODAL = document.querySelector(".game-modal");
const BTN_AGAIN = document.querySelector(".btn-play-again");
const wrongGuessesSpan = document.querySelector(".wrong-guesses span");
const MAX_ATTEMPTS = 6;
let currentWord;
let wrongGuesses = 0;
let correctGuesses = [];

function reset() {
  const buttons = KEYBOARD_BOX.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = false));
  wrongGuesses = 0;
  correctGuesses = [];
  getData();
  updateHangman();
  GAME_MODAL.classList.remove("show");
}

function updateHangman() {
  let hangmanSrc = `../images/hangman-${wrongGuesses}.svg`;
  document.querySelector(".hangman-box img").src = hangmanSrc;
  wrongGuessesSpan.innerText = ` ${wrongGuesses} / ${MAX_ATTEMPTS}`;
}

function createKeyboard(a, b) {
  for (let index = a; index <= b; index++) {
    let button = document.createElement("button");
    button.innerText = String.fromCharCode(index);
    KEYBOARD_BOX.appendChild(button);
  }
}

async function getData() {
  const randomN = Math.random();
  try {
    const response = await (await fetch("../data/data.json")).json();
    const randomIndex = Math.round(randomN * (response.length - 1));
    const { hint, word } = response[randomIndex];
    currentWord = word.toUpperCase();
    const chars = word
      .split("")
      .map(() => `<li class="letter"></li>`)
      .join("");
    document.querySelector(".hint").innerText = `Dica: ${hint}`;
    document.querySelector(".output ul").innerHTML = chars;
  } catch (error) {
    console.log(error);
  }
}

function gameStatus(status) {
  GAME_MODAL.classList.add("show");
  const isGameOver = status === "game-over" ? true : false;
  const img = GAME_MODAL.querySelector("img");
  const h2 = GAME_MODAL.querySelector("h2");
  const p = GAME_MODAL.querySelector("p");
  const span = GAME_MODAL.querySelector("p span");
  img.src = isGameOver ? "../images/lost.gif" : "../images/victory.gif";
  h2.innerText = isGameOver ? `Game Over!` : `Parabéns!`;
  p.innerText = isGameOver
    ? `A palavra correta era: `
    : `Você acertou a palavra: `;
  span.innerText = currentWord;
  p.appendChild(span);
}

function handleKeyboard(e) {
  const element = e.target;
  if (element.tagName === "BUTTON") {
    const letter = element.innerText;
    const hasLetter = currentWord.includes(letter);

    if (hasLetter) {
      const UNDERSCORES = [...document.querySelectorAll(".output ul .letter")];
      const wordArray = [...currentWord];
      wordArray.forEach((item, index) => {
        if (item === letter) {
          UNDERSCORES[index].innerText = letter;
          UNDERSCORES[index].classList.add("guessed");
          correctGuesses.push(letter);
        }
      });
    } else {
      wrongGuesses++;
      updateHangman();
    }
    element.disabled = true;

    if (wrongGuesses === MAX_ATTEMPTS) gameStatus("game-over");
    if (correctGuesses.length === currentWord.length) gameStatus("champion");
  }
}

getData();
createKeyboard(97, 122);
KEYBOARD_BOX.addEventListener("click", handleKeyboard);
BTN_AGAIN.addEventListener("click", reset);
