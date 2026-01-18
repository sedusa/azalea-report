const sharedConfig = require('@azalea/ui/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    '../../packages/sections/**/*.{js,ts,jsx,tsx}',
  ],
};
