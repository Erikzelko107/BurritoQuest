const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const messageBox = document.getElementById("messageBox");
const playerHealthBar = document.getElementById("playerHealth");

let level = 1;

// Player stats
const player = {
  x: 50,
  y: 300,
  width: 40,
  height: 40,
  color: "#6c5ce7",
  speed: 5,
  maxHealth: 100,
  health: 100,
  attackPower: 20,
  canAttack: true,
  attackCooldown: 600 // ms
};

// Enemy template
class Enemy {
  constructor(x, y, width, height, color, health, attackPower, speed, name) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.health = health;
    this.maxHealth = health;
    this.attackPower = attackPower;
    this.speed = speed;
    this.name = name;
    this.alive = true;
  }

  draw() {
    if (!this.alive) return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Health bar
    ctx.fillStyle = "#d63031";
    ctx.fillRect(this.x, this.y - 10, this.width, 6);
    ctx.fillStyle = "#00b894";
    ctx.fillRect(this.x, this.y - 10, (this.health / this.maxHealth) * this.width, 6);

    // Name
    ctx.fillStyle = "#2d3436";
    ctx.font = "12px Arial";
    ctx.fillText(this.name, this.x, this.y - 15);
  }

  moveToward(target) {
    if (!this.alive) return;

    if (this.x > target.x + target.width) this.x -= this.speed;
    else if (this.x + this.width < target.x) this.x += this.speed;

    if (this.y > target.y + target.height) this.y -= this.speed;
    else if (this.y + this.height < target.y) this.y += this.speed;
  }
}

// Enemies per level
let enemies = [];

// Burritos (level 1 collectible)
let burritos = [
  { x: 200, y: 320, collected: false },
  { x: 500, y: 320, collected: false },
];

// Utility: Show message
function showMessage(text, time = 2000) {
  messageBox.innerText = text;
  messageBox.style.display = "block";
  setTimeout(() => (messageBox.style.display = "none"), time);
}

// Movement input handlers
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
  updateGame();
}

// Attack logic
function playerAttack() {
  if (!player.canAttack) return;
  player.canAttack = false;
  showMessage("👊 You attacked!");

  enemies.forEach((enemy) => {
    if (
      enemy.alive &&
      rectsIntersect(player, enemy)
    ) {
      enemy.health -= player.attackPower;
      if (enemy.health <= 0) {
        enemy.alive = false;
        showMessage(`💀 You defeated ${enemy.name}!`, 1500);
      }
    }
  });

  setTimeout(() => {
    player.canAttack = true;
  }, player.attackCooldown);
}

// Rectangle collision detection
function rectsIntersect(r1, r2) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

// Check collisions for collectibles & enemies, handle enemy attacks
function updateGame() {
  if (level === 1) {
    // Check burrito pickups
    burritos.forEach((burrito) => {
      if (
        !burrito.collected &&
        player.x < burrito.x + 20 &&
        player.x + player.width > burrito.x &&
        player.y < burrito.y + 20 &&
        player.y + player.height > burrito.y
      ) {
        burrito.collected = true;
        showMessage("🌯 You got a Magic Burrito! Speed +1");
        player.speed += 1;
      }
    });

    // If all burritos collected, next level
    if (burritos.every((b) => b.collected)) {
      startLevel(2);
    }
  }

  if (level === 2) {
    // Mariachi dance level: Move to right to start fight
    if (player.x > 700) {
      startLevel(3);
    }
  }

  if (level === 3) {
    // Enemies move toward player and attack
    enemies.forEach((enemy) => {
      if (enemy.alive) {
        enemy.moveToward(player);

        if (rectsIntersect(enemy, player)) {
          enemyAttack(enemy);
        }
      }
    });

    // Check if all enemies defeated to proceed
    if (enemies.every((e) => !e.alive)) {
      startLevel(4);
    }
  }

  if (level === 4) {
    // Final escape: move right to win
    if (player.x > 780) {
      showMessage("🎉 YOU WIN! You reached El Norte!", 5000);
    }
  }

  draw();
}

// Enemy attacks player
function enemyAttack(enemy) {
  if (!enemy.alive) return;
  if (player.health > 0) {
    player.health -= enemy.attackPower;
    if (player.health < 0) player.health = 0;
    updateHealthBar();
    showMessage(`😵 Hit by ${enemy.name}! -${enemy.attackPower} HP`, 1000);
    if (player.health <= 0) {
      showMessage("💀 You died! Reload to try again.");
      disableControls();
    }
  }
}

