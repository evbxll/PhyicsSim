import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BirdSim: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    let birdInstances: THREE.Matrix4[] = [];

    useEffect(() => {
        if (!mountRef.current) return;

        const aspect = window.innerWidth / window.innerHeight;
        const d = 20;
        const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
        camera.position.z = 1;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current = renderer;

        const parentRect = mountRef.current.parentElement?.getBoundingClientRect();
        if (!parentRect) return;
        renderer.setSize(parentRect.width, parentRect.height);
        mountRef.current.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xff4500 });

        const instancedGeometry = new THREE.InstancedBufferGeometry().copy(geometry);

        const count = 5; // Number of birds
        instancedGeometry.instanceCount = count;

        const birdMesh = new THREE.InstancedMesh(instancedGeometry, material, count);
        birdMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        const range = 50;
        for (let i = 0; i < count; i++) {
            const matrix = new THREE.Matrix4();
            matrix.setPosition(
                Math.random() * range - range / 2,
                Math.random() * range - range / 2,
                Math.random() * range - range / 2
            );
            birdMesh.setMatrixAt(i, matrix);
            birdInstances.push(matrix);
        }

        scene.add(birdMesh);

        // Function to update bird positions randomly
        const updateBirdPositions = () => {
            birdInstances.forEach((matrix, index) => {
                const position = new THREE.Vector3();
                matrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3());
                position.addScaledVector(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5), 0.2);
                matrix.setPosition(position.x, position.y, position.z);
                birdMesh.setMatrixAt(index, matrix);
            });
            birdMesh.instanceMatrix.needsUpdate = true; // Update the instance matrix
            renderer.render(scene, cameraRef.current!);
            requestAnimationFrame(updateBirdPositions);
        };

        // Start updating bird positions
        updateBirdPositions();

        return () => {
            renderer.dispose();
        };
    }, []);

    const resizeHandler = () => {
        const parentRect = mountRef.current?.parentElement?.getBoundingClientRect();
        if (!parentRect) return;
        rendererRef.current?.setSize(parentRect.width, parentRect.height);
    };

    useEffect(() => {
        resizeHandler();
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    return (
        <div ref={mountRef} />
    );
};

export default BirdSim;
