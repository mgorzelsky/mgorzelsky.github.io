export default class InputHandler {
  constructor(ship, game) {
    document.addEventListener("keydown", event => {
      switch (event.code) {
        case "ArrowUp": //up
          ship.MoveUp();
          break;
        case "ArrowLeft": //left
          ship.MoveLeft();
          break;
        case "ArrowDown": //down
          ship.MoveDown();
          break;
        case "ArrowRight": //right
          ship.MoveRight();
          break;
        case "KeyW": //up
          ship.MoveUp();
          break;
        case "KeyA": //left
          ship.MoveLeft();
          break;
        case "KeyS": //down
          ship.MoveDown();
          break;
        case "KeyD": //right
          ship.MoveRight();
          break;
        case "Space":
          ship.Fire();
          ship.count = 1;
          ship.isFiring = true;
          break;
        case "Escape":
          game.TogglePause();
          break;
        default:
      }
    });
    document.addEventListener("keyup", event => {
      switch (event.code) {
        case "ArrowUp": //up
          if (ship.verticalSpeed < 0) ship.StopVertical();
          break;
        case "ArrowLeft": //left
          if (ship.horizontalSpeed < 0) ship.StopHorizontal();
          break;
        case "ArrowDown": //down
          if (ship.verticalSpeed > 0) ship.StopVertical();
          break;
        case "ArrowRight": //right
          if (ship.horizontalSpeed > 0) ship.StopHorizontal();
          break;
        case "KeyW": //up
          if (ship.verticalSpeed < 0) ship.StopVertical();
          break;
        case "KeyA": //left
          if (ship.horizontalSpeed < 0) ship.StopHorizontal();
          break;
        case "KeyS": //down
          if (ship.verticalSpeed > 0) ship.StopVertical();
          break;
        case "KeyD": //right
          if (ship.horizontalSpeed > 0) ship.StopHorizontal();
          break;
        case "Space":
          ship.isFiring = false;
          break;
        default:
      }
    });
  }
}
