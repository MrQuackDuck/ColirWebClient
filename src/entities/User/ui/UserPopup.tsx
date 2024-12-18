import { GavelIcon } from "lucide-react";
import Moment from "moment";
import React, { useState } from "react";
import { useContextSelector } from "use-context-selector";

import { RoomService, SelectedRoomContext } from "@/entities/Room";
import { UsersVolumeContext } from "@/features/control-user-volume";
import { decimalToHexString, useTranslation } from "@/shared/lib";
import { AuthTypeBadge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogTitle, Slider } from "@/shared/ui";

import { CurrentUserContext } from "../lib/providers/CurrentUserProvider";
import { UserModel } from "../model/UserModel";

interface UserPopupProps {
  user?: UserModel;
  colorString: string;
}

export const UserPopup = React.memo(function UserPopup({ user, colorString }: UserPopupProps) {
  const t = useTranslation();
  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const selectedRoom = useContextSelector(SelectedRoomContext, (c) => c.selectedRoom);
  const [isKickConfirmationShown, setIsKickConfirmationShown] = useState(false);
  const setVolumeForUser = useContextSelector(UsersVolumeContext, (c) => c.setVolumeForUser);
  const userVolumes = useContextSelector(UsersVolumeContext, (c) => c.userVolumes);

  const kickButtonDisplayed: boolean =
    currentUser?.hexId === selectedRoom?.owner?.hexId && // Only the owner can kick
    currentUser.hexId !== user?.hexId && // Can't kick yourself
    user?.authType != null && // Can't kick unknown users
    selectedRoom.joinedUsers.find((u) => u.hexId === user?.hexId) != null; // User must be in the room

  function kickUser() {
    if (!user?.hexId) return;
    RoomService.KickMember({
      roomGuid: selectedRoom.guid,
      targetHexId: user?.hexId
    }).then(() => {
      setIsKickConfirmationShown(false);
    });
  }

  function formatDate(date?: Date) {
    if (!date) return t("UNKNOWN_DATE");
    const givenDate = Moment(date);
    return givenDate.format("MM/DD/YYYY");
  }

  function handleSliderChange(value: number[]) {
    setVolumeForUser(user?.hexId ?? 0, value[0]);
  }

  return (
    <>
      <p style={{ color: colorString, lineBreak: "anywhere" }}>{user?.username ?? t("UNKNOWN_USER")}</p>
      <AuthTypeBadge authType={user?.authType} />
      <div className="text-sm text-primary/80">
        <p>
          <span className="font-medium">Colir ID</span>: {user ? decimalToHexString(user.hexId) : t("UNKNOWN_COLIR_ID")}
        </p>
        <p>
          <span className="font-medium">{t("REGISTRATION_DATE")}</span>: {formatDate(user?.registrationDate)}
        </p>
        {currentUser?.hexId != user?.hexId && user?.hexId && (
          <div className="flex flex-row items-center gap-1 pt-1">
            <p className="font-semibold flex-shrink-0">{t("VOLUME")}:</p>
            <Slider className="cursor-pointer" value={[userVolumes[user?.hexId] ?? 50]} onValueChange={handleSliderChange} step={0.1} />
          </div>
        )}
      </div>
      {kickButtonDisplayed && (
        <Button onClick={() => setIsKickConfirmationShown(true)} className="mt-2 w-full" variant="destructive">
          <GavelIcon className="mr-2 h-4 w-4" /> {t("KICK")}
        </Button>
      )}

      {kickButtonDisplayed && (
        <Dialog open={isKickConfirmationShown} onOpenChange={setIsKickConfirmationShown}>
          <DialogContent>
            <DialogTitle className="hidden" />
            <DialogDescription className="hidden" />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("ARE_YOU_SURE")}</CardTitle>
                <CardDescription>
                  {t("YOU_ARE_ABOUT_TO_KICK")} <span className="font-semibold">{user?.username}</span> {t("FROM_THE_ROOM")}
                </CardDescription>
                <CardContent className="px-0 py-1">
                  <div className="pt-2 flex flex-row gap-2">
                    <Button onClick={() => setIsKickConfirmationShown(false)} className="w-[100%]" variant="outline">
                      {t("CANCEL")}
                    </Button>
                    <Button onClick={kickUser} className="w-[100%]" variant="destructive">
                      {t("CONFIRM")}
                    </Button>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
});
