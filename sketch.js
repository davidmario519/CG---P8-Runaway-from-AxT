let pos;
let yaw = 0;
let pitch = 0;

const EYE_HEIGHT = -50;
const MOVE_SPEED = 5;
const MOUSE_SENS = 0.0025;
const PITCH_LIMIT = Math.PI / 2 - 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pos = createVector(0, EYE_HEIGHT, 0);
  noCursor();
}

function draw() {
  background(30);

  updateMovement();
  applyCamera();

  drawScene();
}

function updateMovement() {
  const forwardX = sin(yaw);
  const forwardZ = -cos(yaw);
  const rightX = cos(yaw);
  const rightZ = sin(yaw);

  if (keyIsDown(87)) { // W
    pos.x += forwardX * MOVE_SPEED;
    pos.z += forwardZ * MOVE_SPEED;
  }
  if (keyIsDown(83)) { // S
    pos.x -= forwardX * MOVE_SPEED;
    pos.z -= forwardZ * MOVE_SPEED;
  }
  if (keyIsDown(68)) { // D
    pos.x += rightX * MOVE_SPEED;
    pos.z += rightZ * MOVE_SPEED;
  }
  if (keyIsDown(65)) { // A
    pos.x -= rightX * MOVE_SPEED;
    pos.z -= rightZ * MOVE_SPEED;
  }
}

function applyCamera() {
  const fx = cos(pitch) * sin(yaw);
  const fy = -sin(pitch);
  const fz = -cos(pitch) * cos(yaw);

  camera(
    pos.x, pos.y, pos.z,
    pos.x + fx, pos.y + fy, pos.z + fz,
    0, 1, 0
  );
}

function drawScene() {
  push();
  noStroke();
  fill(80);
  translate(0, 0, 0);
  rotateX(HALF_PI);
  plane(4000, 4000);
  pop();

  const positions = [
    [-300, -50, -300, color(220, 80, 80)],
    [ 300, -50, -300, color(80, 220, 80)],
    [-300, -50,  300, color(80, 120, 240)],
    [ 300, -50,  300, color(240, 200, 60)],
    [   0, -50, -600, color(200, 80, 220)],
  ];
  for (const [x, y, z, c] of positions) {
    push();
    translate(x, y, z);
    fill(c);
    box(100);
    pop();
  }
}

function mousePressed() {
  requestPointerLock();
}

function mouseMoved(e) {
  if (document.pointerLockElement !== null) {
    yaw += e.movementX * MOUSE_SENS;
    pitch -= e.movementY * MOUSE_SENS;
    pitch = constrain(pitch, -PITCH_LIMIT, PITCH_LIMIT);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
