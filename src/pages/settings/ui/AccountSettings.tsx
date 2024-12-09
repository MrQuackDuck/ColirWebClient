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
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { useInfoToast } from "@/shared/lib/hooks/useInfoToast";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";

interface AccountSettingsProps {
  dialogOpenClosed: (newState: boolean) => void;
}

function AccountSettings(props: AccountSettingsProps) {
  const t = useTranslation();
  const showInfoToast = useInfoToast();
  const showErrorToast = useErrorToast();
  let { isDesktop } = useResponsiveness();
  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  let updateCurrentUser = useContextSelector(CurrentUserContext, (c) => c.updateCurrentUser);
  let [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  let enableLoading = useContextSelector(LoadingContext, (c) => c.enableLoading);
  let disableLoading = useContextSelector(LoadingContext, (c) => c.disableLoading);
  let setIsSettingsOpen = useContextSelector(SettingsOpenCloseContext, (c) => c.setIsOpen);
  let logOut = useContextSelector(AuthContext, (c) => c.logOut);

  const formSchema = z.object({
    username: z.string().min(2, t("USERNAME_MUST_BE_AT_LEAST_N_CHARACTERS", 2)).max(50, t("USERNAME_CANT_BE_LONGER_THAN_N_CHARACTERS", 50))
  });

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
    showInfoToast(t("COPIED"), t("HEX_COPIED_TO_CLIPBOARD"));
  }

  function onSave(values: z.infer<typeof formSchema>) {
    if (currentUser?.username != values.username && values.username) {
      UserService.ChangeUsername({ newName: values.username })
        .then(() => {
          updateCurrentUser();
          showInfoToast(t("UPDATED"), t("PROFILE_UPDATED_SUCCESSFULLY"));
        })
        .catch(() => showErrorToast());
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
      showInfoToast(t("DELETED"), t("ACCOUNT_WAS_DELETED"));
    });
  }

  function handleCancel() {
    setIsDeleteDialogOpen(false);
    props.dialogOpenClosed(false);
  }

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">{t("ACCOUNT")}</span>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className={cn("flex flex-col gap-3.5", isDesktop && "max-w-[50%]")}>
          {currentUser?.hexId && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">{t("COLIR_ID_AKA_HEX_ID")}</span>
              <HexId onSelected={handleHexClick} className="w-fit text-primary font-semibold" color={currentUser?.hexId} />
              <span className="text-slate-500 text-sm">{t("IT_CANT_BE_CHANGED")}</span>
            </div>
          )}
          {currentUser && (
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="text-sm font-medium">{t("USERNAME")}</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" className="-translate-x-[1px]" placeholder={t("USERNAME")} {...field} />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">{t("NAME_DISPLAYED_TO_EVERYONE")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex flex-row gap-2.5">
            <Button disabled={!form.formState.isDirty} type="submit">
              <SaveAllIcon className="mr-2 h-4 w-4" /> {t("SAVE")}
            </Button>
            <Button disabled={!form.formState.isDirty} type="button" onClick={resetForm} variant={"outline"}>
              {t("RESET")}
            </Button>
          </div>
          <Button onClick={handleDeleteButton} className="w-fit" variant={"destructive"}>
            <Trash2Icon className="mr-2 h-4 w-4" /> {t("DELETE_ACCOUNT")}
          </Button>
        </form>
      </Form>

      <AccountDeleteConfirmationDialog hexId={currentUser?.hexId ?? 0} isShown={isDeleteDialogOpen} onConfirm={handleDeleteConfirmation} onCancel={handleCancel} />
    </div>
  );
}

export default AccountSettings;
