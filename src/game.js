import Ship from "./ship.js";
import InputHandler from "./input.js";
import Projectile from "./projectile.js";
import EnemyFighter from "./enemyfighter.js";

const GAME_STATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAME_WON: 3,
  GAME_OVER: 4
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.enemyFighters = [];
  }

  Start() {
    this.gameState = GAME_STATE.RUNNING;

    this.ship = new Ship(this);
    for (let i = 0; i < 3; i++) {
      this.enemyFighters.push(new EnemyFighter(this));
    }
    this.gameObjects = [this.ship];

    new InputHandler(this.ship, this);
  }

  CreateProjectile(origin) {
    this.gameObjects.push(new Projectile(origin));
  }

  Update(deltaTime) {
    if (this.gameState === GAME_STATE.PAUSED) return;
    if (this.ship.markedForDeletion) {
      this.gameState = GAME_STATE.GAME_OVER;
      return;
    }
    if (this.enemyFighters.length === 0) {
      this.gameState = GAME_STATE.GAME_WON;
      return;
    }

    this.gameObjects.forEach(object => object.Update(deltaTime));
    this.enemyFighters.forEach(object => object.Update(deltaTime));

    this.gameObjects = this.gameObjects.filter(
      object => !object.markedForDeletion
    );
    this.enemyFighters = this.enemyFighters.filter(
      object => !object.markedForDeletion
    );
  }

  Draw(ctx) {
    ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    this.gameObjects.forEach(object => object.Draw(ctx));
    this.enemyFighters.forEach(object => object.Draw(ctx));

    if (this.gameState === GAME_STATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px Helvetica";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gameState === GAME_STATE.GAME_OVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px Helvetica";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gameState === GAME_STATE.GAME_WON) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px Helvetica";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("VICTORY", this.gameWidth / 2, this.gameHeight / 2);
    }
  }

  TogglePause() {
    if (this.gameState === GAME_STATE.PAUSED) {
      this.gameState = GAME_STATE.RUNNING;
    } else {
      this.gameState = GAME_STATE.PAUSED;
    }
  }
}
