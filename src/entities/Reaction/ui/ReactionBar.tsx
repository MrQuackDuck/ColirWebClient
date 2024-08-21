import { forwardRef, useEffect, useState } from "react";
import { ReactionModel } from "../model/ReactionModel";
import Reaction from "./Reaction";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Card, CardContent, CardTitle } from "@/shared/ui/Card";
import { Separator } from "@/shared/ui/Separator";

interface ReactionBarProps {
  reactions: ReactionModel[];
  onReactionAdded: (symbol: string) => any;
  onReactionRemoved: (symbol: string) => any;
}

interface ReactionElement {
  id: number;
  symbol: string;
  count: number;
  isActivated: boolean;
}


const ReactionBar = forwardRef((props: ReactionBarProps, ref: any) => {
  const { currentUser } = useCurrentUser();
  const [reactionElements, setReactionElements] = useState<ReactionElement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentReactionInDialog, setCurrentReactionInDialog] = useState<string | null>(props.reactions[0]?.symbol);

  useEffect(() => {
    const newReactionElements: ReactionElement[] = [];

    props.reactions.forEach((reaction) => {
      const existingReaction = newReactionElements.find(
        (element) => element.symbol === reaction.symbol
      );

      if (existingReaction) existingReaction.count++;
      else newReactionElements.push({
          id: reaction.id,
          symbol: reaction.symbol,
          count: 1,
          isActivated: false,
        });
    });

    newReactionElements.forEach((element) => {
      element.isActivated = props.reactions.find(r => r.authorHexId == currentUser?.hexId && r.symbol == element.symbol) != undefined;
    });

    setReactionElements(newReactionElements);
  }, [props.reactions, currentUser?.hexId]);

  return (<>
    <div className="flex flex-row gap-1.5 mt-1">
      {reactionElements.map((r) => (
        <Tooltip key={r.symbol}>
          <TooltipTrigger asChild>
            <span>
              <Reaction
              ref={ref}
              isActivated={r.isActivated}
              count={r.count}
              onReactionAdded={() => props.onReactionAdded(r.symbol)}
              onReactionRemoved={() => props.onReactionRemoved(r.symbol)}
              symbol={r.symbol}/>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <Button onClick={() => setIsDialogOpen(true)} variant={"link"} className="h-2 text-[12px] p-0 leading-0">Who reacted?</Button>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <Card>
          <CardContent className="flex flex-col gap-2 py-2">
            <div className="flex flex-row gap-2">
              {reactionElements.map((r) => <Button onClick={() => setCurrentReactionInDialog(r.symbol)} size={"icon"} variant={"outline"}>{r.symbol}</Button>)}
            </div>
            <Separator/>
            <div className="flex flex-col">
              {props.reactions.filter(r => r.symbol == currentReactionInDialog).map((r) => <span>{r.authorHexId}</span>)}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  </>);
})

export default ReactionBar;
