import BirdSim from "@/components/birdSim";
import { Canvas } from "@react-three/fiber";

import BoundsBox from './BoundsBox';
import React, { useEffect, useState, useRef } from 'react';

import SettingsMenu from './SettingsMenu';

export interface Bounds {
  boundX: number,
  boundY: number,
  boundZ: number,
}

const Sky = () => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(true);
  const [bounds, setBounds] = useState<Bounds>({
    boundX: 50,
    boundY: 50,
    boundZ: 50
  });


  const updateBounds = (x?: number, y?: number, z?: number): void => {
    
    const newBounds : Bounds = ({
      boundX: x ? x : bounds.boundX,
      boundY: y ? y : bounds.boundY,
      boundZ: z ? z : bounds.boundZ,

    })
    console.log(newBounds)
    setBounds(newBounds)
  };

  return (
    <>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <BirdSim />
        {/* <BoundsBox bounds={bounds} /> */}
        <color attach="background" args={['black']} />
      </Canvas>
      {/* <SettingsMenu
        updateBounds={updateBounds}
        bounds={bounds}
        showSettingsMenu={showSettingsMenu}
        setShowSettingsMenu={setShowSettingsMenu}

      /> */}
    </>
  );
}

export default Sky;