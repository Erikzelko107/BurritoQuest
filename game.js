const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const messageBox = document.getElementById("messageBox");

let level = 1;

const player = {
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
  setTimeout(() => (messageBox.style.display = "none"), time);
}

function move(direction) {
  switch (direction) {
    case "up":
      if (player.y > 0) player.y -= player.speed;
      break;
    case "down":
      if (player.y + player.height < canvas.height) player.y += player.speed;
      break;
    case "left":
      if (player.x > 0) player.x -= player.speed;
      break;
    case "right":
      if (player.x + player.width < canvas.width) player.x += player.speed;
      break;
  }

  checkCollisions();
  draw();
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (["arrowup", "w"].includes(key)) move("up");
  if (["arrowdown", "s"].includes(key)) move("down");
  if (["arrowleft", "a"].includes(key)) move("left");
  if (["arrowright", "d"].includes(key)) move("right");
});

function checkCollisions() {
  if (level === 1) {
    burritos.forEach((burrito) => {
      if (
        !burrito.collected &&
        player.x < burrito.x + 20 &&
        player.x + player.width > burrito.x &&
        player.y < burrito.y + 20 &&
        player.y + player.height > burrito.y
      ) {
        burrito.collected = true;
        showMessage("🌯 You got a Magic Burrito!");
        player.speed += 1;

        if (burritos.every((b) => b.collected)) {
          level = 2;
          showMessage("🎺 Level 2: Time to dance with the Mariachi!");
        }
      }
    });
  } else if (level === 2) {
    if (player.x > 700) {
      level = 3;
      showMessage("💥 Level 3: You’re facing the Churro Cartel!");
    }
  } else if (level === 3) {
    if (player.x > 750) {
      level = 4;
      showMessage("🛫 Final Level: Escape to El Norte!");
    }
  } else if (level === 4) {
    if (player.x > 780) {
      showMessage("🎉 YOU WIN! You reached El Norte!");
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Burritos
  if (level === 1) {
    burritos.forEach((burrito) => {
      if (!burrito.collected) {
        ctx.fillStyle = "#e17055";
        ctx.fillRect(burrito.x, burrito.y, 20, 20);
      }
    });
  }

  // Mariachi dancer (level 2)
  if (level === 2) {
    ctx.fillStyle = "#d63031";
    ctx.font = "20px Arial";
    ctx.fillText("💃 Mariachi Dance Zone ➡️", 550, 50);
  }

  // Churro Cartel (level 3)
  if (level === 3) {
    ctx.fillStyle = "#2d3436";
    ctx.fillText("💥 Churro Cartel Base Ahead!", 550, 50);
  }

  // Final Level
  if (level === 4) {
    ctx.fillStyle = "#0984e3";
    ctx.fillText("🌈 El Norte is here! ➡️", 600, 50);
  }
}

draw();
