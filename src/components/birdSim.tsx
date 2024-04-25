import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BirdSim: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    let isMouseDown = false;


    /**
     * Resizes the board when the screen does
     * @returns 
     */
    const resizeHandler = () => {
        const parentRect = mountRef.current?.parentElement?.getBoundingClientRect();
        if (!parentRect) return;
        rendererRef.current?.setSize(parentRect.width, parentRect.height);
    };

    useEffect(() => {
        // Ensure the component is mounted before proceeding
        if (!mountRef.current) return;

        const aspect = window.innerWidth / window.innerHeight;
        const d = 20;
        const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
        camera.position.z = 100;
        
        // Set camera position
        camera.position.set(0, 0, 10); // Place the camera at z = 10, looking towards the origin (0, 0, 0)

        // Set up the renderer with antialiasing
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current = renderer; // Set the renderer reference

        // Set renderer size to match its parent element
        const parentRect = mountRef.current.parentElement?.getBoundingClientRect();
        if (!parentRect) return;
        renderer.setSize(parentRect.width, parentRect.height);

        // Append the renderer's DOM element to the mountRef's current
        mountRef.current.appendChild(renderer.domElement);

        // Create a scene
        const scene = new THREE.Scene();

        // Create geometry and material for the birds
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xff4500 });

        // Array to hold bird meshes
        const birds: THREE.Mesh[] = [];

        // Function to create birds
        const createBird = () => {
            const bird = new THREE.Mesh(geometry, material);
            bird.position.x = Math.random() * 100 - 50;
            bird.position.y = Math.random() * 100 - 50;
            scene.add(bird);
            birds.push(bird);
        };

        // Create 100 birds
        for (let i = 0; i < 30; i++) {
            console.log('birds made')
            createBird();
        }

        // Handle mouse movements
        const onMouseMove = (event: MouseEvent) => {
            if (!isMouseDown) return
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            const attractor = new THREE.Vector3(mouseX * d * aspect, mouseY * d, 0);
            console.log(attractor)

            // Update bird positions based on mouse location and repulsion forces
            birds.forEach((bird, index) => {
                const direction = attractor.clone().sub(bird.position).multiplyScalar(0.005); // Attraction to mouse

                const separation = new THREE.Vector3();
                let count = 0;

                birds.forEach((other, otherIndex) => {
                    if (index !== otherIndex) {
                        const distance = bird.position.distanceTo(other.position);
                        if (distance < 5) { // Repulsion from other birds
                            const repel = bird.position.clone().sub(other.position).normalize().divideScalar(distance);
                            separation.add(repel);
                            count++;
                        }
                    }
                });

                if (count > 0) {
                    separation.divideScalar(count).multiplyScalar(0.5); // Strength of repulsion
                }

                bird.position.add(separation).add(direction);
            });

            renderer.render(scene, camera); // Render the scene
        };

        document.addEventListener('mousemove', onMouseMove); // Add mousemove event listener
        document.addEventListener('mousedown', () => isMouseDown = true);
        document.addEventListener('mouseup', () => isMouseDown = false);

        // Clean up event listener and dispose renderer on unmount
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mousedown', () => isMouseDown = true);
            document.removeEventListener('mouseup', () => isMouseDown = false);
            renderer.dispose();
        };
    }, []); // Run this effect only once on component mount



    useEffect(() => {
        resizeHandler(); // Initial setup
        window.addEventListener('resize', resizeHandler);
        console.log('new')


        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    return (
        <div ref={mountRef} />
    );
};

export default BirdSim;
