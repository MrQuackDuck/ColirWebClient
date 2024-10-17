import { useState } from "react"
import ColorElement from "./ColorElement"

function ListHexSelector({colors, onSelected} : {colors: number[], onSelected: (color: number) => void}) {
  let [selectedColor, setSelectedColor] = useState<number>(colors[0]);

  const onHexSelected = color => {
    setSelectedColor(color);
    onSelected(color);
  }

  return (<>
    {colors.map(c => <ColorElement key={c} onSelected={() => onHexSelected(c)} isSelected={selectedColor == c} color={c} />)}
  </>)
}

export default ListHexSelector