import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Bounds } from './Window';
import Slider, { SliderType } from './Slider';




const SettingsMenu: React.FC<{
  canvasRef: React.MutableRefObject<any>;
  boundsStateHook: [any, any];
  showSettingsStateHook:[any, any];
  fpsStateHook: [any, any];
  ballSizeStateHook: [any, any];
  ballsCountStateHook: [any, any];
  ballVelocityStateHook: [any, any];
  groundBouncinessStateHook: [any, any];
  collisionBouncinessStateHook: [any, any];
  gravityStateHook: [any, any];
  recenterCamera: () => void;
  restartBalls: () => void;
}> = ({
  canvasRef,
  boundsStateHook,
  showSettingsStateHook,
  fpsStateHook,
  ballSizeStateHook,
  ballsCountStateHook,
  ballVelocityStateHook,
  groundBouncinessStateHook,
  collisionBouncinessStateHook,
  gravityStateHook,
  recenterCamera,
  restartBalls,
}) => {

    let maxWidth = 1000;
    let maxHeight = 1000;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      maxWidth = rect.width;
      maxHeight = rect.height;
    }

    const sliders: SliderType[] = [
      {
        name: "Bounding Width",
        variable: boundsStateHook[0].boundX,
        min: 50,
        max: maxWidth / 3,
        multiplier: 2,
        onChange: (value) => boundsStateHook[1](value, undefined),
      },
      {
        name: 'Bounding Height',
        min: 50,
        max: maxHeight / 3,
        variable: boundsStateHook[0].boundY,
        multiplier: 2,
        onChange: (value) => boundsStateHook[1](undefined, value)
      },
      //============================================================
      // The Bird Info
      {
        name: 'Ball Size',
        min: 1,
        max: 10,
        variable: ballSizeStateHook[0],
        onChange: ballSizeStateHook[1]
      },
      {
        name: 'Balls Count',
        min: 2,
        max: 1000,
        variable: ballsCountStateHook[0],
        onChange: ballsCountStateHook[1]
      },
      {
        name: 'Max Ball Velocity',
        min: 0,
        max: 10,
        stepSize: 0.1,
        variable: ballVelocityStateHook[0],
        onChange: ballVelocityStateHook[1]
      },
      {
        name: 'Collision Bounciness',
        min: 0,
        max: 1,
        stepSize: 0.01,
        variable: collisionBouncinessStateHook[0],
        onChange: collisionBouncinessStateHook[1]
      },
      {
        name: 'Ground Bounciness',
        min: 0,
        max: 1,
        stepSize: 0.01,
        variable: groundBouncinessStateHook[0],
        onChange: groundBouncinessStateHook[1]
      },
      {
        name: 'Gravity',
        min: 0,
        max: 0.5,
        stepSize: 0.01,
        multiplier: 2,
        variable: gravityStateHook[0],
        onChange: gravityStateHook[1]
      }
    ];


    return (
      <>
        {!showSettingsStateHook[0] && (
          <button
            className="fixed top-4 right-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md transition duration-300 hover:bg-blue-600"
            onClick={() => fpsStateHook[1](true)}
          >
            Show Settings
          </button>
        )}
        {showSettingsStateHook[0] && (
          <Draggable handle=".drag-handle" bounds="parent">
            <div className="absolute top-10 right-10 max-h-[80vh] bg-gray-200 flex-vertical autoflow-auto overflow-y-auto bg-opacity-80 p-4 padding-top-0 rounded-md shadow-md font-sans">
              <div className="drag-handle w-full h-12 flex justify-center cursor-move">
                <i className="fa fa-arrows text-3xl" />
              </div>
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-800"
                onClick={() => fpsStateHook[1](false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex-vertical autoflow-auto overflow-y-auto max-h-20vh">
                <h2 className="text-lg font-semibold mb-2">Settings Menu</h2>
                <h2 className="text-lg font-semibold mb-2">FPS : {fpsStateHook[0]?.toFixed(3)}</h2>
                {sliders.map((sliderInfo, index) => (
                  <Slider
                    key={index}
                    SliderInfo={sliderInfo}
                  />
                ))}
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-md mb-1 ml-1 mr-1 " onClick={recenterCamera}>Recenter / Zoom Out</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-md mb-1 ml-1 mr-1" onClick={restartBalls}>Restart Balls</button>
              </div>
            </div>
          </Draggable >
        )}
      </>
    );
  }

export default SettingsMenu;
