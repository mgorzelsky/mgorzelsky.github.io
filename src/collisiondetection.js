//Take in the two objects that are having their collision checked. The collidingObject is the object CALLING the function,
//the gameObject is the object being checked against for collision.
export function DetectCollision(collidingObject, gameObject) {
  let leftX = collidingObject.position.x;
  let rightX = collidingObject.position.x + collidingObject.width;
  let topY = collidingObject.position.y;
  let bottomY = collidingObject.position.y + collidingObject.height;

  //If the collision is between the same type of object that created the projectile, discard it.
  if (collidingObject.ID === gameObject.ID) {
    return false;
  }
  //Check each corner of the collidingObject to see if it is within the gameObject. If it is, return true to indicate a
  //collision has happened. 
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
