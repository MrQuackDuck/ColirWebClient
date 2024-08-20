import { useTheme } from "../providers/ThemeProvider";

type ColorType = "tooBlack" | "normal" | "tooWhite"

// Returns adjusted color for current theme
export const useAdaptiveColor = (color: number) => {
  let colorString = "#" + color.toString(16).padStart(6, '0');
  let colorType = getBrightness(colorString);
  let isAdjusted: boolean = false;

  let { theme } = useTheme();

  if (colorType == "tooBlack" && theme == "dark") {
    isAdjusted = true;
    colorString = adjustColor(colorString, 0.5);
  }
  else if (colorType == "tooWhite" && theme == "light") {
    isAdjusted = true;
    colorString = adjustColor(colorString, -0.5);
  }

  return { colorString, isAdjusted };
}

function getBrightness(hexcolor): ColorType {
  var r = parseInt(hexcolor.substring(1,3),16);
  var g = parseInt(hexcolor.substring(3,5),16);
  var b = parseInt(hexcolor.substring(5,7),16);
  var brightness = ((r*299)+(g*587)+(b*114)) / 1000;
  if (brightness < 50) return "tooBlack";
  if (brightness >= 50 && brightness <= 190) return "normal";
  else return "tooWhite";
}

function adjustColor(color, percent) {
    let hex = color.replace(/^#/, '');

    const num = parseInt(hex, 16);
    let r = (num >> 16) + Math.round(255 * percent);
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
    let b = (num & 0x0000FF) + Math.round(255 * percent);

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    const newColor = (r << 16) | (g << 8) | b;
    return `#${newColor.toString(16).padStart(6, '0').toUpperCase()}`;
}