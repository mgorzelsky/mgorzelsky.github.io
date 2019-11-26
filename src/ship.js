import { DetectCollision } from "./collisiondetection.js";

export default class Ship {
  constructor(game) {
    //Tell ship what the space looks like
    this.image = document.getElementById("img_playerShip");

    this.game = game;
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.ID = "Player";

    //Define the size and position of the ship
    this.width = 27;
    this.height = 39;
    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height - 20
    };
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    };

    //Define the movement speed and direction of the ship
    this.maxSpeed = 35;
    this.horizontalSpeed = 0;
    this.verticalSpeed = 0;

    //Define the projectile fire vector and its origin point and firing speed (for player ship it is always straight up)
    this.fireVector = {
      x: 0,
      y: -70
    };
    this.projectileOriginPoint = {
      x: this.position.x + this.width / 2 - 5 / 2,
      y: this.position.y - 1 - 5 / 2
    };

    this.fireRate = 15;
    this.count = 1;
    this.isFiring = false;
  }

  //Movement functions
  MoveUp() { this.verticalSpeed = -this.maxSpeed; }
  MoveLeft() { this.horizontalSpeed = -this.maxSpeed; }
  MoveDown() { this.verticalSpeed = this.maxSpeed; }
  MoveRight() { this.horizontalSpeed = this.maxSpeed; }
  StopVertical() { this.verticalSpeed = 0; }
  StopHorizontal() { this.horizontalSpeed = 0; }
  // 

  Fire() { this.game.CreateProjectile(this); }

  Update(deltaTime) {
    //Move the ship by changing the position x and y values by the current x and y speeds. Then
    //update the center point of the ship to the new position for the enemies to track.
    this.position.x += this.horizontalSpeed / deltaTime;
    this.position.y += this.verticalSpeed / deltaTime;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    }

    //Do not let the ship leave the game area.
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x + this.width > this.gameWidth)
      this.position.x = this.gameWidth - this.width;
    if (this.position.y < 0) this.position.y = 0;
    if (this.position.y + this.height > this.gameHeight)
      this.position.y = this.gameHeight - this.height;

    this.projectileOriginPoint = {
      x: this.position.x + this.width / 2 - 5 / 2,
      y: this.position.y - 1 - 5 / 2
    };

    //count counts up every update until it hits the fire rate, then if the ship isfiring - Fire() and reset the count,
    //if the ship is not isFiring, just reset the count without firing.
    this.count++;
    if (this.isFiring && this.count === this.fireRate) {
      this.count = 1;
      this.Fire();
    }
    if (this.count === this.fireRate) {
      this.count = 1;
    }

    //check to see if the ship has collided with any of the enemy fighters, if it has mark the ship for deletion.
    this.game.enemyFighters.forEach(object => {
      if (DetectCollision(this, object)) {
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
