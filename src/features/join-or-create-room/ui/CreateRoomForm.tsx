import { CreateRoomModel } from "@/entities/Room/model/request/CreateRoomModel";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { Button } from "@/shared/ui/Button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  roomName: z.string().min(2).max(50),
  encryptionKey: z.string().min(2),
  expiryTime: z.string()
});

function CreateRoomForm({ onSend }: { onSend: (model: CreateRoomModel) => any }) {
  const t = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: "",
      encryptionKey: "",
      expiryTime: "7-days"
    }
  });

  function getMinutesBeforeExpiry(inputValue: string) {
    switch (inputValue) {
      case "12-hours":
        return 1;
      case "24-hours":
        return 24 * 60;
      case "7-days":
        return 7 * 24 * 60;
      case "1-month":
        return 30 * 24 * 60;
      case "1-year":
        return 365 * 24 * 60;
      default:
        return undefined;
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Submit logic
    onSend({ name: values.roomName, minutesToLive: getMinutesBeforeExpiry(values.expiryTime), encryptionKey: values.encryptionKey });
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{t("CREATE_ROOM")}</CardTitle>
        <CardDescription>{t("YOU_CAN_CREATE_OWN_ROOM_AND_SHARE_GUID")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              name="roomName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t("NAME_FOR_ROOM")}</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" id="roomName" placeholder={t("ROOM_NAME_PLACEHOLDER")} {...field} />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">{t("NAME_WILL_BE_DISPLAYED_FOR_JOINED_USERS")}</FormDescription>
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
                      <Input type="text" autoComplete="off" id="encryptionKey" placeholder={t("SOMETHING_SECRET_HERE")} className="pl-7 password" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription className="text-slate-500 text-sm">
                    {t("ENTER_KEY_FOR_ENCRYPTION_DECRYPTION")}{" "}
                    <Link className="underline" to={"/"}>
                      {t("WHY")}
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="expiryTime"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label>{t("EXPIRE_IN")}</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("EXPIRY_DATE")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("ROOM_EXPIRY_DATE")}</SelectLabel>
                        <SelectItem value="12-hours">12 {t("HOURS")}</SelectItem>
                        <SelectItem value="24-hours">24 {t("HOURS")}</SelectItem>
                        <SelectItem value="7-days">7 {t("DAYS")}</SelectItem>
                        <SelectItem value="1-month">1 {t("MONTH")}</SelectItem>
                        <SelectItem value="1-year">1 {t("YEAR")}</SelectItem>
                        <SelectItem value="never">{t("NEVER")}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span className="text-slate-500 text-sm">{t("SELECT_TIME_LEFT_UNTIL_ROOM_EXPIRES")}</span>
                </FormItem>
              )}
            />
            <Button>{t("CREATE")}</Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}

export default CreateRoomForm;
