import UserService from "@/entities/User/api/UserService";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import { cn, decimalToHexString } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import HexId from "@/shared/ui/HexId";
import { Input } from "@/shared/ui/Input";
import { Separator } from "@/shared/ui/Separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useContextSelector } from "use-context-selector";
import { z } from "zod";
import AccountDeleteConfirmationDialog from "./AccountDeleteConfirmationDialog";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";
import { AuthContext } from "@/features/authorize/lib/providers/AuthProvider";
import { SaveAllIcon, Trash2Icon } from "lucide-react";
import { SettingsOpenCloseContext } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import { showInfoToast } from "@/shared/lib/showInfoToast";

const formSchema = z.object({
  username: z.string().min(2, "Username has to be at least 2 characters long!").max(50)
});

interface AccountSettingsProps {
  dialogOpenClosed: (newState: boolean) => void;
}

function AccountSettings(props: AccountSettingsProps) {
  let { isDesktop } = useResponsiveness();
  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  let updateCurrentUser = useContextSelector(CurrentUserContext, (c) => c.updateCurrentUser);
  let [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  let enableLoading = useContextSelector(LoadingContext, (c) => c.enableLoading);
  let disableLoading = useContextSelector(LoadingContext, (c) => c.disableLoading);
  let setIsSettingsOpen = useContextSelector(SettingsOpenCloseContext, (c) => c.setIsOpen);
  let logOut = useContextSelector(AuthContext, (c) => c.logOut);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUser?.username
    }
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser.username
      });
    }
  }, [currentUser, form]);

  function handleHexClick() {
    navigator.clipboard.writeText(decimalToHexString(currentUser!.hexId));
    showInfoToast("Copied!", "Hex copied to the clipboard successfully!");
  }

  function onSave(values: z.infer<typeof formSchema>) {
    if (currentUser?.username != values.username && values.username) {
      UserService.ChangeUsername({ newName: values.username }).then(() => {
        updateCurrentUser();
        showInfoToast("Updated!", "The profile was updated successfully!");
      });
    }
  }

  function resetForm() {
    form.reset();
  }

  function handleDeleteButton() {
    setIsDeleteDialogOpen(true);
    props.dialogOpenClosed(true);
  }

  function handleDeleteConfirmation() {
    setIsSettingsOpen(false);
    enableLoading();
    setIsDeleteDialogOpen(false);
    props.dialogOpenClosed(false);
    UserService.DeleteAccount().then(() => {
      disableLoading();
      logOut();
      showInfoToast("Deleted!", "The account was deleted successfully!");
    });
  }

  function handleCancel() {
    setIsDeleteDialogOpen(false);
    props.dialogOpenClosed(false);
  }

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Account</span>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className={cn("flex flex-col gap-3.5", isDesktop && "max-w-[50%]")}>
          {currentUser?.hexId && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Colir Id (aka. Hex Id)</span>
              <HexId onSelected={handleHexClick} className="w-fit text-primary font-semibold" color={currentUser?.hexId} />
              <span className="text-slate-500 text-sm">*It can’t be changed</span>
            </div>
          )}
          {currentUser && (
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="text-sm font-medium">Username</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" className="-translate-x-[1px]" placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">Name that is displayed to everyone</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex flex-row gap-2.5">
            <Button disabled={!form.formState.isDirty} type="submit">
              <SaveAllIcon className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button disabled={!form.formState.isDirty} type="button" onClick={resetForm} variant={"outline"}>
              Reset
            </Button>
          </div>
          <Button onClick={handleDeleteButton} className="w-fit" variant={"destructive"}>
            <Trash2Icon className="mr-2 h-4 w-4" /> Delete account
          </Button>
        </form>
      </Form>

      <AccountDeleteConfirmationDialog hexId={currentUser?.hexId ?? 0} isShown={isDeleteDialogOpen} onConfirm={handleDeleteConfirmation} onCancel={handleCancel} />
    </div>
  );
}

export default AccountSettings;
