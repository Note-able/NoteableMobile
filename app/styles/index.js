export const colors = {
  shade0: '#1B1F20', // primary background
  shade20: '#2D2E2E',
  shade90: '#95989A',
  shade140: '#DDDDDA',
  shadow: '#0E1010',
  green: '#31CB94',
  recordingRed: '#E8163E',
  white: '#FFFFFF',
  /** haven't used below yet */
  blue: '#1875DC',
  purple: '#8A32D9',
  red: '#D93A64',
  orange: '#F0A63E',
  yellow: '#EACF3F',
  light: '#D0D1D5',
  medium: '#7A7B86',
  mediumDark: '#32302F',
  dark: '#1f1b20',
};

const colorRGBA = {
  green: 'rgba(49,203,148, 1)',
  blue: 'rgba(24,117,220, 1)',
  purple: 'rgba(138,50,217, 1)',
  red: 'rgba(217,58,100, 1)',
  orange: 'rgba(240,166,62, 1)',
  yellow: 'rgba(234,207,63, 1)',
};

export const gradients = {
  greenToBlue: [colorRGBA.green, colorRGBA.blue],
  purpleToRed: [colorRGBA.purple, colorRGBA.red],
  blueToPurple: [colorRGBA.blue, colorRGBA.purple],
  orangeToYellow: [colorRGBA.orange, colorRGBA.yellow],
  redToOrange: [colorRGBA.red, colorRGBA.orange],
};
