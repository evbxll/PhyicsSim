import BirdSim from "@/components/birdSim";
import React from 'react';
import { Canvas} from "@react-three/fiber";

const HomePage = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas>
        <BirdSim />
        <color attach="background" args={['black']} />
      </Canvas>
    </div>
  );
}

export default HomePage;
