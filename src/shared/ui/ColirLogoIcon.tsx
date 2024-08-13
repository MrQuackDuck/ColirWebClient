import { useEffect, useState } from "react";
import { useTheme } from "../lib/theme-provider";

function ColirLogoIcon({...props}) {
  const { theme } = useTheme();
  const [path, setPath] = useState("/src/assets/colir-light.svg");

  useEffect(() => {
    if (theme == "dark" || theme == "system") setPath("/src/assets/colir-light.svg")
    else setPath("/src/assets/colir-dark.svg")
  }, [theme])

  return (<img src={path} {...props} draggable="false" />)
}

export default ColirLogoIcon