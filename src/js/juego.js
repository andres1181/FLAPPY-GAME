const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");

const flappyImg = new Image();
flappyImg.src = "assets/imagenes/nave.png";

const FLAP_SPEED = -5;
const NAVE_WIDTH = flappyImg.width;
const NAVE_HEIGHT = flappyImg.height;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

let navedx = 50;
let navedy = 50;
let naveVelocity = 0;
let naveAcceleraction = 0.1;

let pipeX = 400;
let pipeY = canvas.height - 230;

let scoreDiv = document.getElementById("score-display");
let score = 0;

let scored = false;

let highScore = 0;

document.body.onkeyup = function (e) {
  if (e.code == "KeyA") {
    naveVelocity = FLAP_SPEED;
  }
};

document
  .getElementById("restart-button")
  .addEventListener("click", function (e) {
    hideEndMenu();
    resetGame();
    loop();
  });

function increaseScore() {
  if (
    navedx > pipeX + PIPE_WIDTH &&
    (navedy < pipeY + PIPE_GAP || navedy + NAVE_HEIGHT > pipeY + PIPE_GAP) &&
    !scored
  ) {
    score++;
    scoreDiv.innerHTML = score;
    scored = true;
  }
  if (navedx < pipeX + PIPE_WIDTH) {
    scored = false;
  }
}

function collisionCheck() {
  const naveBox = {
    //El contenedor de la  nave
    x: navedx,
    y: navedy,
    width: NAVE_WIDTH,
    height: NAVE_HEIGHT,
  };
  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + NAVE_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY,
  };
  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + NAVE_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP,
  };

  //validar colision con el tubo superior
  if (
    naveBox.x + naveBox.width > topPipeBox.x &&
    naveBox.x < topPipeBox.x + topPipeBox.width &&
    naveBox.y < topPipeBox.y
  ) {
    return true;
  }
  if (
    naveBox.x + naveBox.width > bottomPipeBox.x &&
    naveBox.x < bottomPipeBox.x + bottomPipeBox.width &&
    naveBox.y + naveBox.height > bottomPipeBox.y
  ) {
    return true;
  }
  if (navedy < 0 || navedy + NAVE_HEIGHT > canvas.height) {
    return true;
  }

  //Validar colision con el tubo inferior
}

function showEndMenu() {
  document.getElementById("end-game").style.display = "block";
  gameContainer.classList.add("backdrop-blur");
  document.getElementById("end-score").innerHTML = score;
}

function hideEndMenu() {
  document.getElementById("end-game").style.display = "none";
  gameContainer.classList.remove("backdrop-blur");
}
function resetGame() {
  navedx = 50;
  navedy = 50;
  naveVelocity = 0;
  naveAcceleraction = 0.1;

  pipeX = 400;
  pipeY = canvas.height - 200;
  score = 0;
  scoreDiv.innerHTML = score;
}

function endGame() {
  showEndMenu();
  if (highScore < score) {
    highScore = score;
  }
  document.getElementById("best-score").innerHTML = highScore;
}

function crearObstaculos() {
  ctx.fillStyle = "#333";
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  pipeX -= 1.5;

  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP);
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
  ctx.drawImage(flappyImg, navedx, navedy);

  if (collisionCheck()) {
    endGame();
    return;
  }
  crearObstaculos();
  naveVelocity += naveAcceleraction;
  navedy += naveVelocity;

  increaseScore();
  requestAnimationFrame(loop);
}

loop();
