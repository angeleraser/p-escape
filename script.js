const area = document.getElementById("body");
const hitbox = document.querySelector(".hitbox");

class Enemy {
  constructor({ position, rotation }) {
    this.position = position;
    this.rootElement = this.createRootElement({ position, rotation });
    this.insert();
    this.movementInterval = undefined;
    this.movementMultiplier = Math.random() * 0.3 + 0.5;
  }

  getPosition() {
    return this.position;
  }

  createRootElement({ position, rotation }) {
    const div = document.createElement("div");
    div.classList.add("enemy");

    div.style.top = `${position.y}px`;
    div.style.left = `${position.x}px`;
    div.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    return div;
  }

  setPosition(newPosition) {
    const currentPosition = { ...this.position };

    if (newPosition.x > currentPosition.x) {
      this.position.x += this.movementMultiplier;
    }

    if (newPosition.x < currentPosition.x) {
      this.position.x -= this.movementMultiplier;
    }

    if (newPosition.y > currentPosition.y) {
      this.position.y += this.movementMultiplier;
    }

    if (newPosition.y < currentPosition.y) {
      this.position.y -= this.movementMultiplier;
    }

    this.rootElement.style.top = `${this.position.y}px`;
    this.rootElement.style.left = `${this.position.x}px`;
  }

  insert() {
    area.appendChild(this.rootElement);
  }
}

function getRandomPosition() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  };
}

function getRandomRotation() {
  return Math.ceil(Math.random() * 360);
}

function getMousePosition(event) {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function getHitboxPosition() {
  const { top, left } = hitbox.getBoundingClientRect();
  return { x: left, y: top };
}

const mousePosition = { x: 0, y: 0 };

window.addEventListener("mousemove", function (event) {
  const { x, y } = getMousePosition(event);
  mousePosition.x = x;
  mousePosition.y = y;
  hitbox.style.top = `${y}px`;
  hitbox.style.left = `${x}px`;
});

const enemies = [new Enemy({ position: { x: 0, y: 0 }, rotation: 90 })];
let isCatched = false;
let isCreatingEnemy = false;

function isMouseCatched(enemy) {
  const { x: enemyX, y: enemyY } = enemy.getPosition();
  const { x: hitboxX, y: hitboxY } = getHitboxPosition();

  const xAxis = Math.floor(Math.abs(enemyX - hitboxX));
  const yAxis = Math.floor(Math.abs(enemyY - hitboxY));

  return xAxis > 48 && xAxis <= 50 && yAxis > 48 && yAxis <= 50;
}

setInterval(function () {
  const { x: mouseX, y: mouseY } = mousePosition;

  enemies.forEach(function (enemy) {
    enemy.setPosition({ x: mouseX, y: mouseY });
  });

  if (enemies.length === 10) return;

  if (isMouseCatched(enemies[enemies.length - 1]) && mouseX > 0 && mouseY > 0) {
    isCreatingEnemy = true;

    enemies.push(
      new Enemy({
        position: getRandomPosition(),
        rotation: getRandomRotation(),
      })
    );

    setTimeout(() => {
      isCreatingEnemy = false;
    }, 1000);
  }
}, 0.25);
