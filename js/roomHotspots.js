var container;
var camera, scene, renderer;
var controls;

var mouse;

var texture;

init();
animate();

function init () {
  container = document.createElement('div');
  document.body.appendChild(container);

  var radius = 512;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  controls = new THREE.OrbitControls(camera);
  mouse = new THREE.Vector2();
  texture = new THREE.TextureLoader().load('img/executiveroom.jpg');
  texture.minFilter = THREE.LinearFilter;

  // Mouse coordinates setup (NDC - normalized device coordinates)
  // Lower left corner

  mouse.x = -1;
  mouse.y = -1;

  // Camera setup

  camera.position.z = 4.5;
  controls.update();

  // Axes helper

  // var axesHelper = new THREE.AxesHelper(1);
  // scene.add(axesHelper);

  // Main sphere setup (radius, texture)
  scene.add(mainSphere(radius, texture));

  // THREE.js
  // Spherical( radius, phi, theta )
  // radius - the radius, or the Euclidean distance (straight-line distance) from the point to the origin. Default is 1.0.
  // phi - polar angle from the y (up) axis. Default is 0.
  // theta - equator angle around the y (up) axis. Default is 0.
  //
  // The poles (phi) are at the positive and negative y axis. The equator (theta) starts at positive z.

  // NOTE:
  // radius - distance from the origin
  // phi - polar angle (from the positive y-axis)
  // theta - azimuthal angle (z-x plane)
  
  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
} // init ()

function animate () {
  requestAnimationFrame(animate);
  render();

  controls.update();
}

function render () {
  camera.updateMatrixWorld();
  renderer.render(scene, camera);
}
