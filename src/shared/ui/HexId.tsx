import { useAdaptiveColor } from "../lib/hooks/useAdaptiveColor";
import { cn } from "../lib/utils";
import classes from "./HexId.module.css";

interface ColorElementProps {
  color: number;
  isSelected?: boolean;
  onSelected?: () => void;
  className?: string;
}

function HexId({ color, isSelected, onSelected, className }: ColorElementProps) {
  let { colorString } = useAdaptiveColor(color);

  return (
    <div
      tabIndex={0}
      onClick={onSelected}
      onKeyDown={(e) => e.keyCode == 32 && onSelected && onSelected()}
      className={cn(
        `text-muted-foreground transition-[background-color] cursor-pointer px-1.5 py-1.5 rounded-[6px]
    select-none font-semibold text-[14px] flex items-center gap-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1`,
        isSelected ? classes.selected : null,
        className
      )}
    >
      <div style={{ backgroundColor: colorString }} className="w-6 h-6 aspect-square inline-block rounded-[6px]"></div> {colorString}
    </div>
  );
}

export default HexId;
