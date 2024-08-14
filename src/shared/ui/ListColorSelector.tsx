import { useState } from "react"
import ColorElement from "./ColorElement"

function ListColorSelector({colors, onSelected} : {colors: number[], onSelected: (color: number) => void}) {
  let [selectedColor, setSelectedColor] = useState<number>(colors[0]);

  const onSelectedColor = color => {
    setSelectedColor(color);
    onSelected(color);
  }

  return (<>
    {colors.map(c => <ColorElement key={c} onSelected={() => onSelectedColor(c)} isSelected={selectedColor == c} color={c} />)}
  </>)
}

export default ListColorSelector