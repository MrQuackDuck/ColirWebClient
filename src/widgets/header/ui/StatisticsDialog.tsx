import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";

import { CurrentUserContext, UserService, UserStatisticsModel } from "@/entities/User";
import { useTranslation } from "@/shared/lib";
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogTitle, Separator } from "@/shared/ui";

interface StatisticsDialogProps {
  isStatsOpen: boolean;
  setIsStatsOpen: (value: boolean) => void;
}

function StatisticsDialog({ isStatsOpen, setIsStatsOpen }: StatisticsDialogProps) {
  const t = useTranslation();
  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const [statistics, setStatistics] = useState<UserStatisticsModel | undefined>(currentUser?.userStatistics);

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
            <CardTitle>{t("YOUR_STATS")}</CardTitle>
            <Separator orientation="horizontal" />
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {statistics && (
              <>
                <span>
                  {t("SECONDS_SPENT_SPEAKING")}:{" "}
                  <b>
                    {statistics.secondsSpentInVoice} {t("SEC")}
                  </b>
                </span>
                <span>
                  {t("REACTIONS_SET")}: <b>{statistics.reactionsSet}</b>
                </span>
                <span>
                  {t("MESSAGES_SENT")}: <b>{statistics.messagesSent}</b>
                </span>
                <span>
                  {t("ROOMS_JOINED")}: <b>{statistics.roomsJoined}</b>
                </span>
                <span>
                  {t("ROOMS_CREATED")}: <b>{statistics.roomsCreated}</b>
                </span>
              </>
            )}
            <Button onClick={() => setIsStatsOpen(false)} className="mt-0.5" variant={"outline"}>
              {t("NO_WAY")}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default StatisticsDialog;
