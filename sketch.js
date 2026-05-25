let pos;
let velocityY = 0;
let onGround = true;
let yaw = 0;
let pitch = 0;

const EYE_HEIGHT = -50;
const MOVE_SPEED = 5;
const MOUSE_SENS = 0.0025;
const PITCH_LIMIT = Math.PI / 2 - 0.01;
const GRAVITY = 0.25;
const JUMP_VELOCITY = -6;
const PLAYER_RADIUS = 50;

const obstacles = [
  { x: -300, y: -50, z: -300, size: 100, color: [220,  80,  80] },
  { x:  300, y: -50, z: -300, size: 100, color: [ 80, 220,  80] },
  { x: -300, y: -50, z:  300, size: 100, color: [ 80, 120, 240] },
  { x:  300, y: -50, z:  300, size: 100, color: [240, 200,  60] },
  { x:    0, y: -50, z: -600, size: 100, color: [200,  80, 220] },
];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pos = createVector(0, EYE_HEIGHT, 0);
  noCursor();
}

function draw() {
  background(30);

  updateMovement();
  updateVertical();
  applyCamera();

  drawScene();
}

function updateVertical() {
  velocityY += GRAVITY;
  pos.y += velocityY;

  if (pos.y >= EYE_HEIGHT) {
    pos.y = EYE_HEIGHT;
    velocityY = 0;
    onGround = true;
  }
}

function updateMovement() {
  const forwardX = sin(yaw);
  const forwardZ = -cos(yaw);
  const rightX = cos(yaw);
  const rightZ = sin(yaw);

  let dx = 0, dz = 0;
  if (keyIsDown(87)) { dx += forwardX * MOVE_SPEED; dz += forwardZ * MOVE_SPEED; }
  if (keyIsDown(83)) { dx -= forwardX * MOVE_SPEED; dz -= forwardZ * MOVE_SPEED; }
  if (keyIsDown(68)) { dx += rightX   * MOVE_SPEED; dz += rightZ   * MOVE_SPEED; }
  if (keyIsDown(65)) { dx -= rightX   * MOVE_SPEED; dz -= rightZ   * MOVE_SPEED; }

  pos.x += dx;
  resolveAxisX(dx);
  pos.z += dz;
  resolveAxisZ(dz);
}

function resolveAxisX(dx) {
  if (dx === 0) return;
  for (const o of obstacles) {
    const half = o.size / 2;
    if (pos.y <= o.y - half || pos.y >= o.y + half) continue;
    if (pos.z + PLAYER_RADIUS <= o.z - half || pos.z - PLAYER_RADIUS >= o.z + half) continue;
    if (pos.x + PLAYER_RADIUS <= o.x - half || pos.x - PLAYER_RADIUS >= o.x + half) continue;

    pos.x = dx > 0 ? o.x - half - PLAYER_RADIUS : o.x + half + PLAYER_RADIUS;
  }
}

function resolveAxisZ(dz) {
  if (dz === 0) return;
  for (const o of obstacles) {
    const half = o.size / 2;
    if (pos.y <= o.y - half || pos.y >= o.y + half) continue;
    if (pos.x + PLAYER_RADIUS <= o.x - half || pos.x - PLAYER_RADIUS >= o.x + half) continue;
    if (pos.z + PLAYER_RADIUS <= o.z - half || pos.z - PLAYER_RADIUS >= o.z + half) continue;

    pos.z = dz > 0 ? o.z - half - PLAYER_RADIUS : o.z + half + PLAYER_RADIUS;
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

  for (const o of obstacles) {
    push();
    translate(o.x, o.y, o.z);
    fill(o.color[0], o.color[1], o.color[2]);
    box(o.size);
    pop();
  }
}

function mousePressed() {
  requestPointerLock();
}

function keyPressed() {
  if (keyCode === 32 && onGround) {
    velocityY = JUMP_VELOCITY;
    onGround = false;
  }
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
