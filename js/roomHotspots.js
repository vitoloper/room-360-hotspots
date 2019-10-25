var container;
var camera, scene, renderer;
var controls;

var mouse;
var raycaster;
var INTERSECTED;

var circle1, circle2, circle3;

var texture;


/********************************************************/


// Recursively traverse through the model.
var traversePolygonsForGeometries = function (node, uvx, uvy) {
  if (node.geometry) {
      // Return a list of triangles that have the point within them.
      // The returned objects will have the x,y,z barycentric coordinates of the point inside the respective triangle
      // TODO: bug here (baryData is null for uvx= 0 uvy=0)
      var baryData = annotationTest(uvx, uvy, node.geometry.faceVertexUvs);
      if (baryData.length) {
          for (var j = 0; j < baryData.length; j++) {
              // Find the vertices corresponding to the triangle in the model
              var vertexa = node.geometry.vertices[node.geometry.faces[baryData[j][0]].a];
              var vertexb = node.geometry.vertices[node.geometry.faces[baryData[j][0]].b];
              var vertexc = node.geometry.vertices[node.geometry.faces[baryData[j][0]].c];
              // Sum the barycentric coordinates and apply to the vertices to get the coordinate in local space
              var worldX = vertexa.x * baryData[j][1] + vertexb.x * baryData[j][2] + vertexc.x * baryData[j][3];
              var worldY = vertexa.y * baryData[j][1] + vertexb.y * baryData[j][2] + vertexc.y * baryData[j][3];
              var worldZ = vertexa.z * baryData[j][1] + vertexb.z * baryData[j][2] + vertexc.z * baryData[j][3];
              var vector = new THREE.Vector3(worldX, worldY, worldZ);
              // Translate to world space
              var worldVector = vector.applyMatrix4(node.matrixWorld);
              return worldVector;              
          }
      }
  }

  if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
          var worldVectorPoint = traversePolygonsForGeometries(node.children[i], uvx, uvy);
          if (worldVectorPoint) return worldVectorPoint;
      }
  }
  };
  
  // Loops through each face vertex UV item and tests if it is within the triangle.
  function annotationTest(uvX, uvY, faceVertexUvArray) {
      var point = {};
      point.x = uvX;
      point.y = uvY;
      var results = [];
      for (i = 0; i < faceVertexUvArray[0].length; i++) {
          var result = ptInTriangle(point, faceVertexUvArray[0][i][0], faceVertexUvArray[0][i][1], faceVertexUvArray[0][i][2]);
          if (result.length) {
              results.push([i, result[0], result[1], result[2]]);
          }
      }
      return results;
  };
  
  // This is a standard barycentric coordinate function.
  function ptInTriangle(p, p0, p1, p2) {
      var x0 = p.x;
      var y0 = p.y;
      
      var x1 = p0.x;
      var y1 = p0.y;
      var x2 = p1.x;
      var y2 = p1.y;
      var x3 = p2.x;
      var y3 = p2.y;
  
      var b0 = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)
      var b1 = ((x2 - x0) * (y3 - y0) - (x3 - x0) * (y2 - y0)) / b0
      var b2 = ((x3 - x0) * (y1 - y0) - (x1 - x0) * (y3 - y0)) / b0
      var b3 = ((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) / b0
  
      if (b1 > 0 && b2 > 0 && b3 > 0) {
        console.log(b1, b2, b3);
          return [b1, b2, b3];
      } else {
          return [];
      }
  };



