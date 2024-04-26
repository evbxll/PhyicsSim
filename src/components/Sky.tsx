import BirdSim from "@/components/birdSim";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import BoundsBox from './BoundsBox';
import SettingsMenu from './SettingsMenu';
import { BoidRule } from "@/components/birdSim";
import Scale from "./Scale";

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
  boundZ: 1
});
const boundsRef = useRef<Bounds | null>(null)

const [fps, setFps] = useState<number>(30);
const [birdSize, setBirdSize] = useState<number>(6);
const [birdsCount, setBirdsCount] = useState(100);
const [birdVelocity, setBirdVelocity] = useState(4);

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
  expandBoundsToWindow();
}, [canvasRef.current, cameraRef.current])

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
  controlsRef.current.reset();
}

const expandBoundsToWindow = () => {
  const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
  if (!rect) return
  if(!controlsRef.current) return
 
  const maxWidth = rect.width / 2 - 2;
  const maxHeight = rect.height / 2 - 2;
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
      <Scale unitLength={100} cameraRef={cameraRef}/>
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