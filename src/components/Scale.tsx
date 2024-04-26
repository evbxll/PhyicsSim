
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ScaleProps {
    unitLength: number;
    cameraRef: any;
}

const Scale = ({ unitLength, cameraRef }: ScaleProps) => {

    useEffect(() => {
        if (!cameraRef.current) return;

        // Create a sphere mesh
        const sphereMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshBasicMaterial()
        );

        // Add the sphere mesh to the camera's children
        cameraRef.current.add(sphereMesh);

        // Set the position of the sphere mesh
        sphereMesh.position.copy(cameraRef.current.position)
        sphereMesh.translateZ( - 100 );

        // Clean up function to remove the sphere mesh when unmounting
        return () => cameraRef.current.remove(sphereMesh);
    }, [cameraRef]);

    return (<mesh />)
};

export default Scale;

