import UserService from "@/entities/User/api/UserService";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import { toast } from "@/shared/lib/hooks/useToast";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import HexId from "@/shared/ui/HexId";
import { Input } from "@/shared/ui/Input";
import { Separator } from "@/shared/ui/Separator"
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveAllIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useContextSelector } from "use-context-selector"
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2, "Username has to be at least 2 characters long!").max(50)
})

function AccountSettings() {
  let { isDesktop } = useResponsiveness();
  let currentUser = useContextSelector(CurrentUserContext, c => c.currentUser);
  let updateCurrentUser = useContextSelector(CurrentUserContext, c => c.updateCurrentUser);

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
    navigator.clipboard.writeText(currentUser!.hexId!.toString()!);
    toast({
      title: "Copied!",
      description: "Hex copied to the clipboard successfully!",
    });
  }

  function onSave(values: z.infer<typeof formSchema>) {
    if (currentUser?.username != values.username && values.username) {
      UserService.ChangeUsername({ newName: values.username })
        .then(() => {
          updateCurrentUser();
          toast({
            title: "Updated!",
            description: "The profile was updated successfully!",
          });
        });
    }
  }

  function resetForm() {
    form.reset();
  }

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Account</span>
      <Separator/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className={cn("flex flex-col gap-3.5", isDesktop && "max-w-[50%]")}>
          {currentUser?.hexId && 
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Colir Id (aka. Hex Id)</span>
              <HexId onSelected={handleHexClick} className="w-fit text-primary font-semibold" color={currentUser?.hexId} />
              <span className="text-slate-500 text-sm">*It can’t be changed</span>
            </div>
          }
          {currentUser &&
            <FormField name="username" control={form.control} render={({ field }) => (
              <FormItem className="flex flex-col gap-1.5">
                <FormLabel className="text-sm font-medium">Username</FormLabel>
                <FormControl><Input autoComplete="off" className="-translate-x-[1px]" placeholder="Username" {...field} /></FormControl>
                <FormDescription className="text-slate-500 text-sm">Name that is displayed to everyone</FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
          }
          <div className="flex flex-row gap-2.5">
            <Button disabled={!form.formState.isDirty} type="submit"><SaveAllIcon className="mr-2 h-4 w-4"/> Save</Button>
            <Button disabled={!form.formState.isDirty} type="button" onClick={resetForm} variant={"outline"}>Reset</Button>
          </div>
          <Button className="w-fit" variant={"destructive"}><Trash2Icon className="mr-2 h-4 w-4"/>Delete account</Button>
        </form>
      </Form>
    </div>
  )
}

export default AccountSettings