const gameContainer = document.getElementById("game");
const buttonContainer = document.getElementById("btns");
const score1 = document.querySelector("#score1");
const score2 = document.querySelector("#score2");

const COLORS = [];

const selected = [];

const totalColors = 10;

let count = 0;

let scoreCount = 0;

let shuffledColors;

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.highScore) {
    score2.innerText = JSON.parse(localStorage.highScore);
  }
  else {
    localStorage.setItem("highScore", JSON.stringify(score2.innerText));
  }

  generateColors(totalColors, COLORS);
  shuffledColors = shuffle(COLORS);
});

function generateColors(colors, colorArray) {
  while (colorArray.length != 0) {
    colorArray.pop();
  }
  let r, g, b;
  for (let i = 0; i < colors; i++) {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
    colorArray.push(`rgb(${r}, ${g}, ${b})`);
    colorArray.push(`rgb(${r}, ${g}, ${b})`);
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.setAttribute("data-color", color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  if (selected.length >= 2 || event.target.getAttribute("data-faceup") === '') {
    return;
  }
  scoreCount++;
  score1.innerText = scoreCount;
  selected.push(event.target);
  event.target.style.backgroundColor = event.target.getAttribute("data-color");
  event.target.setAttribute("data-faceup", '');
  if (selected.length === 2) {
    if (selected[0].getAttribute("data-color") === selected[1].getAttribute("data-color")) {
      selected.pop();
      selected.pop();
      count += 2;
      //winning condition
      if (count === 2 * totalColors) {
        const restart = document.createElement("button");
        const colorChange = document.createElement("button");
        const resetBest = document.createElement("button");
        restart.innerText = "Play again!";
        restart.setAttribute("class", "resets");
        restart.addEventListener("click", resetCards);
        colorChange.innerText = "Change the colors";
        colorChange.setAttribute("class", "resets");
        colorChange.addEventListener("click", function () {
          generateColors(totalColors, COLORS);
          shuffledColors = shuffle(COLORS);
        });
        resetBest.innerText = "Reset Best Score";
        resetBest.setAttribute("class", "resets");
        resetBest.addEventListener("click", function (event) {
          localStorage.setItem("highScore", JSON.stringify(0));
          score2.innerText = 0;
          event.target.remove();
        });
        buttonContainer.append(restart);
        buttonContainer.append(colorChange);
        buttonContainer.append(resetBest);
        count = 0;
        if (scoreCount < parseInt(score2.innerText) || parseInt(score2.innerText) === 0) {
          localStorage.setItem("highScore", JSON.stringify(scoreCount));
          score2.innerText = scoreCount;
        }
      }
    }
    else {
      setTimeout(function () {
        selected[0].removeAttribute("data-faceup");
        selected[0].style.backgroundColor = "white";
        selected[1].removeAttribute("data-faceup");
        selected[1].style.backgroundColor = "white";
        selected.pop();
        selected.pop();
      }, 1000);
    }
  }
}

function resetCards(event) {
  const cards = document.querySelectorAll("#game div");
  for (card of cards) {
    card.remove();
  }
  scoreCount = 0;
  score1.innerText = scoreCount;
  score2.innerText = score2.innerText = JSON.parse(localStorage.highScore);
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  const resets = document.querySelectorAll(".resets");
  for (btns of resets) {
    btns.remove();
  }
}

document.querySelector("#start-btn").addEventListener("click", function (event) {
  createDivsForColors(shuffledColors);
  score1.parentElement.removeAttribute("hidden");
  score2.parentElement.removeAttribute("hidden");
  event.target.remove();
});
