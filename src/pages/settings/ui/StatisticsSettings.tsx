import UserService from "@/entities/User/api/UserService";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { showInfoToast } from "@/shared/lib/showInfoToast";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shared/ui/Form";
import { Separator } from "@/shared/ui/Separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveAllIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useContextSelector } from "use-context-selector";
import { z } from "zod";

const formSchema = z.object({
  statsDisabled: z.boolean()
});

function StatisticsSettings() {
  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  let updateCurrentUser = useContextSelector(CurrentUserContext, (c) => c.updateCurrentUser);
  let userSettings = currentUser?.userSettings;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statsDisabled: !userSettings?.statisticsEnabled
    }
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        statsDisabled: !currentUser.userSettings.statisticsEnabled
      });
    }
  }, [currentUser, form]);

  function resetForm() {
    form.reset();
  }

  function onSave(values: z.infer<typeof formSchema>) {
    if (currentUser?.userSettings.statisticsEnabled !== !values.statsDisabled) {
      currentUser!.userSettings.statisticsEnabled = !values.statsDisabled;
      UserService.ChangeSettings(currentUser!.userSettings).then(() => {
        updateCurrentUser();
        showInfoToast("Updated!", "The profile was updated successfully!");
      });
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Statistics</span>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="flex flex-col gap-3.5 max-w-[48rem]">
          <FormField
            name="statsDisabled"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-1.5 pt-2">
                <FormControl>
                  <Checkbox id="disableStats" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel htmlFor="disableStats" className="select-none cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !mt-[1px]">
                  Disable stats
                </FormLabel>
              </FormItem>
            )}
          />
          <Link className="text-sm underline" to={"/"}>
            How stats works?
          </Link>
          <div className="flex flex-row gap-2.5">
            <Button disabled={!form.formState.isDirty} type="submit">
              <SaveAllIcon className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button disabled={!form.formState.isDirty} onClick={resetForm} type="button" variant={"outline"}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default StatisticsSettings;
