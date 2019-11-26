import { DetectCollision } from "./collisiondetection.js";

export default class Projectile {
  constructor(originObject) {
    this.image = document.getElementById("img_projectile");

    this.ID = originObject.ID;

    this.gameWidth = originObject.gameWidth;
    this.gameHeight = originObject.gameHeight;

    this.game = originObject.game;

    this.vector = {
      x: originObject.fireVector.x,
      y: originObject.fireVector.y
    }

    this.width = 5;
    this.height = 5;

    this.position = {
      x: originObject.projectileOriginPoint.x,
      y: originObject.projectileOriginPoint.y
    };

    this.markedForDeletion = false;
  }

  // Update the positional data of the projectile based on the vector information from the firing object and then check
  // for collisions with any other game objects.
  Update(deltaTime) {
    this.position.x += this.vector.x / deltaTime;
    this.position.y += this.vector.y / deltaTime;

    //check for out of bounds of the canvas.
    if (this.position.y < 0 
      || this.position.y > this.gameHeight
      || this.position.x < 0
      || this.position.x > this.gameWidth) {
      this.markedForDeletion = true;
    }

    this.game.gameObjects.forEach(object => {
      if (DetectCollision(this, object)) {
        object.markedForDeletion = true;
        this.markedForDeletion = true;
      }
    });
    this.game.enemyFighters.forEach(object => {
      if (DetectCollision(this, object)) {
        object.markedForDeletion = true;
        this.markedForDeletion = true;
      }
    });
  }

  Draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
