import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { MapControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function BirdSim() {
    const birdInstances = useRef<THREE.Matrix4[]>([]);
    const birdMeshRef = useRef<THREE.InstancedMesh>(null);
    const { camera } = useThree();
    const boundingBox = useRef<THREE.Box3>(new THREE.Box3());

    useEffect(() => {
        const count = 5; // Number of birds
        const range = 25; // Range within which birds are positioned

        for (let i = 0; i < count; i++) {
            const matrix = new THREE.Matrix4();
            matrix.setPosition(
                Math.random() * range * 2 - range, // Random x position within range
                Math.random() * range * 2 - range, // Random y position within range
                Math.random() * range * 2 - range  // Random z position within range
            );
            birdInstances.current.push(matrix);
        }
    }, []);

    useFrame(() => {
        if (birdMeshRef.current) {
            birdMeshRef.current.instanceMatrix.needsUpdate = true;
        }
        birdInstances.current.forEach((matrix, index) => {
            const position = new THREE.Vector3();
            matrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3());
            position.addScaledVector(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5), 0.2);
            matrix.setPosition(position.x, position.y, position.z);
        });

        // Recalculate bounding box based on bird positions
        boundingBox.current.makeEmpty(); // Reset bounding box
        birdInstances.current.forEach((matrix) => {
            const position = new THREE.Vector3();
            matrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3());
            boundingBox.current.expandByPoint(position); // Expand bounding box to include bird position
        });

        // Calculate camera position based on bounding box
        const center = new THREE.Vector3();
        boundingBox.current.getCenter(center);
        const size = new THREE.Vector3();
        boundingBox.current.getSize(size);
        const distance = Math.max(size.x, size.y, size.z) * 2; // Increase distance to ensure all birds are visible
        camera.position.set(center.x, center.y + distance, center.z); // Set camera to overhead view
        camera.lookAt(center.x, center.y, center.z); // Look at the center of the bounding box
    });

    return (
        <>
            <OrthographicCamera makeDefault position={[0, 0, 100]} zoom={10} />
            <instancedMesh ref={birdMeshRef}>
                <sphereBufferGeometry args={[60, 16, 16]} />
                <meshBasicMaterial color="red" />
            </instancedMesh>
        </>
    );
}

export default BirdSim;
