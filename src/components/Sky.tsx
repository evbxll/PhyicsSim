import BirdSim from "@/components/birdSim";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import BoundsBox from './BoundsBox';
import SettingsMenu from './SettingsMenu';
import { BoidRule } from "@/components/birdSim";

export interface Bounds {
  boundX: number,
  boundY: number,
  boundZ: number,
}

const Sky = () => {
  const canvasRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const controlsRef = useRef<any>(null);
  const boidRatiosRef = useRef<any>(null);
  const birdsCountRef = useRef<number>(0);


  const [boidRatios, setBoidRatios] = useState<BoidRule>({
    replusionDistance: 100,
    replusionStrength: 0.1,
    alignmentDistance: 100,
    alignmentStrength: 0.1,
    attractionDistance: 100,
    attractionStrength: 0.1,
  });

const [showSettingsMenu, setShowSettingsMenu] = useState(true);
const [bounds, setBounds] = useState<Bounds>({
  boundX: 300,
  boundY: 300,
  boundZ: 50
});
const boundsRef = useRef<Bounds | null>(null)

const [fps, setFps] = useState<number>(30);
const [birdSize, setBirdSize] = useState<number>(3);
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
  const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
  if (!rect) return
  const startWidth = rect.width / 3 - 5;
  const startHeight = rect.height / 3 - 5;
  updateBounds(startWidth, startHeight);
}, [])

useEffect(() => {
  boundsRef.current = bounds;
}, [bounds])

useEffect(() => {
  boidRatiosRef.current = boidRatios;
}, [boidRatios])

useEffect(() => {
  birdsCountRef.current = birdsCount;
}, [birdsCount])


const recenterCamera = () => {
  cameraRef.current.position.set(0, 0, 100);
  cameraRef.current.zoom = 1;
  controlsRef.current.target.copy(new THREE.Vector3(0, 0, 100))
  controlsRef.current.update();
  cameraRef.current.updateProjectionMatrix();
}

const expandBoundsToWindow = () => {
  const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
  if (!rect) return

  console.log('exp')
  cameraRef.current.position.set(0, 0, 100);
  controlsRef.current.target.copy(new THREE.Vector3(0, 0, 100))
  controlsRef.current.update();
  cameraRef.current.updateProjectionMatrix(); 
  const maxWidth = rect.width / 2 - 5;
  const maxHeight = rect.height / 2 - 5;
  updateBounds(maxWidth, maxHeight);
}

return (
  <>
    <Canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    >
      <BirdSim
        boundsRef={boundsRef}
        cameraRef={cameraRef}
        controlsRef={controlsRef}
        boidRatiosRef={boidRatiosRef}
        birdsCountRef={birdsCountRef}
        fps={fps}
        setFps={setFps}
        birdVelocity={birdVelocity}
        birdSize={birdSize}
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
      expandBoundsToWindow={expandBoundsToWindow}
      boidRatios={boidRatios}
      setBoidRatios={setBoidRatios}
    />
  </>
);
}

export default Sky;