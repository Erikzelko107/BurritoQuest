const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const messageBox = document.getElementById("messageBox");

let player = {
  x: 50,
  y: 300,
  width: 40,
  height: 40,
  color: "#6c5ce7",
  speed: 5
};

let burritos = [
  { x: 200, y: 320, collected: false },
  { x: 500, y: 320, collected: false },
];

function showMessage(text, time = 2000) {
  messageBox.innerText = text;
  messageBox.style.display = "block";
  setTimeout(() => messageBox.style.display = "none", time);
}

document.addEventListener("keydown", movePlayer);

function movePlayer(e) {
  switch (e.key) {
    case "ArrowRight":
      player.x += player.speed;
      break;
    case "ArrowLeft":
      player.x -= player.speed;
      break;
    case "ArrowUp":
      player.y -= player.speed;
      break;
    case "ArrowDown":
      player.y += player.speed;
      break;
  }

  checkCollisions();
  draw();
}

function checkCollisions() {
  burritos.forEach((burrito) => {
    if (!burrito.collected &&
        player.x < burrito.x + 20 &&
        player.x + player.width > burrito.x &&
        player.y < burrito.y + 20 &&
        player.y + player.height > burrito.y) {
      burrito.collected = true;
      showMessage("🌯 You found a Magic Burrito! Speed boosted!");
      player.speed += 1;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Burritos
  burritos.forEach((burrito) => {
    if (!burrito.collected) {
      ctx.fillStyle = "#e17055";
      ctx.fillRect(burrito.x, burrito.y, 20, 20);
    }
  });
}

draw();
