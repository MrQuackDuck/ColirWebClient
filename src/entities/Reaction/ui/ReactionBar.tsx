import { useEffect, useState } from "react";
import { ReactionModel } from "../model/ReactionModel";
import Reaction from "./Reaction";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";

interface ReactionBarProps {
  reactions: ReactionModel[];
  onReactionAdded: (symbol: string) => any;
  onReactionRemoved: (reactionId: number) => any;
}

interface ReactionElement {
  id: number;
  symbol: string;
  count: number;
  isActivated: boolean;
}

function ReactionBar(props: ReactionBarProps) {
  const { currentUser } = useCurrentUser();
  const [reactionElements, setReactionElements] = useState<ReactionElement[]>([]);

  useEffect(() => {
    const newReactionElements: ReactionElement[] = [];

    props.reactions.forEach((reaction) => {
      const existingReaction = newReactionElements.find(
        (element) => element.symbol === reaction.symbol
      );

      if (existingReaction) {
        existingReaction.count++;
      } else {
        newReactionElements.push({
          id: reaction.id,
          symbol: reaction.symbol,
          count: 1,
          isActivated: props.reactions.find((r) => r.authorHexId === currentUser?.hexId) != undefined,
        });
      }
    });

    setReactionElements(newReactionElements);
  }, [props.reactions, currentUser?.hexId]);

  return (
    <div className="flex flex-row gap-1.5 mt-1">
      {reactionElements.map((r) => (
        <Reaction
          key={r.id}
          isActivated={r.isActivated}
          count={r.count}
          onReactionAdded={() => props.onReactionAdded(r.symbol)}
          onReactionRemoved={() => props.onReactionRemoved(r.id)}
          symbol={r.symbol}
        />
      ))}
    </div>
  );
}

export default ReactionBar;
