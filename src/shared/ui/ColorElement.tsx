import classes from './ColorElement.module.css'

function ColorElement({ color, isSelected, onSelected }: { color: number, isSelected?: boolean, onSelected?: () => void }) {
  let colorStringified = '#' + color.toString(16);
  
  return (
    <div onClick={onSelected} className={`text-muted-foreground transition-[background-color] cursor-pointer duration-[10ms] px-1.5 py-1.5 rounded-[6px]
    select-none font-semibold text-[14px] flex items-center gap-2 hover:bg-muted ${isSelected ? classes.selected : null}`}>
      <div
        style={{ backgroundColor: colorStringified }}
        className="w-6 h-6 aspect-square inline-block rounded-[6px]"
      ></div>{" "}
      {colorStringified}
    </div>
  );
}

export default ColorElement;
