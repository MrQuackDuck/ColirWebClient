import { useState } from "react";
import HexId from "./HexId";

function ListHexSelector({ colors, onSelected }: { colors: number[]; onSelected: (color: number) => void }) {
  const [selectedColor, setSelectedColor] = useState<number>(colors[0]);

  const onHexSelected = (color) => {
    setSelectedColor(color);
    onSelected(color);
  };

  return (
    <>
      {colors.map((c) => (
        <HexId key={c} onSelected={() => onHexSelected(c)} isSelected={selectedColor == c} color={c} />
      ))}
    </>
  );
}

export default ListHexSelector;
