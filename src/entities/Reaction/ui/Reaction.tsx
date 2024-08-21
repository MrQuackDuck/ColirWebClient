import AnimatedNumbers from "react-animated-numbers";

interface ReactionProps {
  symbol: string;
  count: number;
  isActivated: boolean;
  onReactionAdded: () => any;
  onReactionRemoved: () => any;
}

function Reaction(props: ReactionProps) {
  function reactionClicked () {
    if (props.isActivated) props.onReactionRemoved();
    else props.onReactionAdded();
  }

  return (
    <button onClick={reactionClicked} className={`flex flex-row w-min ${props.isActivated ? "bg-accent/100 border-primary/40" : "bg-accent/50 border-primary/20"} text-sm hover:bg-primary/10 gap-1.5 px-1.5 py-[1px] border rounded-[6px] leading-5 select-none cursor-pointer`}>
      <span className="text-[12px]">{props.symbol}</span>
      <AnimatedNumbers
        className={`${props.isActivated ? "text-primary/80" : "text-primary/70" } font-semibold`}
        transitions={() => ({
          type: 'tween', 
          stiffness: 100,
          damping: 10,
          mass: 1,
          restDelta: 0.01,
          restSpeed: 0.01,
        })}
        animateToNumber={props.count}
        />
    </button>
  )
}

export default Reaction