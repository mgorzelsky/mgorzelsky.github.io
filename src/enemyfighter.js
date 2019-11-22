export default class EnemyFighter {
  constructor(game) {
    this.image = document.getElementById("img_enemyFighter");

    this.game = game;
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.angle = 0;
    this.width = 39;
    this.height = 27;
    this.position = {
      x: Math.floor(Math.random() * game.gameWidth),
      y: Math.floor(Math.random() * (game.gameHeight / 2))
    };
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    }

    this.maxSpeed = 3;
    this.speed = {
      x: 0,
      y: 0
    }

    this.markedForDeletion = false;

    this.projectileSpeed = 70;
    this.fireVector = {
      x: 0,
      y: 70
    }
    this.projectileOriginPoint = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height + 2
    };

    this.fireRate = 100;
    this.count = 1;
  }

  TrackPlayer() {
    this.fireVector.x = this.game.ship.center.x - this.projectileOriginPoint.x; // a
    this.fireVector.y = this.game.ship.center.y - this.projectileOriginPoint.y; // b

    let magnitude = Math.sqrt(Math.pow(this.fireVector.x, 2) + Math.pow(this.fireVector.y, 2)); // c

    // angle B
    //Calculate angle from enemy fighter to player in radians
    this.angle = this.CalculateOrientation(magnitude);
    //this.angle = (Math.acos((magnitude ** 2 + this.fireVector.x ** 2 - this.fireVector.y ** 2) / (2 * magnitude * this.fireVector.x)));

    //Normalized values so that projectiles move the same speed regardless of distance to the target.
    this.fireVector.x = (this.fireVector.x / magnitude) * this.projectileSpeed;
    this.fireVector.y = (this.fireVector.y / magnitude) * this.projectileSpeed;
  }

  CalculateOrientation(c) {
    //TOP LEFT
    if (this.game.ship.center.x < this.center.x && this.game.ship.center.y < this.center.y) {
      return Math.acos((c ** 2 + this.fireVector.x ** 2 - this.fireVector.y ** 2) / Math.abs((2 * c * this.fireVector.x)));
    }
    //TOP RIGHT
    else if(this.game.ship.center.x > this.center.x && this.game.ship.center.y < this.center.y) {
      return Math.acos((c ** 2 + this.fireVector.x ** 2 - this.fireVector.y ** 2) / -(2 * c * this.fireVector.x));
    }
    //positive y
    else {
      return Math.acos((c ** 2 + this.fireVector.x ** 2 - this.fireVector.y ** 2) / (2 * c * this.fireVector.x));
    }
  }

  Fire() {
    this.game.CreateProjectile(this);
  }

  Draw(ctx) {
    ctx.translate(this.center.x, this.center.y);
    //TOP LEFT
    if (this.game.ship.center.x < this.center.x && this.game.ship.center.y < this.center.y) {
      ctx.rotate(this.angle + Math.PI);
      ctx.drawImage(this.image, -(this.width / 2), -(this.height / 2));
      ctx.rotate(-(this.angle + Math.PI));
    }
    //TOP RIGHT
    else if (this.game.ship.center.x > this.center.x && this.game.ship.center.y < this.center.y) {
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
  }

  Update(deltaTime) {
    this.TrackPlayer();
    this.position.x += this.speed.x / deltaTime;
    this.position.y += this.speed.y / deltaTime;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    }

    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x + this.width > this.gameWidth)
      this.position.x = this.gameWidth - this.width;
    if (this.position.y < 0) this.position.y = 0;
    if (this.position.y + this.height > this.gameHeight)
      this.position.y = this.gameHeight - this.height;

    this.projectileOriginPoint = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height + 2
    };

    this.count++;
    if (this.count === this.fireRate) {
      this.count = 1;
      this.Fire();
    }
  }
}
