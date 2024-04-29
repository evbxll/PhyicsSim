import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { MapControls, OrthographicCamera, PerspectiveCamera, Box, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface Ball {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    color: THREE.Color;
}

const BallSim: React.FC<{
    boundsRef: React.RefObject<any>;
    cameraRef: React.RefObject<any>;
    controlsRef: React.RefObject<any>;
    ballsCount: number;
    ballSize: number;
    fps: number;
    groundBouncinessRef: React.MutableRefObject<number>;
    collisionBouncinessFactorRef: React.MutableRefObject<number>;
    maxVelocityRef: React.MutableRefObject<number>;
    clipTeleportRef: React.MutableRefObject<boolean>;
    gravity: number;
    setFps: React.Dispatch<React.SetStateAction<number>>;
}> = ({
    boundsRef,
    cameraRef,
    controlsRef,
    ballsCount,
    ballSize,
    fps,
    groundBouncinessRef,
    collisionBouncinessFactorRef,
    maxVelocityRef,
    clipTeleportRef,
    gravity,
    setFps,
}) => {

        let framecounter = 0;

        const ballInstances = useRef<Ball[]>([]);
        const ballMeshRef = useRef<THREE.InstancedMesh>(null);

        const geomtery = useMemo(() => { return new THREE.SphereGeometry(ballSize, 15, 15) }, [ballSize]);

        function getMatrixFromVector(pos: THREE.Vector3, vel: THREE.Vector3): THREE.Matrix4 {
            // Create translation matrix to position the object at 'pos'
            const translationMatrix = new THREE.Matrix4().setPosition(pos);
            const angle = Math.atan2(vel.x, vel.y);
            const rotationMatrix = new THREE.Matrix4().makeRotationZ(-angle);
            return new THREE.Matrix4().multiplyMatrices(translationMatrix, rotationMatrix);
        }

        const clipPosition = useMemo(() => {
            return (position: THREE.Vector3, velocity: THREE.Vector3, groundBouncinessFactor: number): void => {
                const boundX = boundsRef.current.boundX - ballSize;
                const boundY = boundsRef.current.boundY - ballSize;

                if (position.y <= -boundY) {
                    position.y = THREE.MathUtils.clamp(position.y, -boundY, boundY);
                    velocity.y *= -groundBouncinessFactor;
                }
                else if (position.y > -boundY + 0.05){
                    velocity.add(new THREE.Vector3(0, -gravity, 0))
                }

                if (!clipTeleportRef.current) {
                    if (Math.abs(position.x) >= boundX) {
                        position.x = THREE.MathUtils.clamp(position.x, -boundX, boundX);
                        velocity.x *= -1;
                    }
                    if (position.y >= boundY) {
                        position.y = boundY;
                        velocity.y *= -1;
                    }
                } else {
                    console.log(position, boundX, boundY)
                    if (Math.abs(position.x) >= boundX) {
                        position.x = (position.x < 0) ? boundX - 1 : -boundX + 1;
                    }
                    if (position.y >= boundY) {
                        position.y = -boundY + ballSize;
                    }
                }
            };
        }, [ballSize, gravity])

        const updateBalls = () => {
            if (!ballMeshRef.current) return

            const skipChance = 0

            const tempBallsCount = Math.min(ballsCount, ballInstances.current.length);
            const collisionBouncinessFactor = THREE.MathUtils.clamp(THREE.MathUtils.clamp(Math.random() - 0.5, -0.01, 0.01) + collisionBouncinessFactorRef.current, 0, 1);
            const groundBounciness = THREE.MathUtils.clamp(THREE.MathUtils.clamp(Math.random() - 0.5, -0.01, 0.01) + groundBouncinessRef.current, 0, 1);

            const newBallVelocities: THREE.Vector3[] = Array.from({ length: tempBallsCount });

            for (let i = 0; i < tempBallsCount; i++) {
                const ball = ballInstances.current[i];
                const newBallVelocity = ball.velocity.clone();
                let collisions = 0




                if (isNaN(ball.position.x) || isNaN(ball.position.y) || isNaN(ball.position.z)) {
                    console.log(i, ball, tempBallsCount, ballInstances.current.length)
                    throw new Error('RIP')
                }

                for (let j = 0; j < tempBallsCount; j++) {
                    if (i === j || Math.random() < skipChance) continue;
                    const neighbor = ballInstances.current[j];

                    const vectorToNeighbor = neighbor.position.clone().sub(ball.position);
                    const distanceLength = vectorToNeighbor.length();

                    if (distanceLength <= 2 * ballSize) {
                        const similarity = Math.abs(1 - neighbor.velocity.clone().cross(vectorToNeighbor.clone()).length())
                        // const velRatio = (neighbor.velocity.length() + 0.01) / (ball.velocity.length() + neighbor.velocity.length() + 0.01)*similarity
                        vectorToNeighbor.multiplyScalar(similarity*0.5)
                        newBallVelocity.sub(vectorToNeighbor)
                        collisions += 1;
                    }
                }

                newBallVelocity.divideScalar(1 + collisions).multiplyScalar((collisions) ? collisionBouncinessFactor : 1)
                newBallVelocities[i] = newBallVelocity;

            }


            for (let i = 0; i < ballsCount; i++) {
                const newVelocity = newBallVelocities[i].clone();
                const ball = ballInstances.current[i];
                ball.velocity = newVelocity.clampLength(0, 50)
                ball.position.add(ball.velocity.clone().clampLength(0, maxVelocityRef.current));
                clipPosition(ball.position, ball.velocity, groundBounciness);
                ballMeshRef.current.setMatrixAt(i, getMatrixFromVector(ball.position, ball.velocity));
                ballMeshRef.current.setColorAt(i, ball.color);
            }

            //Very important this stays this way, doesnt update otherwise
            ballMeshRef.current.instanceMatrix.needsUpdate = true;
            framecounter += 1;
        }

        useEffect(() => {
            if (!ballMeshRef.current) return

            const initialVelocity = maxVelocityRef.current;

            const prevLength = ballInstances.current.length;
            if (prevLength >= ballsCount) {
                ballInstances.current = ballInstances.current.slice(0, ballsCount);
                for (let i = 0; i < ballsCount; i++) {
                    const ball = ballInstances.current[i]
                    // ballMeshRef.current.setMatrixAt(i, matrix);
                    ballMeshRef.current.setColorAt(i, ball.color);
                    ballMeshRef.current.instanceMatrix.needsUpdate = true;
                    if (ballMeshRef.current && ballMeshRef.current.instanceColor) ballMeshRef.current.instanceColor.needsUpdate = true;
                    // ba

                }
                updateBalls();
                return;
            }

            for (let i = 0; i < ballsCount; i++) {
                if (i >= prevLength) {

                    const pos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).multiplyScalar(30);
                    const ball: Ball = {
                        position: pos,
                        velocity: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).normalize().multiplyScalar(initialVelocity),
                        color: new THREE.Color(Math.random(), Math.random(), Math.random())
                    }

                    const matrix = getMatrixFromVector(ball.position, ball.velocity);
                    ballInstances.current.push(ball);
                    ballMeshRef.current.setMatrixAt(i, matrix);
                    ballMeshRef.current.setColorAt(i, ball.color);
                }
                else {
                    const ball = ballInstances.current[i]
                    // ballMeshRef.current.setMatrixAt(i, matrix);
                    ballMeshRef.current.setColorAt(i, ball.color);
                }

            }
            ballMeshRef.current.instanceMatrix.needsUpdate = true;
            if (ballMeshRef.current && ballMeshRef.current.instanceColor) ballMeshRef.current.instanceColor.needsUpdate = true;
            // ballMeshRef.current.instanceColor?.needsUpdate = true;

        }, [ballsCount])


        // useFrame(() => {
        //     if (ballMeshRef.current)
        //         ballMeshRef.current.geometry.attributes.position.needsUpdate = true;
        //     // console.log('fr')
        // })

        // useEffect(() => {
        //     const intervalId = setInterval(updateBalls, 1000 / fps);
        //     // updateBalls();
        //     return () => clearInterval(intervalId); // Cleanup function to clear the interval when the component unmounts or the dependency array changes
        // }, [fps]);

        useFrame(() => {
            updateBalls();
        })

        function countframes() {
            const ratio = 0.6;
            const newFPS = ratio * fps + (1 - ratio) * framecounter;
            setFps(newFPS);
            framecounter = 0;
        };

        useEffect(() => {
            framecounter = 0
            setTimeout(() => {
                countframes();
            }, 1000);
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

                    position0={new THREE.Vector3(0, 0, 825)}
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
                    ref={ballMeshRef}
                    args={[geomtery, undefined, ballsCount]}
                    frustumCulled={true}
                >
                    <meshBasicMaterial transparent={true} />
                </instancedMesh>

            </>
        );
    }

export default React.memo(BallSim);