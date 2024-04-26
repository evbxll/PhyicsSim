import BirdSim from "@/components/birdSim";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useThree, useFrame, ThreeEvent } from "@react-three/fiber";

import BoundsBox from './BoundsBox';

import SettingsMenu from './SettingsMenu';

export interface Bounds {
  boundX: number,
  boundY: number,
  boundZ: number,
}

const Sky = () => {
  const canvasRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const controlsRef = useRef<any>(null);

  const [animating, setAnimating] = useState(false);
  const [target, setTarget] = useState(new THREE.Vector3(0, 0, 0));

  const [showSettingsMenu, setShowSettingsMenu] = useState(true);
  const [bounds, setBounds] = useState<Bounds>({
    boundX: 50,
    boundY: 50,
    boundZ: 50
  });
  const boundsRef = useRef<Bounds | null>(null)

  const [fps, setFps] = useState<number>(30);
  const [birdSize, setBirdSize] = useState<number>(1);
  const [birdsCount, setBirdsCount] = useState(100);
  const [birdVelocity, setBirdVelocity] = useState(2);

  const updateBounds = (x?: number, y?: number, z?: number): void => {

    const newBounds: Bounds = ({
      boundX: x ? x : bounds.boundX,
      boundY: y ? y : bounds.boundY,
      boundZ: z ? z : bounds.boundZ,

    })
    // console.log(newBounds)
    setBounds(newBounds)
  };

  useEffect(() => {
    boundsRef.current = bounds;
  })

  const recenterCamera = () => {
    const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return
    cameraRef.current.position.set(0, 0, 100);
    cameraRef.current.zoom = 1;
    controlsRef.current.target.copy(new THREE.Vector3(0,0, 100))
    controlsRef.current.update();
    cameraRef.current.updateProjectionMatrix();
    const maxWidth = rect.width / 2 - 10;
    const maxHeight = rect.height / 2 - 10;
    updateBounds(maxWidth, maxHeight);
  }

  return (
    <>
      <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}>
        <BirdSim
          boundsRef={boundsRef}
          cameraRef={cameraRef}
          controlsRef={controlsRef}
          fps={fps}
          birdVelocity={birdVelocity}
          birdSize={birdSize}
          birdsCount={birdsCount}
        />
        <BoundsBox bounds={bounds} />
        <color attach="background" args={['black']} />
      </Canvas>
      <SettingsMenu
        canvasRef={canvasRef}
        updateBounds={updateBounds}
        bounds={bounds}
        showSettingsMenu={showSettingsMenu}
        setShowSettingsMenu={setShowSettingsMenu}
        fps={fps}
        setFps={setFps}
        birdSize={birdSize}
        setBirdSize={setBirdSize}
        birdsCount={birdsCount}
        setBirdsCount={setBirdsCount}
        birdVelocity={birdVelocity}
        setBirdVelocity={setBirdVelocity}
        recenterCamera={recenterCamera}
      />
    </>
  );
}

export default Sky;