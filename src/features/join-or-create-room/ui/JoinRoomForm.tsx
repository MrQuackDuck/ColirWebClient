import { JoinRoomModel } from "@/entities/Room/model/request/JoinRoomModel";
import { Button } from "@/shared/ui/Button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/Card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  roomGuid: z.string().length(36),
  encryptionKey: z.string().min(2)
});

function JoinRoomForm({ onSend }: { onSend: (model: JoinRoomModel) => any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomGuid: "",
      encryptionKey: ""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Submit logic
    onSend({ roomGuid: values.roomGuid });
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Join the Room</CardTitle>
        <CardDescription>
          To join the room you need to know its GUID and encryption key for
          information encoding/decoding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField name="roomGuid" control={form.control} render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Room GUID</FormLabel>
                <FormControl><Input autoComplete="off" id="roomGuid" placeholder="2b4d41b0-05b5-4c93-ad23-76cb3f46986b" {...field} /></FormControl>
                <FormDescription className="text-slate-500 text-sm">Enter ID of room you want to enter</FormDescription>
                <FormMessage />
              </FormItem>
            )}/>

            <FormField name="encryptionKey" control={form.control} render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Encryption Key</FormLabel>
                <div className="relative flex items-center max-w-2xl ">
                  <KeyIcon strokeWidth={2.5} className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"/>
                  <FormControl><Input type="password" autoComplete="off" id="encryptionKey" placeholder="encryption-key-here" className="pl-7" {...field}/></FormControl>
                </div>
                <FormDescription className="text-slate-500 text-sm">
                  Enter the key used to encrypt/decrypt messages across the
                  selected room. <Link className="underline" to={"/"}>Why?</Link>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}/>
            <Button>Join</Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}

export default JoinRoomForm;
