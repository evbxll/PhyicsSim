import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Bounds } from './Sky';
import Slider, { SliderType } from './Slider';
import { BoidRule } from './birdSim';




const SettingsMenu: React.FC<{
  canvasRef: React.MutableRefObject<any>;
  updateBounds: (x?: number, y?: number, z?: number) => void;
  bounds: Bounds;
  showSettingsMenu: boolean;
  setShowSettingsMenu: (variable: boolean) => void;
  fps: number;
  setFps: (variable: number) => void;
  birdSize: number;
  setBirdSize: (variable: number) => void;
  birdsCount: number;
  setBirdsCount: (variable: number) => void;
  birdVelocity: number;
  setBirdVelocity: (variable: number) => void;
  recenterCamera: () => void;
  expandBoundsToWindow: () => void;
  boidRatios: BoidRule;
  setBoidRatios: (value: BoidRule) => void;
}> = ({
  canvasRef,
  updateBounds,
  bounds,
  showSettingsMenu,
  setShowSettingsMenu,
  fps,
  setFps,
  birdSize,
  setBirdSize,
  birdsCount,
  setBirdsCount,
  birdVelocity,
  setBirdVelocity,
  recenterCamera,
  expandBoundsToWindow,
  boidRatios,
  setBoidRatios,
}) => {

    let maxWidth = 1000;
    let maxHeight = 1000;
    const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
    if (rect) {
      maxWidth = rect.width;
      maxHeight = rect.height;
    }

    const boidStrengthMax = 0.5;

    const updateBoidRule = (value: Partial<BoidRule>): void => {
      const updatedBoidRatios = { ...boidRatios, ...value };
      setBoidRatios(updatedBoidRatios);
    };

    const sliders: SliderType[] = [
      {
        name: "Bounding Width",
        variable: bounds.boundX,
        min: 50,
        max: maxWidth / 2,
        multiplier: 2,
        onChange: (value) => updateBounds(value),
      },
      {
        name: 'Bounding Height',
        min: 50,
        max: maxHeight / 2,
        variable: bounds.boundY,
        multiplier: 2,
        onChange: (value) => updateBounds(undefined, value)
      },
      //============================================================
      // The Bird Info
      {
        name: 'Bird Size',
        min: 1,
        max: 10,
        variable: birdSize,
        onChange: (value) => setBirdSize(value)
      },
      {
        name: 'Birds Count',
        min: 2,
        max: 1000,
        variable: birdsCount,
        onChange: (value) => setBirdsCount(Math.max(2, value))
      },
      {
        name: 'Bird Velocity',
        min: 0.1,
        max: 10,
        stepSize: 0.1,
        variable: birdVelocity,
        onChange: (value) => setBirdVelocity(value)
      },
      //============================================================
      // The BoidRules
      {
        name: 'Replusion: Max DIST',
        min: 0,
        max: Math.max(maxWidth / 2, maxHeight / 2),
        variable: boidRatios.replusionDistance,
        onChange: (value) => updateBoidRule({ replusionDistance: value })
      },
      {
        name: 'Alignment: Max DIST',
        min: 0,
        max: Math.max(maxWidth / 2, maxHeight / 2),
        variable: boidRatios.alignmentDistance,
        onChange: (value) => updateBoidRule({ alignmentDistance: value })
      },
      {
        name: 'Attraction: Max DIST',
        min: 0,
        max: Math.max(maxWidth / 2, maxHeight / 2),
        variable: boidRatios.attractionDistance,
        onChange: (value) => updateBoidRule({ attractionDistance: value })
      },
      {
        name: 'Replusion: Relative STRENGTH',
        min: 0,
        max: boidStrengthMax,
        multiplier: 10 / boidStrengthMax,
        stepSize: 0.1,
        variable: boidRatios.replusionStrength,
        onChange: (value) => updateBoidRule({ replusionStrength: value })
      },
      {
        name: 'Alignment: Relative STRENGTH',
        min: 0,
        max: boidStrengthMax,
        multiplier: 10 / boidStrengthMax,
        stepSize: 0.1,
        variable: boidRatios.alignmentStrength,
        onChange: (value) => updateBoidRule({ alignmentStrength: value })
      },
      {
        name: 'Attraction: Relative STRENGTH',
        min: 0,
        max: boidStrengthMax,
        multiplier: 10 / boidStrengthMax,
        stepSize: 0.1,
        variable: boidRatios.attractionStrength,
        onChange: (value) => updateBoidRule({ attractionStrength: value })
      },
    ];


    return (
      <>
        {!showSettingsMenu && (
          <button
            className="fixed top-4 right-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md transition duration-300 hover:bg-blue-600"
            onClick={() => setShowSettingsMenu(true)}
          >
            Show Settings
          </button>
        )}
        {showSettingsMenu && (
          <Draggable handle=".drag-handle" bounds="parent">
            <div className="absolute top-10 right-10 max-h-[80vh] bg-gray-200 flex-vertical autoflow-auto overflow-y-auto bg-opacity-80 p-4 padding-top-0 rounded-md shadow-md font-sans">
              <div className="drag-handle w-full h-12 flex justify-center cursor-move">
                <i className="fa fa-arrows text-3xl" />
              </div>
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-800"
                onClick={() => setShowSettingsMenu(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex-vertical autoflow-auto overflow-y-auto max-h-20vh">
                <h2 className="text-lg font-semibold mb-2">Settings Menu</h2>
                <h2 className="text-lg font-semibold mb-2">FPS : {fps.toFixed(3)}</h2>
                {sliders.map((sliderInfo, index) => (
                  <Slider
                    key={index}
                    SliderInfo={sliderInfo}
                  />
                ))}
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-md mb-1 ml-1 mr-1 " onClick={recenterCamera}>Recenter / Zoom Out</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-md mb-1 ml-1 mr-1" onClick={expandBoundsToWindow}>ReExpand Bounds</button>
              </div>
            </div>
          </Draggable >
        )}
      </>
    );
  }

export default SettingsMenu;
