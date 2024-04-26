import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Bounds } from './Sky';

interface BoundsBoxProps {
  bounds: Bounds;
}
function BoundsBox({ bounds }: BoundsBoxProps) {
  const linesRef = useRef<Array<THREE.Line>>([]);
  const lineGroup = useRef<THREE.Group>(null);

  useMemo(() => {
    // Clear existing lines
    linesRef.current.forEach((line) => {
      if (lineGroup.current) lineGroup.current.remove(line);
    });
    linesRef.current = [];

    // Create lines
    const points = [
      new THREE.Vector3(-bounds.boundX, -bounds.boundY, -bounds.boundZ),
      new THREE.Vector3(bounds.boundX, -bounds.boundY, -bounds.boundZ),
      new THREE.Vector3(bounds.boundX, bounds.boundY, -bounds.boundZ),
      new THREE.Vector3(-bounds.boundX, bounds.boundY, -bounds.boundZ),
      new THREE.Vector3(-bounds.boundX, -bounds.boundY, -bounds.boundZ),
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    const line = new THREE.LineLoop(geometry, material);
    linesRef.current.push(line);

    // Add lines to group
    if (lineGroup.current) {
      lineGroup.current.add(line);
    }
  }, [bounds]);

  return <group ref={lineGroup} />;
}

export default React.memo(BoundsBox);