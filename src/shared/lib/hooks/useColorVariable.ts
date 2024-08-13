import { useEffect, useState } from "react";
import { hslToHex, replaceAll } from "../utils";
import { useTheme } from "../theme-provider";

export const useCssVariableColor = (colorVariable) => {
    const [iconColor, setIconColor] = useState<string>(); 
    const theme = useTheme();

    useEffect(() => {
        var cssColor = getComputedStyle(document.documentElement).getPropertyValue(`--${colorVariable}`);
    
        if (!cssColor.startsWith("#")) {
          let [h, s, l] = replaceAll(cssColor, "%", '').split(' ');
          setIconColor(hslToHex(h, s, l));
        }
        else
          setIconColor(cssColor);
      }, [theme]);

      return iconColor;
}