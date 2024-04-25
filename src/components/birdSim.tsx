import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BirdSim = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Define scene dimensions and camera
        const aspect = window.innerWidth / window.innerHeight;
        const d = 20;
        const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
        camera.position.z = 10;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Scene setup
        const scene = new THREE.Scene();
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xff4500 });
        const birds: THREE.Mesh[] = [];

        // Create birds
        for (let i = 0; i < 100; i++) {
            const bird = new THREE.Mesh(geometry, material);
            bird.position.x = Math.random() * 100 - 50;
            bird.position.y = Math.random() * 100 - 50;
            scene.add(bird);
            birds.push(bird);
        }

        // Handle mouse movements
        const mouse = new THREE.Vector2();
        const onMouseMove = (event: any) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        document.addEventListener('mousemove', onMouseMove, false);

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
      
          // Update bird positions based on mouse location and repulsion forces
          const attractor = new THREE.Vector3(mouse.x * d * aspect, mouse.y * d, 0);
          birds.forEach((bird, index) => {
              // Attraction to mouse
              const direction = attractor.clone().sub(bird.position);
              direction.multiplyScalar(0.05); // Control the speed of attraction
      
              // Repulsion from other birds
              const separation = new THREE.Vector3();
              let count = 0;
              birds.forEach((other, otherIndex) => {
                  if (index !== otherIndex) {
                      const distance = bird.position.distanceTo(other.position);
                      if (distance < 5) { // Set the minimum distance for repulsion
                          const repel = bird.position.clone().sub(other.position);
                          repel.normalize();
                          repel.divideScalar(distance);
                          separation.add(repel);
                          count++;
                      }
                  }
              });
      
              if (count > 0) {
                  separation.divideScalar(count);
                  separation.multiplyScalar(0.1); // Control the strength of repulsion
              }
      
              bird.position.add(separation);
              bird.position.add(direction);
          });
      
          renderer.render(scene, camera);
      };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}></div>;
};

export default BirdSim;
