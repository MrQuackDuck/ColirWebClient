import React, { useState } from "react";
import { UserModel } from "../model/UserModel";
import { decimalToHexString } from "@/shared/lib/utils";
import Moment from "moment";
import { Button } from "@/shared/ui/Button";
import { GavelIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/Card";
import RoomService from "@/entities/Room/api/RoomService";
import AuthTypeBadge from "@/shared/ui/AuthTypeBadge";
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider";
import { useContextSelector } from "use-context-selector";
import { CurrentUserContext } from "../lib/providers/CurrentUserProvider";

interface UserPopupProps {
  user?: UserModel;
  colorString: string;
}

const UserPopup = React.memo(function UserPopup({ 
  user, 
  colorString 
}: UserPopupProps) {
  const currentUser = useContextSelector(CurrentUserContext, c => c.currentUser);
  const selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  const [isKickConfirmationShown, setIsKickConfirmationShown] = useState(false);

  const kickButtonDisplayed: boolean = 
    currentUser?.hexId === selectedRoom?.owner?.hexId && // Only the owner can kick
    currentUser.hexId !== user?.hexId && // Can't kick yourself
    user?.authType != null && // Can't kick unknown users
    selectedRoom.joinedUsers.find(u => u.hexId === user?.hexId) != null; // User must be in the room

  function kickUser() {
    RoomService.KickMember({
      roomGuid: selectedRoom.guid, 
      targetHexId: user?.hexId!
    }).then(() => {
      setIsKickConfirmationShown(false);
    });
  }

  function formatDate(date?: Date) {
    if (!date) return "Unknown Date";
    const givenDate = Moment(date);
    return givenDate.format("MM/DD/YYYY");
  }

  return (
    <>
      <p style={{ color: colorString }}>{user?.username ?? "Unknown User"}</p>
      <AuthTypeBadge authType={user?.authType} />
      <div className="text-sm text-primary/80">
        <p><span className="font-medium">Colir ID</span>: {user ? decimalToHexString(user.hexId) : "Unknown"}</p>
        <p><span className="font-medium">Registration Date</span>: {formatDate(user?.registrationDate)}</p>
      </div>
      {kickButtonDisplayed && (
        <Button 
          onClick={() => setIsKickConfirmationShown(true)} 
          className="mt-2 w-full" 
          variant="destructive"
        >
          <GavelIcon className="mr-2 h-4 w-4" /> Kick
        </Button>
      )}

      {kickButtonDisplayed && (
        <Dialog
          open={isKickConfirmationShown}
          onOpenChange={setIsKickConfirmationShown}
        >
          <DialogContent>
            <DialogTitle className="hidden" />
            <DialogDescription className="hidden" />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Are you sure?</CardTitle>
                <CardDescription>
                  You are about to kick <span className="font-semibold">{user?.username}</span> from the room.
                </CardDescription>
                <CardContent className="px-0 py-1">
                  <div className="pt-2 flex flex-row gap-2">
                    <Button
                      onClick={() => setIsKickConfirmationShown(false)}
                      className="w-[100%]"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={kickUser}
                      className="w-[100%]"
                      variant="destructive"
                    >
                      Confirm
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

export default UserPopup;