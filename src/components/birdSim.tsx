import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { MapControls, OrthographicCamera, PerspectiveCamera, Box } from "@react-three/drei";
import * as THREE from "three";
import createBirdGeometry from './birdGeometry';

interface Bird {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    family: number;
}

function BirdSim({
    boundsRef,
    cameraRef,
    controlsRef,
    fps = 30,
    birdVelocity = 20,
    birdSize = 1,
    birdsCount = 100
}: {
    boundsRef: any,
    cameraRef: any,
    controlsRef: any,
    fps: number,
    birdVelocity: number,
    birdSize: number,
    birdsCount: number
}) {


    let framecounter = 0;

    const birdInstances = useRef<Bird[]>([]);
    const birdMeshRef = useRef<THREE.InstancedMesh>(null);

    const geomtery = useMemo(() => {return createBirdGeometry(birdSize)}, [birdSize]);
    const material = useMemo(() => {return new THREE.MeshBasicMaterial({ color: 0xff0000 });}, []);

    const velocityScalarRef = useRef(20 * birdVelocity / fps)

    const velocityScalar: number = useMemo(() => {
        const newVelocityScalar = 20 * birdVelocity / fps;
        velocityScalarRef.current = newVelocityScalar;
        console.log(birdVelocity, fps, newVelocityScalar)
        return newVelocityScalar;
    }, [fps, birdVelocity])



    function getMatrixFromVector(pos: THREE.Vector3, vel: THREE.Vector3): THREE.Matrix4 {

        const translationMatrix = new THREE.Matrix4().setPosition(pos);
        const angle = vel.angleTo(new THREE.Vector3(0,1,0))

        // Combine the rotation and translation matrices to create the final transformation matrix
        return new THREE.Matrix4().makeRotationZ(angle).copyPosition(translationMatrix);
    }

    function clipPosition(bird: Bird): void {
        const { position, velocity } = bird;

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


    useEffect(() => {
        if (birdMeshRef.current) {

            for (let i = 0; i < birdsCount; i++) {
                const pos = new THREE.Vector3(Math.random(), Math.random(), 0);
                const bird: Bird = {
                    position: pos,
                    velocity: new THREE.Vector3(Math.random(), Math.random(), 0).normalize().multiplyScalar(velocityScalarRef.current),
                    family: 0
                }

                const matrix = getMatrixFromVector(bird.position, bird.velocity);
                birdInstances.current.push(bird);
                birdMeshRef.current.setMatrixAt(i, matrix);
                birdMeshRef.current.setColorAt(i, new THREE.Color('red'));
            }
            birdMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, []);

    const updateBirds = () => {
        framecounter += 1;
        const separationDistance = 10;
        const attractionDistance = 1000;
        const cohesionDistance = 1000;
        const seperationStrength = (distance: number) => { return 1.0 / (distance + 1) };
        const attractionStrength = (distance: number) => { return distance };
        const cohesionStrength = (distance: number) => { return distance };
        if (birdMeshRef.current) {
            for (const [i, bird] of birdInstances.current.entries()) {
                let separation = new THREE.Vector3();
                let alignment = new THREE.Vector3();
                let cohesion = new THREE.Vector3();

                // const velocity = new THREE.Vector3(
                //     2*(Math.random() - 0.5),
                //     2*(Math.random() - 0.5),
                //     0
                // )

                // bird.velocity.add(velocity)


                if (isNaN(bird.position.x) || isNaN(bird.position.y) || isNaN(bird.position.z)) {
                    throw new Error('RIP')
                }

                // for (const [j, neighbor] of birdInstances.current.entries()) {
                //     if(i===j || Math.random() < 0.4) continue;

                //     const vectorToNeighbor = bird.position.clone().sub(neighbor.position);
                //     const distanceLength = vectorToNeighbor.length();

                //     // Separation: Birds try to maintain a minimum distance from each other
                //     if (distanceLength < separationDistance) {
                //         separation.sub(vectorToNeighbor.normalize())//.multiplyScalar(seperationStrength(distanceLength)));
                //     }

                //     // Alignment: Birds try to align their velocities with neighboring birds
                //     if (distanceLength < attractionDistance) {
                //         alignment.add(neighbor.velocity.multiplyScalar(attractionStrength(distanceLength)));
                //     }

                //     // Cohesion: Birds try to move towards the center of mass of neighboring birds
                //     if (distanceLength < cohesionDistance) {
                //         cohesion.add(vectorToNeighbor.multiplyScalar(cohesionStrength(distanceLength)));
                //     }


                // }
                // if(i===0){console.log(separation, alignment, cohesion)}


                // // Apply alignment rule
                // alignment.divideScalar(birdsCount - 1).sub(bird.velocity);

                // // Apply cohesion rule
                // cohesion.divideScalar(birdsCount - 1).sub(bird.position);

                // // Update velocity based on rules
                // // bird.velocity.add(separation)//.add(alignment).add(cohesion).normalize().multiplyScalar(velocityScalar);
                // // console.log(separation, alignment, cohesion)
                bird.velocity.normalize().multiplyScalar(velocityScalarRef.current);
                bird.position.add(bird.velocity);

                clipPosition(bird);

                birdMeshRef.current.setMatrixAt(i, getMatrixFromVector(bird.position, bird.velocity));
            }


            //Very important this stays this way, doesnt update otherwise
            birdMeshRef.current.instanceMatrix.needsUpdate = true;
            // console.log(birdInstances.current[0])
        }
        // console.log('f', birdInstances.current[0].velocity)
    }

    useEffect(() => {
        if (birdMeshRef.current) {
            const prevLength = birdInstances.current.length;

            for (let i = 0; i < birdsCount; i++) {
                if (i < prevLength){
                    const pos = new THREE.Vector3(Math.random(), Math.random(), 0);
                    const bird: Bird = {
                        position: pos,
                        velocity: new THREE.Vector3(Math.random(), Math.random(), 0).normalize().multiplyScalar(velocityScalarRef.current),
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
        updateBirds();

    },[birdsCount])


    // useFrame(() => {
    //     if (birdMeshRef.current)
    //         birdMeshRef.current.geometry.attributes.position.needsUpdate = true;
    //     // console.log('fr')
    // })

    useEffect(() => {
        const intervalId = setInterval(updateBirds, 1000 / fps);
        // updateBirds();
        return () => clearInterval(intervalId); // Cleanup function to clear the interval when the component unmounts or the dependency array changes
    }, [fps]);

    function countframes() {
        // console.log(framecounter)
        framecounter = 0
    }
    useEffect(() => {
        const intervalId = setInterval(countframes, 1000);
        return () => clearInterval(intervalId); // Cleanup function to clear the interval when the component unmounts or the dependency array changes
    }, [fps]);

    return (
        <>
            <OrthographicCamera
                makeDefault
                ref={cameraRef}
                position={[0, 0, 100]}
            />
            <MapControls
                enableRotate={false}
                zoomToCursor={true}
                zoomSpeed={1}
                enableDamping={true}
                screenSpacePanning={true}
                ref={controlsRef}
                minZoom={1}
                maxZoom={50}
            />
            <instancedMesh
                ref={birdMeshRef}
                args={[geomtery, material, birdsCount]}
                frustumCulled={false}
            />

        </>
    );
}

export default React.memo(BirdSim);