// Update player health bar UI
function updateHealthBar() {
  playerHealthBar.style.width = (player.health / player.maxHealth) * 100 + "%";
}

// Disable all controls on death
function disableControls() {
  // Remove keydown listeners
  document.removeEventListener("keydown", keyDownHandler);
  // Disable dpad buttons
  dpadButtons.forEach((btn) => btn.disabled = true);
}

// Draw game scene
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Burritos on Level 1
  if (level === 1) {
    burritos.forEach((burrito) => {
      if (!burrito.collected) {
        ctx.fillStyle = "#e17055";
        ctx.fillRect(burrito.x, burrito.y, 20, 20);
      }
    });

    ctx.fillStyle = "#2d3436";
    ctx.font = "20px Arial";
    ctx.fillText("🌯 Collect all Magic Burritos!", 10, 30);
  }

  // Level 2: Mariachi dance zone (just a zone, no combat)
  if (level === 2) {
    ctx.fillStyle = "#d63031";
    ctx.font = "24px Arial";
    ctx.fillText("💃 Dance your way right to start the fight!", 10, 50);
    ctx.fillText("➡️ Move to the right edge", 10, 80);
  }

  // Level 3: Fight Churro Cartel (enemies visible)
  if (level === 3) {
    ctx.fillStyle = "#2d3436";
    ctx.font = "20px Arial";
    ctx.fillText("💥 Fight the Churro Cartel!", 10, 30);

    enemies.forEach((enemy) => {
      enemy.draw();
    });
  }

  // Level 4: Final Escape zone
  if (level === 4) {
    ctx.fillStyle = "#0984e3";
    ctx.font = "24px Arial";
    ctx.fillText("🏃‍♂️ Final Escape! Reach the right edge!", 10, 30);
  }
}

// Start a specific level setup
function startLevel(n) {
  level = n;
  player.x = 50;
  player.y = 300;
  player.speed = 5;
  player.health = player.maxHealth;
  updateHealthBar();

  if (level === 1) {
    burritos.forEach(b => (b.collected = false));
    enemies = [];
    showMessage("Level 1: Find all Magic Burritos!");
  } else if (level === 2) {
    burritos = [];
    enemies = [];
    showMessage("Level 2: Dance with the Mariachi!");
  } else if (level === 3) {
    // Create enemies: Churro Cartel
    enemies = [
      new Enemy(700, 280, 40, 40, "#d63031", 50, 10, 1.5, "Churro Thug 1"),
      new Enemy(740, 320, 40, 40, "#d63031", 50, 10, 1.2, "Churro Thug 2"),
    ];
    showMessage("Level 3: Fight the Churro Cartel!");
  } else if (level === 4) {
    enemies = [];
    showMessage("Level 4: Final Escape! Run to El Norte!");
  }

  draw();
}

// Keyboard input
function keyDownHandler(e) {
  const key = e.key.toLowerCase();
  if (["arrowup", "w"].includes(key)) move("up");
  if (["arrowdown", "s"].includes(key)) move("down");
  if (["arrowleft", "a"].includes(key)) move("left");
  if (["arrowright", "d"].includes(key)) move("right");
  if (key === " ") playerAttack(); // Spacebar attack
}

// Attach keyboard listeners
document.addEventListener("keydown", keyDownHandler);

// Attach mobile D-pad listeners
const dpadButtons = [
  document.getElementById("upBtn"),
  document.getElementById("downBtn"),
  document.getElementById("leftBtn"),
  document.getElementById("rightBtn"),
  document.getElementById("attackBtn"),
];

dpadButtons[0].addEventListener("touchstart", () => move("up"));
dpadButtons[1].addEventListener("touchstart", () => move("down"));
dpadButtons[2].addEventListener("touchstart", () => move("left"));
dpadButtons[3].addEventListener("touchstart", () => move("right"));
dpadButtons[4].addEventListener("touchstart", () => playerAttack());

dpadButtons[0].addEventListener("mousedown", () => move("up"));
dpadButtons[1].addEventListener("mousedown", () => move("down"));
dpadButtons[2].addEventListener("mousedown", () => move("left"));
dpadButtons[3].addEventListener("mousedown", () => move("right"));
dpadButtons[4].addEventListener("mousedown", () => playerAttack());

// Start game
startLevel(1);
