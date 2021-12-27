import { Appearance } from 'react-native';
const colorScheme = Appearance.getColorScheme();


const lightcolors = {
  primary: "#35373C",
  text: "#78797D",
  text2: "rgba(60,60,67,0.18)",
  background: "#F4F4F4",
  background2: "#FFFFFF",
  background4: "#F4F4F4",
  background3: "rgba(118, 118, 128, 0.12)",
  accent: "#6874E8",
  accent2: "rgba(109, 123, 255, 0.35)",
  placeholder: "#D6D6D6",
  placeholder2: "#C0C0C0",
  red: '#f85256',
  white: "#FFFFFF",
  black: "#000000"
}

function calcDarkElevation(dp) {
  const alphaLevels = [0, 5, 9, 13, 16]
  const alpha = alphaLevels[dp] * 0.01

  const RGB_background = {r: 18, g: 18, b: 18}
  const RGBA_color = {r: 255, g: 255, b: 255}


  const r = (1 - alpha) * RGB_background.r + alpha * RGBA_color.r;
  const g = (1 - alpha) * RGB_background.g + alpha * RGBA_color.g;
  const b = (1 - alpha) * RGB_background.b + alpha * RGBA_color.b

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

const darkcolors = {
  primary: "rgba(255,255,255,0.87)",
  text: "rgba(255,255,255,0.6)",
  text2: "rgba(255,255,255,0.38)",
  background: calcDarkElevation(0),
  background2: calcDarkElevation(1),
  background3: calcDarkElevation(2),
  background4: calcDarkElevation(3),
  background5: calcDarkElevation(4),
  accent2: "#6874E8",
  accent: "rgba(109,123,255,0.65)",
  placeholder: "#242424",
  placeholder2: "#414141",
  red: '#f85256',
  white: "#000000",
  black: "#FFFFFF",
}

const themecolors = colorScheme === "dark" ? darkcolors : lightcolors

const constants = {
  dark: colorScheme === "dark",
  constantWhite: "#f4f4f4"
}

export const colors = {...themecolors, ...constants}
