import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTranslation } from "@/shared/lib";
import { Button, CardContent, CardHeader, CardTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Separator } from "@/shared/ui";

function ChooseDisplayNameForm({ onProceed, onBack, username }: { onProceed: (chosenUsername) => void; onBack: () => void; username?: string }) {
  const t = useTranslation();

  const formSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: t("USERNAME_MUST_BE_AT_LEAST_N_CHARACTERS", 2)
      })
      .max(50, {
        message: t("USERNAME_CANT_BE_LONGER_THAN_N_CHARACTERS", 50)
      })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: username ?? ""
    }
  });

  function back(e) {
    e.preventDefault();
    onBack();
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onProceed(values.username);
  }

  return (
    <div className="animate-appearance opacity-25">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-row justify-between items-center">
          <Button onClick={back} variant={"outline"} className="w-9 h-9" size={"icon"}>
            <ArrowLeftIcon strokeWidth={2.5} className="h-4 w-4" />
          </Button>
          <CardTitle className="text-[20px]">{t("CHOOSE_DISPLAY_NAME")}</CardTitle>
          <Button variant={"outline"} className="invisible" size={"icon"}>
            Boilerplate
          </Button>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2.5">
            <FormField
              control={form.control}
              name="username"
              defaultValue={username}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t("DISPLAY_NAME")}</FormLabel>
                  <FormControl>
                    <Input autoFocus autoComplete="off" placeholder={t("COOL_NAME_GOES_HERE")} {...field} />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">{t("ENTER_DISPLAY_NAME")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>
              {t("CONTINUE")} <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}

export default ChooseDisplayNameForm;
