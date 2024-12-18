import { zodResolver } from "@hookform/resolvers/zod";
import { SaveAllIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useContextSelector } from "use-context-selector";
import { z } from "zod";

import { CurrentUserContext, UserService } from "@/entities/User";
import { FaqControlContext } from "@/features/control-faq";
import { useInfoToast, useTranslation } from "@/shared/lib";
import { FaqTabs } from "@/shared/model";
import { Button, Checkbox, Form, FormControl, FormField, FormItem, FormLabel, Separator } from "@/shared/ui";

const formSchema = z.object({
  statsDisabled: z.boolean()
});

function StatisticsSettings() {
  const t = useTranslation();
  const showInfoToast = useInfoToast();

  const setIsFaqOpen = useContextSelector(FaqControlContext, (c) => c.setIsFaqOpen);
  const setSelectedFaqTab = useContextSelector(FaqControlContext, (c) => c.setSelectedFaqTab);

  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const updateCurrentUser = useContextSelector(CurrentUserContext, (c) => c.updateCurrentUser);
  const userSettings = currentUser?.userSettings;

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
        showInfoToast(t("UPDATED"), t("PROFILE_UPDATED_SUCCESSFULLY"));
      });
    }
  }

  function handleHowStatsWorkLinkClick(e) {
    e.preventDefault();
    setSelectedFaqTab(FaqTabs.HowStatsWork);
    setIsFaqOpen(true);
  }

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">{t("STATISTICS")}</span>
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
                  {t("DISABLE_STATS")}
                </FormLabel>
              </FormItem>
            )}
          />
          <Link onClick={handleHowStatsWorkLinkClick} className="text-sm underline" to={"/"}>
            {t("HOW_STATS_WORK")}
          </Link>
          <div className="flex flex-row gap-2.5">
            <Button disabled={!form.formState.isDirty} type="submit">
              <SaveAllIcon className="mr-2 h-4 w-4" /> {t("SAVE")}
            </Button>
            <Button disabled={!form.formState.isDirty} onClick={resetForm} type="button" variant={"outline"}>
              {t("RESET")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default StatisticsSettings;
