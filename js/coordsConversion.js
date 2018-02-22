/**
 * Spherical to cartesian coordinates conversion (THREE.js axis convention).
 * NOTE: THREE.js also provides a setFromSpherical method to set the position of an object.
 */
function sphericalToCartesian(radius, phi, theta) {
  var x = radius*Math.sin(theta)*Math.sin(phi);
  var y = radius*Math.cos(phi);
  var z = radius*Math.cos(theta)*Math.sin(phi);

  // console.log(x, y, z);
  return {x:x, y:y, z:z};
}

/**
 * Cartesian to spherical coordinates conversion (THREE.js axis convention).
 *
 */
function cartesianToSpherical(x, y, z) {
  var radius = Math.sqrt(x*x + y*y + z*z);
  var phi = Math.acos(y / radius);
  var theta = Math.atan2(x, z);

  return {radius: radius, phi: phi, theta: theta};
}

/**
 * Get 2D screen coordinates from 3D scene coordinates.
 *
 */
function createVector(x, y, z, camera, width, height) {
    var p = new THREE.Vector3(x, y, z);
    var vector = p.project(camera);

    vector.x = (vector.x + 1) / 2 * width;
    vector.y = -(vector.y - 1) / 2 * height;

    return vector;
}
