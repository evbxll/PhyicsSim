import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Bounds } from './Sky';
import Slider, { SliderType } from './Slider';




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
  recenterCamera
}) => {

    let maxWidth = 1000;
    let maxHeight = 1000;
    const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
    if (rect) {
      maxWidth = rect.width;
      maxHeight = rect.height;
    }

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
      {
        name: 'FPS',
        min: 0.5,
        max: 100,
        variable: fps,
        onChange: (value) => setFps(value)
      },
      {
        name: 'Bird Size',
        min: 1,
        max: 10,
        variable: birdSize,
        onChange: (value) => setBirdSize(value)
      },
      {
        name: 'Birds Count',
        min: 1,
        max: 500,
        variable: birdsCount,
        onChange: (value) => setBirdsCount(value)
      },
      {
        name: 'Bird Velocity',
        min: 0.1,
        max: 10,
        variable: birdVelocity,
        onChange: (value) => setBirdVelocity(value)
      }
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
            <div className="absolute top-10 right-10 bg-gray-200 bg-opacity-80 p-4 padding-top-0 rounded-md shadow-md font-sans">
              <div className="drag-handle w-full h-12 flex justify-center cursor-move">
                <i className="fa fa-arrows text-3xl" />
              </div>
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowSettingsMenu(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold mb-2">Settings Menu</h2>
              {sliders.map((sliderInfo, index) => (
                <Slider
                  key={index}
                  SliderInfo={sliderInfo}
                />
              ))}
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mb-2 w-full" onClick={recenterCamera}>Recenter</button>
            </div>
          </Draggable >
        )}
      </>
    );
  }

export default SettingsMenu;
