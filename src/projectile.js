import { DetectCollision } from "./collisiondetection.js";

export default class Projectile {
  constructor(originObject) {
    this.image = document.getElementById("img_projectile");

    this.gameWidth = originObject.gameWidth;
    this.gameHeight = originObject.gameHeight;

    this.game = originObject.game;

    //this.speed = originObject.projectileSpeed;
    this.vector = {
      x: originObject.fireVector.x,
      y: originObject.fireVector.y
    }

    this.size = 5;

    this.position = {
      x: originObject.projectileOriginPoint.x - this.size / 2,
      y: originObject.projectileOriginPoint.y - this.size
    };

    this.markedForDeletion = false;
  }

  Update(deltaTime) {
    //this.position.y += this.speed / deltaTime;
    this.position.x += this.vector.x / deltaTime;
    this.position.y += this.vector.y / deltaTime;

    //check for out of bounds of the canvas.
    if (this.position.y < 0 
      || this.position.y > this.gameHeight
      || this.position.x < 0
      || this.position.x > this.gameHeight) {
      this.markedForDeletion = true;
    }

    // this.game.gameObjects.forEach(object => {
    //   if (DetectCollision(this, object)) {
    //     object.markedForDeletion = true;
    //     this.markedForDeletion = true;
    //   }
    // });
    // this.game.enemyFighters.forEach(object => {
    //   if (DetectCollision(this, object)) {
    //     object.markedForDeletion = true;
    //     this.markedForDeletion = true;
    //   }
    // });
  }

  Draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }
}
