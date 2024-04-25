import BirdSim from "@/components/birdSim";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState, useRef } from 'react';

import SettingsMenu from './SettingsMenu';

export interface Bounds {
  boundX: number,
  boundY: number,
  boundZ: number,
}

const Sky = () => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(true);
  const boundsRef = useRef<Bounds>({
    boundX: 50,
    boundY: 50,
    boundZ: 50
  });


  const updateBounds = () => {

  };

  useEffect(() => {
    updateBounds(); // Update bounds initially
    window.addEventListener('resize', updateBounds); // Update bounds on window resize

    return () => {
      window.removeEventListener('resize', updateBounds); // Cleanup event listener
    };
  }, []);

  return (
    <>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <BirdSim bounds={boundsRef.current}/>
        <color attach="background" args={['black']} />
      </Canvas>
      <SettingsMenu
        updateBounds={updateBounds}
        bounds={boundsRef.current}
        showSettingsMenu={showSettingsMenu}
        setShowSettingsMenu={setShowSettingsMenu}

      />
    </>
  );
}

export default Sky;