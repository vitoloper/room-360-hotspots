/**
 * Main sphere setup
 *
 */
 function mainSphere (radius, texture) {
   var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
   // inversion (outer faces point inward)
   sphereGeometry.scale(-1, 1, 1);
   // 'THREE.ClampToEdgeWrapping' is the default texture UV wrapping.
   var sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
   // sphereMaterial.wireframe = true;
   var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
   sphere.name = 'mainSphere';
   return sphere;
 }
