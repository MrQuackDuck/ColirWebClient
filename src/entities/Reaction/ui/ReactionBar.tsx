import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";

import { CurrentUserContext, Username, UsersContext } from "@/entities/User";
import { cn, useTranslation } from "@/shared/lib";
import { Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogTitle, Separator, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

import { ReactionModel } from "../model/ReactionModel";
import Reaction from "./Reaction";

interface ReactionBarProps {
  reactions: ReactionModel[];
  onReactionAdded: (symbol: string) => any;
  onReactionRemoved: (symbol: string) => any;
  className?: string;
}

interface ReactionElement {
  id: number;
  symbol: string;
  count: number;
  isActivated: boolean;
}

export const ReactionBar = (props: ReactionBarProps) => {
  const t = useTranslation();
  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const users = useContextSelector(UsersContext, (c) => c.users);
  const [reactionElements, setReactionElements] = useState<ReactionElement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentReactionInDialog, setCurrentReactionInDialog] = useState<string | null>(props.reactions[0]?.symbol);

  function openDialog(reaction: string) {
    setCurrentReactionInDialog(reaction);
    setIsDialogOpen(true);
  }

  useEffect(() => {
    const newReactionElements: ReactionElement[] = [];

    props.reactions.forEach((reaction) => {
      const existingReaction = newReactionElements.find((element) => element.symbol === reaction.symbol);

      if (existingReaction) existingReaction.count++;
      else
        newReactionElements.push({
          id: reaction.id,
          symbol: reaction.symbol,
          count: 1,
          isActivated: false
        });
    });

    newReactionElements.forEach((element) => {
      element.isActivated = props.reactions.find((r) => r.authorHexId == currentUser?.hexId && r.symbol == element.symbol) != undefined;
    });

    setReactionElements(newReactionElements);
  }, [props.reactions, currentUser?.hexId]);

  return (
    <>
      <div className={cn("flex flex-row w-fit gap-1.5 mt-1", props.className)}>
        {reactionElements.map((r) => (
          <Tooltip key={r.symbol}>
            <TooltipTrigger asChild>
              <span>
                <Reaction
                  isActivated={r.isActivated}
                  count={r.count}
                  onReactionAdded={() => props.onReactionAdded(r.symbol)}
                  onReactionRemoved={() => props.onReactionRemoved(r.symbol)}
                  symbol={r.symbol}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent tabIndex={-1}>
              <Button tabIndex={-1} onClick={() => openDialog(r.symbol)} variant={"link"} className="h-2 text-[12px] p-0 leading-0">
                {t("WHO_REACTED")}
              </Button>
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
              <div className="flex flex-row flex-wrap max-w-full gap-2">
                {reactionElements.map((r) => (
                  <Reaction
                    key={r.symbol}
                    isActivated={r.isActivated}
                    count={r.count}
                    onReactionAdded={() => setCurrentReactionInDialog(r.symbol)}
                    onReactionRemoved={() => setCurrentReactionInDialog(r.symbol)}
                    symbol={r.symbol}
                  />
                ))}
              </div>
              <Separator />
              <div className="flex flex-col">
                {props.reactions
                  .filter((r) => r.symbol == currentReactionInDialog)
                  .map((r) => (
                    <div key={r.id} className="flex flex-row gap-1">
                      <Username user={users.find((u) => u.hexId == r.authorHexId)} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};
