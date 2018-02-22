/**
 * onMouseMove
 *
 */
function onMouseMove (event) {
event.preventDefault();

// calculate mouse position in normalized device coordinates
// (-1 to +1) for both components

// NOTE: (-1,-1) - lower left corner. (1,1) - upper right corner
mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

/**
 * onWindowResize
 *
 */
function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseDown (event) {
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  // (Intersections are returned sorted by distance, closest first)
  var intersects = raycaster.intersectObjects(scene.children);

  // Leave only 'mainSphere'
  var i = intersects.length;
  while (i--) {
    if (intersects[i].object.name !== 'mainSphere') {
      intersects.splice(i, 1);
    }
  }

  if (intersects.length > 0) {
    // console.log('World point: ', intersects[0].point);
    console.log('UV point coordinates: ', intersects[0].uv);

    // Use our custom function to calculate the equirectangular projection
    var u,v;

    var x = intersects[0].point.x;
    var y = intersects[0].point.y;
    var z = intersects[0].point.z;

    var sphericalCoords = cartesianToSpherical(x, y, z);
    var theta = sphericalCoords.theta;
    var phi = sphericalCoords.phi;

    // console.log('theta: ', theta);
    // console.log('phi: ', phi);

    if (theta > -Math.PI && theta <= Math.PI/2) {
      u = (-theta)/(2*Math.PI) + 1/4;
    } else if (theta > Math.PI/2 && theta <= 2*Math.PI) {
      u = (-theta)/(2*Math.PI) + 5/4;
    }

    v = (-phi/Math.PI) + 1;

    console.log('Calculated UV projection coordinates: ', {u: u, v: v});

    console.log('Spherical coordinates from click: ', {theta: theta, phi: phi});
    console.log('UV to spherical coordinates: ', uvToSpherical(u, v));
  }
}

function uvToSpherical(u, v) {
  var theta, phi;

  if (u >= 0 && u < 3/4) {
    theta = -2*Math.PI*u + Math.PI/2;
  } else if (u >= 3/4 && u < 1) {
    theta = -2*Math.PI*u + Math.PI*5/2;
  }

  phi = -Math.PI*v + Math.PI;

  return {theta: theta, phi: phi};
}
