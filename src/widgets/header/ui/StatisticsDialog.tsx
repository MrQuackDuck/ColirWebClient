import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Separator } from "@/shared/ui/Separator";
import { UserStatisticsModel } from "@/entities/User/model/UserStatisticsModel";
import { useContextSelector } from "use-context-selector";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { useEffect, useState } from "react";
import UserService from "@/entities/User/api/UserService";

interface StatisticsDialogProps {
  isStatsOpen: boolean;
  setIsStatsOpen: (value: boolean) => void;
}

function StatisticsDialog({ isStatsOpen, setIsStatsOpen }: StatisticsDialogProps) {
  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  let [statistics, setStatistics] = useState<UserStatisticsModel | undefined>(currentUser?.userStatistics);

  useEffect(() => {
    if (!isStatsOpen) return;
    UserService.GetStatistics().then((response) => {
      setStatistics(response.data);
    });
  }, [isStatsOpen]);

  return (
    <Dialog data-no-focus-lock open={isStatsOpen} onOpenChange={setIsStatsOpen}>
      <DialogContent data-no-focus-lock>
        <DialogTitle data-no-focus-lock className="hidden" />
        <DialogDescription data-no-focus-lock className="hidden" />
        <Card>
          <CardHeader className="flex flex-col gap-2 pb-2">
            <CardTitle>Your stats</CardTitle>
            <Separator orientation="horizontal" />
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {statistics && (
              <>
                <span>
                  Seconds spent speaking: <b>{statistics.secondsSpentInVoice} sec</b>
                </span>
                <span>
                  Reactions set: <b>{statistics.reactionsSet}</b>
                </span>
                <span>
                  Messages sent: <b>{statistics.messagesSent}</b>
                </span>
                <span>
                  Rooms joined: <b>{statistics.roomsJoined}</b>
                </span>
                <span>
                  Rooms created: <b>{statistics.roomsCreated}</b>
                </span>
              </>
            )}
            <Button onClick={() => setIsStatsOpen(false)} className="mt-0.5" variant={"outline"}>
              No way!
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default StatisticsDialog;
