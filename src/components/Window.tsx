import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import BoundsBox from './BoundsBox';
import SettingsMenu from './SettingsMenu';
import BallSim from "@/components/BallSimulator";
// import Scale from "./Scale";

export interface Bounds {
  boundX: number,
  boundY: number,
  boundZ: number,
}

const Window = () => {
  const canvasRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const controlsRef = useRef<any>(null);
  const boundsRef = useRef<Bounds | null>(null)

  const ballsCountRef = useRef<number>(0);
  const groundBouncinessRef = useRef<number>(0.9);
  const collisionBouncinessRef = useRef<number>(0.4);
  const maxVelocityRef = useRef<number>(3);
  const clipTeleportRef = useRef<boolean>(false);


  const [showSettingsMenu, setShowSettingsMenu] = useState(true);


  const [bounds, setBounds] = useState<Bounds>({
    boundX: 300,
    boundY: 300,
    boundZ: 1
  });


  const [fps, setFps] = useState<number>(30);
  const [ballSize, setBallSize] = useState<number>(3);
  const [ballsCount, setBallsCount] = useState(100);
  const [ballVelocity, setBallVelocity] = useState(5);
  const [groundBounciness, setGroundBounciness] = useState(0.99);
  const [collisionBounciness, setCollisionBounciness] = useState(0.99);
  const [gravity, setGravity] = useState(0.01);

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
    ballsCountRef.current = ballsCount;
  }, [ballsCount])

  useEffect(() => {
    groundBouncinessRef.current = groundBounciness;
  }, [groundBounciness])

  useEffect(() => {
    collisionBouncinessRef.current = collisionBounciness;
  }, [collisionBounciness])

  useEffect(() => {
    maxVelocityRef.current = ballVelocity;
  }, [ballVelocity])


  const recenterCamera = () => {
    console.log(ballSize)
    controlsRef.current.reset();
  }

  const expandBoundsToWindow = () => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return
    if (!controlsRef.current) return

    const maxWidth = rect.innerWidth / 3 - 2;
    const maxHeight = rect.height / 4 - 2;
    updateBounds(maxWidth, maxHeight);
  }

  const restartBalls = async () => {
    const c = ballsCount;
    setBallsCount(0);
    await new Promise(resolve => { setTimeout(resolve, 500); })
    setBallsCount(Math.max(100, c))
  }

  return (
    <>
      <Canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      >
        <BallSim
          boundsRef={boundsRef}
          cameraRef={cameraRef}
          controlsRef={controlsRef}
          ballsCount={ballsCount}
          ballSize={ballSize}
          fps={fps}
          gravity={gravity}
          groundBouncinessRef={groundBouncinessRef}
          collisionBouncinessFactorRef={collisionBouncinessRef}
          maxVelocityRef={maxVelocityRef}
          clipTeleportRef={clipTeleportRef}
          setFps={setFps}
        />
        <BoundsBox bounds={bounds} />
        <color attach="background" args={['black']} />
      </Canvas>
      <SettingsMenu
        canvasRef={canvasRef}
        boundsStateHook={[bounds, updateBounds]}
        showSettingsStateHook={[showSettingsMenu, setShowSettingsMenu]}
        fpsStateHook={[fps, setFps]}
        ballSizeStateHook={[ballSize, setBallSize]}
        ballsCountStateHook={[ballsCount, setBallsCount]}
        ballVelocityStateHook={[ballVelocity, setBallVelocity]}
        groundBouncinessStateHook={[groundBounciness, setGroundBounciness]}
        collisionBouncinessStateHook={[collisionBounciness, setCollisionBounciness]}
        gravityStateHook={[gravity, setGravity]}

        recenterCamera={recenterCamera}
        restartBalls={restartBalls}
      />
    </>
  );
}

export default Window;