export function DetectCollision(projectile, gameObject) {
  let leftX = projectile.position.x;
  let rightX = projectile.position.x + projectile.size;
  let topY = projectile.position.y;
  let bottomY = projectile.position.y + projectile.size;

  if (
    CheckWithinObject(leftX, topY, gameObject) ||
    CheckWithinObject(leftX, bottomY, gameObject) ||
    CheckWithinObject(rightX, topY, gameObject) ||
    CheckWithinObject(rightX, bottomY, gameObject)
  ) {
    return true;
  } else {
    return false;
  }
}

function CheckWithinObject(pointX, pointY, gameObject) {
  let topOfObject = gameObject.position.y;
  let bottomOfObject = gameObject.position.y + gameObject.height;
  let leftSideOfObject = gameObject.position.x;
  let rightSideOfObject = gameObject.position.x + gameObject.width;

  if (
    pointY >= topOfObject &&
    pointY <= bottomOfObject &&
    pointX >= leftSideOfObject &&
    pointX <= rightSideOfObject
  ) {
    return true;
  } else {
    return false;
  }
}
