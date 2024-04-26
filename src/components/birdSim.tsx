import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { MapControls, OrthographicCamera, PerspectiveCamera, Box, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import createBirdGeometry from './birdGeometry';

interface Bird {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    family: number;
}

export interface BoidRule {
    replusionDistance: number;
    replusionStrength: number;

    alignmentDistance: number;
    alignmentStrength: number;

    attractionDistance: number;
    attractionStrength: number;
}

function BirdSim({
    boundsRef,
    cameraRef,
    controlsRef,
    boidRatiosRef,
    birdsCountRef,
    fps = 30,
    setFps,
    birdVelocity = 20,
    birdSize = 1,
}: {
    boundsRef: any,
    cameraRef: any,
    controlsRef: any,
    boidRatiosRef: any,
    birdsCountRef: any,
    fps: number,
    setFps: (value: number) => void,
    birdVelocity: number,
    birdSize: number,
}) {

    let framecounter = 0;

    const clipTeleport = false;

    const birdInstances = useRef<Bird[]>([]);
    const birdMeshRef = useRef<THREE.InstancedMesh>(null);

    const geomtery = useMemo(() => { return createBirdGeometry(birdSize) }, [birdSize]);
    const material = useMemo(() => { return new THREE.MeshBasicMaterial({ color: 0xff0000 }); }, []);

    const velocityScalar = () => { return 20 * birdVelocity / fps };



    function getMatrixFromVector(pos: THREE.Vector3, vel: THREE.Vector3): THREE.Matrix4 {
        // Create translation matrix to position the object at 'pos'
        const translationMatrix = new THREE.Matrix4().setPosition(pos);
        const angle = Math.atan2(vel.x, vel.y);
        const rotationMatrix = new THREE.Matrix4().makeRotationZ(-angle);
        return new THREE.Matrix4().multiplyMatrices(translationMatrix, rotationMatrix);
    }

    function clipPosition(bird: Bird): void {
        const { position, velocity } = bird;

        if (!clipTeleport) {

            // Clip position if it's out of bounds
            if (Math.abs(position.x) >= boundsRef.current.boundX - birdSize) {
                position.x = THREE.MathUtils.clamp(position.x, -boundsRef.current.boundX, boundsRef.current.boundX); // Clamp position to stay within bounds
                velocity.x *= -1; // Reverse velocity to point back into bounds
            }
            if (Math.abs(position.y) >= boundsRef.current.boundY - birdSize) {
                position.y = THREE.MathUtils.clamp(position.y, -boundsRef.current.boundY, boundsRef.current.boundY); // Clamp position to stay within bounds
                velocity.y *= -1;
            }
            if (Math.abs(position.z) >= boundsRef.current.boundZ - birdSize) {
                position.z = THREE.MathUtils.clamp(position.z, -boundsRef.current.boundZ, boundsRef.current.boundZ); // Clamp position to stay within bounds
                velocity.z *= -1;
            }
        }

        else {
            // Teleport position if it's out of bounds
            if (Math.abs(position.x) >= boundsRef.current.boundX - birdSize) {
                position.x = position.x < 0 ? boundsRef.current.boundX - birdSize : -boundsRef.current.boundX + birdSize;
            }
            if (Math.abs(position.y) >= boundsRef.current.boundY - birdSize) {
                position.y = position.y < 0 ? boundsRef.current.boundY - birdSize : -boundsRef.current.boundY + birdSize;
            }
            if (Math.abs(position.z) >= boundsRef.current.boundZ - birdSize) {
                position.z = position.z < 0 ? boundsRef.current.boundZ - birdSize : -boundsRef.current.boundZ + birdSize;
            }
        }
    }

    const updateBirds = () => {
        const skipChance = 0.8

        const birdsCount = Math.min(birdsCountRef.current, birdInstances.current.length);

        if (birdMeshRef.current) {
            for (let i = 0; i < birdsCount; i++) {
                const bird = birdInstances.current[i];
                let replusion = new THREE.Vector3();
                let alignment = new THREE.Vector3();
                let attraction = new THREE.Vector3();

                // const velocity = new THREE.Vector3(
                //     0.02 * (Math.random() - 0.5),
                //     0.02 * (Math.random() - 0.5),
                //     0
                // )

                // bird.velocity.add(velocity)


                if (isNaN(bird.position.x) || isNaN(bird.position.y) || isNaN(bird.position.z)) {
                    console.log(i, bird, birdsCountRef.current, birdInstances.current.length)
                    throw new Error('RIP')
                }

                for (let j = 0; j < birdsCount; j++) {
                    if (i === j || Math.random() < skipChance) continue;
                    const neighbor = birdInstances.current[j];

                    const vectorToNeighbor = neighbor.position.clone().sub(bird.position);
                    const distanceLength = vectorToNeighbor.length();
                    vectorToNeighbor.normalize()

                    // Replusion: Birds try to maintain a minimum distance from each other
                    if (distanceLength < boidRatiosRef.current.replusionDistance) {
                        replusion.sub(vectorToNeighbor)
                    }

                    // Alignment: Birds try to align their velocities with neighboring birds
                    if (distanceLength < boidRatiosRef.current.alignmentDistance) {
                        alignment.add(neighbor.velocity.clone().normalize());
                    }

                    // Attraction: Birds try to move towards the center of mass of neighboring birds
                    if (distanceLength < boidRatiosRef.current.attractionDistance) {
                        attraction.add(vectorToNeighbor);
                    }
                }
                replusion.normalize().multiplyScalar(boidRatiosRef.current.replusionStrength)

                // Apply alignment rule
                alignment.divideScalar(birdsCount - 1).sub(bird.velocity).normalize().multiplyScalar(boidRatiosRef.current.alignmentStrength);

                // // Apply attraction rule
                attraction.divideScalar(birdsCount - 1).sub(bird.position).normalize().multiplyScalar(boidRatiosRef.current.attractionStrength);

                // console.log(attraction, boidRatiosRef.current.replusionStrength)
                // Update velocity based on rules
                bird.velocity.add(replusion).add(alignment).add(attraction).normalize().multiplyScalar(velocityScalar());
                bird.position.add(bird.velocity);

                clipPosition(bird);

                birdMeshRef.current.setMatrixAt(i, getMatrixFromVector(bird.position, bird.velocity));
            }


            //Very important this stays this way, doesnt update otherwise
            birdMeshRef.current.instanceMatrix.needsUpdate = true;
            // console.log(birdInstances.current[0])
        }
        // console.log('f', birdInstances.current[0].velocity)
        framecounter += 1;
    }

    useEffect(() => {
        if (birdMeshRef.current) {
            const prevLength = birdInstances.current.length;
            if(prevLength >= birdsCountRef.current){
                birdInstances.current = birdInstances.current.slice(0,birdsCountRef.current);
                updateBirds();
                return;
            }

            for (let i = 0; i < birdsCountRef.current; i++) {
                if (i >= prevLength) {
                    const pos = new THREE.Vector3(Math.random(), Math.random(), 0);
                    const bird: Bird = {
                        position: pos,
                        velocity: new THREE.Vector3(Math.random(), Math.random(), 0).normalize().multiplyScalar(velocityScalar()),
                        family: 0
                    }

                    const matrix = getMatrixFromVector(bird.position, bird.velocity);
                    birdInstances.current.push(bird);
                    birdMeshRef.current.setMatrixAt(i, matrix);
                }   
                birdMeshRef.current.setColorAt(i, new THREE.Color('red'));
            }
            
            birdMeshRef.current.instanceMatrix.needsUpdate = true;
        }

    }, [birdsCountRef.current])


    // useFrame(() => {
    //     if (birdMeshRef.current)
    //         birdMeshRef.current.geometry.attributes.position.needsUpdate = true;
    //     // console.log('fr')
    // })

    // useEffect(() => {
    //     const intervalId = setInterval(updateBirds, 1000 / fps);
    //     // updateBirds();
    //     return () => clearInterval(intervalId); // Cleanup function to clear the interval when the component unmounts or the dependency array changes
    // }, [fps]);

    useFrame(() => {
        updateBirds();
    })

    function countframes() {
        const ratio = 0.6
        // console.log(framecounter)
        setFps(ratio * fps + (1 - ratio) * (2 * framecounter));
        framecounter = 0
    }
    useEffect(() => {
        framecounter = 0
        setTimeout(() => {
            countframes();
        }, 500);
    }, [fps]);

    return (
        <>
            <PerspectiveCamera
                makeDefault
                ref={cameraRef}
                position={[0, 0, 825]}
            />
            <OrbitControls

                ref={controlsRef}
                camera={cameraRef.current}

                position0={new THREE.Vector3(0,0,825)}
                zoom0={1}

                enableDamping={false}
                dampingFactor={0.05}


                enablePan={true}
                enableRotate={false}
                enableZoom={true}

                minDistance={70}
                maxDistance={825}

                panSpeed={1}
                
                zoomToCursor={true}
                zoomSpeed={1}

                screenSpacePanning={true}
                // minZoom={1}
                // maxZoom={50}
            />
            <instancedMesh
                ref={birdMeshRef}
                args={[geomtery, material, birdsCountRef.current]}
                frustumCulled={false}
            />

        </>
    );
}

export default React.memo(BirdSim);