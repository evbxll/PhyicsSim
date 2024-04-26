import React from 'react';

export interface SliderType {
  /**
   * The name of this slider
   */
  name: string;

  /**
   * The variable associated with this slider's value
   */
  variable: number;

  /**
   * The actual minimum value this variable takes
   */
  min: number;

  /**
   * The actual maximum value value this variable takes
   */
  max: number;

  /**
   * Multiplier which displays a higher number that it really is
   */
  multiplier?: number;

  /**
   * optional slider stepsize
   */
  stepSize?: number;
  
  /**
   * The function to update this variables
   * @returns 
   */
  onChange: (...args: any[]) => void;
}

const Slider : React.FC<{SliderInfo: SliderType}> = ({SliderInfo}) => {
  const { min, max, variable, multiplier, stepSize, name, onChange } = SliderInfo;

  const handleChange = (event: any) => {
    const value = parseFloat(event.target.value);
    onChange(value);
  };

  return (
    <div className="mb-2">
      <label className="block text-sm mb-1">{name}: <span className="text-gray-500 ml-2">{variable * (multiplier ?? 1)}</span></label>
      <input
        type="range"
        min={min}
        step={stepSize ?? 1}
        max={max}
        value={variable}
        onChange={handleChange}
        className="w-full appearance-none bg-gray-300 rounded-md h-5 transition-opacity duration-200 opacity-50 hover:opacity-100"
      />
    </div>
  );
};

export default Slider;