/********************************************************/



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
  var sceneSphere = mainSphere(radius, texture);
  scene.add(sceneSphere);

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

  // Circle hotspot
  var circleRadius = 1;
  var circleShape = new THREE.Shape();
  circleShape.moveTo( 0, circleRadius );
  circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
  circleShape.quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius );
  circleShape.quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 );
  circleShape.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );
  circle1 = createHotspot(circleShape, null, 0xff0000, 0, 0, 0, 0, 0, 0, radius/20);
  circle1.position.setFromSpherical(new THREE.Spherical(radius / 1.01, Math.PI/1.7, -Math.PI*(5/6)));
  circle1.lookAt(0, 0, 0);
  circle1.userData.HTMLDescription = 'Computer';
  // circle1.userData.infoWindowWidth = 200;
  // circle1.userData.infoWindowHeight = 500;
  scene.add(circle1);

  circle2 = createHotspot(circleShape, null, 0xff0000, 0, 0, 0, 0, 0, 0, radius/20);
  circle2.position.setFromSpherical(new THREE.Spherical(radius / 1.01, Math.PI/1.9, Math.PI/4.8));
  circle2.lookAt(0, 0, 0);
  circle2.userData.HTMLDescription = 'Lamp';
  // circle1.userData.infoWindowWidth = 200;
  // circle1.userData.infoWindowHeight = 500;
  scene.add(circle2);

  circle3 = createHotspot(circleShape, null, 0xff0000, 0, 0, 0, 0, 0, 0, radius/20);
  circle3.position.setFromSpherical(new THREE.Spherical(radius / 1.01, Math.PI/1.6, Math.PI*(3/2)));
  circle3.lookAt(0, 0, 0);
  circle3.userData.HTMLDescription = 'Chair';
  // circle1.userData.infoWindowWidth = 200;
  // circle1.userData.infoWindowHeight = 500;
  scene.add(circle3);
  
  raycaster = new THREE.Raycaster();
  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);

  /**
   * Experiment here: from x y coordinates on executiveroom.jpg to 3d world coordinates.
   * 
   */

  // Original image size
  var textureSize = {width: 2464, height: 1232};
  
  // Now, suppose we have a point in x-y coordinates on the image (it's in the center of the pillow on the bed)
  var imgPoint = {x: 561, y: 709};

  // Get UV coordinates (NOTE: there is a flip on the y coordinates!)
  var imgPointUV = {u: imgPoint.x/textureSize.width, v: Math.abs(imgPoint.y/textureSize.height - 1)};
  console.log('Image point UV coordinates: ', imgPointUV);

  // var worldCoordsPoint = traversePolygonsForGeometries(sceneSphere, 0, 0);
  var worldCoordsPoint = traversePolygonsForGeometries(sceneSphere, imgPointUV.u, imgPointUV.v);
  console.log('world coordinates point: ', worldCoordsPoint);

  circleP = createHotspot(circleShape, null, 0xff0000, worldCoordsPoint.x, worldCoordsPoint.y, worldCoordsPoint.z, 0, 0, 0, radius/20);
  circleP.lookAt(0, 0, 0);
  circleP.userData.HTMLDescription = 'From UV coords';
  scene.add(circleP);

} // init ()


function animate () {
  requestAnimationFrame(animate);
  render();

  controls.update();
}

function render () {
  camera.updateMatrixWorld();

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  // (Intersections are returned sorted by distance, closest first)
  var intersects = raycaster.intersectObjects(scene.children);

  // Leave only hotspots and remove any other kind of object intersected
  var i = intersects.length;
  while (i--) {
    if (intersects[i].object.userData.kind !== 'hotspot') {
      intersects.splice(i, 1);
    }
  }

  if (intersects.length > 0) {
    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED) {
        INTERSECTED.material.transparent = true;
        INTERSECTED.material.opacity = 0.6;
      }

      var infowindow = document.getElementById('infowindow');
      infowindow.style.width = intersects[0].object.userData.infoWindowWidth + 'px' || '100px';
      infowindow.style.height = intersects[0].object.userData.infoWindowHeight + 'px' || '25px';
      camera.updateMatrixWorld();
      var proj = createVector(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z, camera, window.innerWidth, window.innerHeight);
      infowindow.style.left = proj.x + 'px';
      infowindow.style.top = proj.y + 'px';

      // right side overflow
      if ((proj.x + infowindow.offsetWidth) > window.innerWidth) {
        proj.x = window.innerWidth - infowindow.offsetWidth;
        proj.x -= 5;
        infowindow.style.left = proj.x + 'px';
      }

      // left side overflow
      if (proj.x < 0) {
        proj.x = 0;
        proj.x += 5;
        infowindow.style.left = proj.x + 'px';
      }

      // bottom overflow
      if ((proj.y + infowindow.offsetHeight) > window.innerHeight) {
        proj.y = window.innerHeight - infowindow.offsetHeight;
        proj.y -= 5;
        infowindow.style.top = proj.y + 'px';
      }

      // top overflow
      if (proj.y < 0) {
        proj.y = 0;
        proj.y += 5;
        infowindow.style.top = proj.y + 'px';
      }

      infowindow.innerHTML = intersects[0].object.userData.HTMLDescription;
      infowindow.style.visibility = 'visible';

      INTERSECTED = intersects[0].object;
      INTERSECTED.material.transparent = false;
      INTERSECTED.material.opacity = 1;
    }
  } else {
    if (INTERSECTED) {
      INTERSECTED.material.transparent = true;
      INTERSECTED.material.opacity = 0.6;
    }
    var infowindow = document.getElementById('infowindow');
    infowindow.innerHTML = 'Description';
    infowindow.style.visibility = 'hidden';
    INTERSECTED = null;
  }

  renderer.render(scene, camera);
}

function createHotspot( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
	// note: default UVs generated by ShapeBufferGeometry are simply the x- and y-coordinates of the vertices

  // flat shape
	var geometry = new THREE.ShapeBufferGeometry( shape );
	var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ) );
  mesh.material.transparent = true;
  mesh.material.opacity = 0.6;
	mesh.position.set( x, y, z);
	mesh.rotation.set( rx, ry, rz );
	mesh.scale.set( s, s, s );
  mesh.userData.kind = 'hotspot';
  return mesh;
}
