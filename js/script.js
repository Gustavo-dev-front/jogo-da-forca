const KEYBOARD_BOX = document.querySelector(".keyboard");

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

// Continuar a implementar a função abaixo, que será responsável por validar a letra selecionada pelo usuário
function handleKeyboard(e) {
  const element = e.target;
  if (element.tagName === "BUTTON") console.log(element.tagName);
}

KEYBOARD_BOX.addEventListener("click", handleKeyboard);
createKeyboard(97, 122);
getData();
