import { Button } from "@/shared/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/DropdownMenu";
import { GearIcon } from "@radix-ui/react-icons";
import { BarChart3Icon, Undo2Icon, UserIcon } from "lucide-react";

function ProfileButton() {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        className="focus-visible:ring-0 focus-visible:ring-offset-0"
        variant={"outline"}>
        <UserIcon className="mr-2 h-4 w-4" strokeWidth={2} /> Profile
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <GearIcon className="mr-2 h-4 w-4" strokeWidth={2} /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BarChart3Icon className="mr-2 h-4 w-4" strokeWidth={2} /> Stats
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Undo2Icon className="mr-2 h-4 w-4" strokeWidth={2} /> Log out
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default ProfileButton