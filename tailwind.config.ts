// tailwind.config.ts

// Export an empty object to make it a module
export default {};

// Your Tailwind CSS configuration goes here
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  // Other Tailwind CSS configuration properties
  theme: {
    extend: {
      colors: {
        'custom-yellow': '#DDA11D',
        'custom-yellow-dark': '#B37F17',
      },
    },
  },
};
