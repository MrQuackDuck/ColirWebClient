import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { Button } from "@/shared/ui/Button";
import HexId from "@/shared/ui/HexId";
import { Input } from "@/shared/ui/Input";
import { Separator } from "@/shared/ui/Separator"
import { SaveAllIcon, Trash2Icon } from "lucide-react";
import { useContextSelector } from "use-context-selector"

function AccountSettings() {
  let currentUser = useContextSelector(CurrentUserContext, c => c.currentUser);

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Account</span>
      <Separator/>
      <div className="flex flex-col gap-3.5 max-w-[50%]">
        {currentUser?.hexId && 
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Colir Id</span>
            <HexId className="w-fit text-primary font-semibold" color={currentUser?.hexId} />
            <span className="text-slate-500 text-sm">*It can’t be changed</span>
          </div>
        }
        {currentUser &&
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Username</span>
            <Input className="-translate-x-[1px]" placeholder="Username" onChange={() => {}} value={currentUser.username} />
            <span className="text-slate-500 text-sm">Name that is displayed to everyone</span>
          </div>
        }
        <div className="flex flex-row gap-2.5">
          <Button><SaveAllIcon className="mr-2 h-4 w-4"/> Save</Button>
          <Button variant={"outline"}>Reset</Button>
        </div>
        <Button className="w-fit" variant={"destructive"}><Trash2Icon className="mr-2 h-4 w-4"/>Delete account</Button>
      </div>
    </div>
  )
}

export default AccountSettings