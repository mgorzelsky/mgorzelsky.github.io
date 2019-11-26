export default class EnemyFighter {
  constructor(game) {
    this.image = document.getElementById("img_enemyFighter");

    this.game = game;

    this.ID = "EnemyFighter";

    this.angle = 0;
    this.shipSlope = {
      x: 0,
      y: 0
    }
    this.width = 39;
    this.height = 27;

    // This position representes the top left corner of the ship image. It HAS to stay constant (unless ship movement
    // is introduced; then everything needs to be re-worked,)
    this.position = {
      x: Math.random() * (game.gameWidth - 50),
      y: Math.random() * (game.gameHeight - 150)
    };
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    }
    // The original 4 corners to to be remembered so that the hitbox rotation is based off of a constant value.
    this.originalRearLeftCorner = {
      x: this.position.x,
      y: this.position.y
    }
    this.originalRearRightCorner = {
      x: this.position.x,
      y: this.position.y + this.height
    }
    this.originalFrontLeftCorner = {
      x: this.position.x + this.width,
      y: this.position.y
    }
    this.originalFrontRightCorner = {
      x: this.position.x + this.width,
      y: this.position.y + this.height
    }
    // The actual corner coordinates of the hitbox.
    this.rearLeftCorner = {
      x: this.originalRearLeftCorner.x,
      y: this.originalRearLeftCorner.y
    }
    this.rearRightCorner = {
      x: this.originalRearRightCorner.x,
      y: this.originalRearRightCorner.y
    }
    this.frontLeftCorner = {
      x: this.originalFrontLeftCorner.x,
      y: this.originalFrontLeftCorner.y
    }
    this.frontRightCorner = {
      x: this.originalFrontRightCorner.x,
      y: this.originalFrontRightCorner.y
    }

    this.markedForDeletion = false;

    this.projectileSpeed = 50;
    this.fireVector = {
      x: 0,
      y: 0
    }
    //Set the default origin point of the projectile.
    this.projectileOriginPoint = {
      x: ((this.frontLeftCorner.x + this.frontRightCorner.x) / 2) + this.shipSlope.x,
      y: ((this.frontLeftCorner.y + this.frontRightCorner.y) / 2) + this.shipSlope.y
    };

    // fireRate is the number the count has to get to before the ship fires. All ships fire at different times by
    // randomizing the starting number of the count.
    this.fireRate = 70;
    this.count = Math.floor(Math.random() * this.fireRate);
  }

  // First find the vector (slope of a line) from the projectile origin and normalize it with the magnitude (line c in a triangle).
  // Also calculate the angle of rotation the ship needs to undergo to track the player
  TrackPlayer() {
    this.fireVector.x = this.game.ship.center.x - this.projectileOriginPoint.x; // x
    this.fireVector.y = this.game.ship.center.y - this.projectileOriginPoint.y; // y

    let magnitude = Math.sqrt(Math.pow(this.fireVector.x, 2) + Math.pow(this.fireVector.y, 2)); // c
    
    //Normalized values so that projectiles move the same speed regardless of distance to the target.
    this.fireVector.x = (this.fireVector.x / magnitude) * this.projectileSpeed;
    this.fireVector.y = (this.fireVector.y / magnitude) * this.projectileSpeed;
    
    // angle XCY
    //Calculate angle from enemy fighter to player in radians
    this.angle = this.CalculateOrientation();
  }

  // recalculate the slope from the center of the ship, then use the length of all 3 sides to find the 
  // angle. Save the normalized slope to use it to find the location of the projectile origin point later.
  CalculateOrientation() {
    let sideX = this.game.ship.center.x - this.center.x; // x
    let sideY = this.game.ship.center.y - this.center.y; // y
    let sideC = Math.sqrt(Math.pow(sideX, 2) + Math.pow(sideY, 2)); // c
    this.shipSlope.x = sideX / sideC;
    this.shipSlope.y = sideY / sideC;
    
    // THIS CHECK ENSURES NO DIVIDING BY ZERO
    if (sideX === 0 || sideC === 0) {
      return 0;
    }
    //TOP LEFT
    else if (this.game.ship.center.x < this.center.x && this.game.ship.center.y < this.center.y) {
      return Math.acos((sideC ** 2 + sideX ** 2 - sideY ** 2) / Math.abs((2 * sideC * sideX)));
    }
    //TOP RIGHT
    else if (this.game.ship.center.x > this.center.x && this.game.ship.center.y < this.center.y) {
      return Math.acos((sideC ** 2 + sideX ** 2 - sideY ** 2) / -(2 * sideC * sideX));
    }
    //positive y
    else {
      return Math.acos((sideC ** 2 + sideX ** 2 - sideY ** 2) / (2 * sideC * sideX));
    }
  }

  RotateHitbox(x, y) {
    let newX = 0;
    let newY = 0;
    // Reset the origin to rotate around to the center of the rotating object
    let tempX = x - this.center.x;
    let tempY = y - this.center.y;

    // If the player ship is higher on the coordinate plane than the enemy ship the angle needs to be increased by
    // PI radians (180 degrees) as the math can only account for up to 180degrees on its own.
    if (this.center.y < this.game.ship.center.y) {
      newX = tempX * Math.cos(this.angle) - tempY * Math.sin(this.angle);
      newY = tempY * Math.cos(this.angle) + tempX * Math.sin(this.angle);
    }
    else {
      newX = tempX * Math.cos(this.angle + Math.PI) - tempY * Math.sin(this.angle + Math.PI);
      newY = tempY * Math.cos(this.angle + Math.PI) + tempX * Math.sin(this.angle + Math.PI);
    }
    // move the origin back to its original location
    newX += this.center.x;
    newY += this.center.y;
    return [newX, newY]
  }

  Fire() {
    this.game.CreateProjectile(this);
  }

  Draw(ctx) {
    ctx.translate(this.center.x, this.center.y);
    //TOP
    if (this.game.ship.center.y < this.center.y) {
      ctx.rotate(this.angle + Math.PI);
      ctx.drawImage(this.image, -(this.width / 2), -(this.height / 2));
      ctx.rotate(-(this.angle + Math.PI));
    }
    //BOTTOM
    else {
      ctx.rotate(this.angle);
      ctx.drawImage(this.image, -(this.width / 2), -(this.height / 2));
      ctx.rotate(-this.angle);
    }
    ctx.translate(-this.center.x, -this.center.y);

    // // These are used to visualize the corners of the ship's hitbox
    // ctx.fillRect(this.rearLeftCorner.x, this.rearLeftCorner.y, 1, 1);
    // ctx.fillRect(this.rearRightCorner.x, this.rearRightCorner.y, 1, 1);
    // ctx.fillRect(this.frontLeftCorner.x, this.frontLeftCorner.y, 1, 1);
    // ctx.fillRect(this.frontRightCorner.x, this.frontRightCorner.y, 1, 1);
  }

  // Update all the positional data of the ship and decided if it is time for it to fire yet.
  Update(deltaTime) {
    this.TrackPlayer();
    [this.rearLeftCorner.x, this.rearLeftCorner.y] = this.RotateHitbox(this.originalRearLeftCorner.x, this.originalRearLeftCorner.y);
    [this.rearRightCorner.x, this.rearRightCorner.y] = this.RotateHitbox(this.originalRearRightCorner.x, this.originalRearRightCorner.y);
    [this.frontLeftCorner.x, this.frontLeftCorner.y] = this.RotateHitbox(this.originalFrontLeftCorner.x, this.originalFrontLeftCorner.y);
    [this.frontRightCorner.x, this.frontRightCorner.y] = this.RotateHitbox(this.originalFrontRightCorner.x, this.originalFrontRightCorner.y);

    this.projectileOriginPoint = {
      x: ((this.frontLeftCorner.x + this.frontRightCorner.x) / 2) + this.shipSlope.x,
      y: ((this.frontLeftCorner.y + this.frontRightCorner.y) / 2) + this.shipSlope.y
    };

    this.count++;
    if (this.count === this.fireRate) {
      this.count = 1;
      this.Fire();
    }
  }
}
