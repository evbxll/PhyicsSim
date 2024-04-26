import * as THREE from 'three';

// Function to create a bird mesh
function createBirdGeometry(birdSize: number) {


  // Define the shape of the bird
  const birdShape = new THREE.Shape();

  const d = 0.2;
  const tailX = 0.4

  // Define the silhouette of the bird
  birdShape.moveTo(0, 1-d);          // Tail start
  birdShape.lineTo(-tailX, -0.5-d);           // Curve start
  birdShape.quadraticCurveTo(0, 0.3-d, tailX, -0.5-d);  // Curve
  birdShape.lineTo(0, 1-d);  

  return new THREE.ShapeGeometry(birdShape).scale(birdSize, birdSize, birdSize);
}

export default createBirdGeometry;