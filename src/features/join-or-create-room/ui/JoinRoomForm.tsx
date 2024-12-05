import { JoinRoomModel } from "@/entities/Room/model/request/JoinRoomModel";
import { FaqControlContext } from "@/features/open-close-faq/libs/providers/FaqControlProvider";
import { FaqTabs } from "@/pages/faq/model/FaqTabs";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { Button } from "@/shared/ui/Button_";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useContextSelector } from "use-context-selector";
import { z } from "zod";

function JoinRoomForm({ onSend }: { onSend: (model: JoinRoomModel) => any }) {
  const t = useTranslation();
  const setIsFaqOpen = useContextSelector(FaqControlContext, (c) => c.setIsFaqOpen);
  const setSelectedFaqTab = useContextSelector(FaqControlContext, (c) => c.setSelectedFaqTab);

  const formSchema = z.object({
    roomGuid: z.string().length(36, t("ROOM_GUID_MUST_BE_N_CHARACTERS", 36)),
    encryptionKey: z.string().min(2, t("ENCRYPTION_KEY_MUST_BE_AT_LEAST_N_CHATACTER", 2))
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomGuid: "",
      encryptionKey: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Submit logic
    onSend({ roomGuid: values.roomGuid, encryptionKey: values.encryptionKey });
  }

  const handleWhyLinkClick = (e) => {
    e.preventDefault();
    setSelectedFaqTab(FaqTabs.HowKeysWork);
    setIsFaqOpen(true);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>{t("JOIN_ROOM")}</CardTitle>
        <CardDescription>{t("TO_JOIN_ROOM_YOU_NEED_TO_HAVE_GUID")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              name="roomGuid"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t("ROOM_GUID")}</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" id="roomGuid" placeholder="2b4d41b0-05b5-4c93-ad23-76cb3f46986b" {...field} />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">{t("ENTER_ID_OF_ROOM_TO_ENTER")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="encryptionKey"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t("ENCRYPTION_KEY")}</FormLabel>
                  <div className="relative flex items-center">
                    <KeyIcon strokeWidth={2.5} className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                    <FormControl>
                      <Input type="text" autoComplete="off" id="encryptionKey" placeholder={t("ENCRYPTION_KEY_HERE")} className="pl-7 password" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription className="text-slate-500 text-sm">
                    {t("ENTER_KEY_FOR_ENCRYPTION_DECRYPTION")}{" "}
                    <Link onClick={handleWhyLinkClick} className="underline" to={"/"}>
                      {t("WHY")}
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>{t("JOIN")}</Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}

export default JoinRoomForm;
