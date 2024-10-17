import { CreateRoomModel } from "@/entities/Room/model/request/CreateRoomModel";
import { Button } from "@/shared/ui/Button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/Card";
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

function CreateRoomForm({onSend}: {onSend: (model: CreateRoomModel) => any}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: "",
      encryptionKey: "",
      expiryTime: "7-days"
    }
  })

  function getMinutesBeforeExpiry(inputValue: string) {
    switch (inputValue) {
      case "12-hours": return 12 * 60;
      case "24-hours": return  24 * 60;
      case "7-days": return 7 * 24 * 60;
      case "1-month": return 30 * 24 * 60;
      case "1-year": return 365 * 24 * 60;
      default: return undefined;
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Submit logic
    onSend({ name: values.roomName, minutesToLive: getMinutesBeforeExpiry(values.expiryTime), encryptionKey: values.encryptionKey });
  }

  return (<>
    <CardHeader>
      <CardTitle>Create a Room</CardTitle>
      <CardDescription>You can create your own room and share its GUID with someone else to join there. You'll get the GUID once the room is created.</CardDescription>
    </CardHeader>
    <CardContent>
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField name="roomName" control={form.control} render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Name for a room</FormLabel>
                <FormControl><Input autoComplete="off" id="roomName" placeholder="super cool name #1" {...field} /></FormControl>
                <FormDescription className="text-slate-500 text-sm">Name that will be displayed for joined users</FormDescription>
                <FormMessage />
              </FormItem>
            )}/>

          <FormField name="encryptionKey" control={form.control} render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Encryption Key</FormLabel>
                <div className="relative flex items-center">
                  <KeyIcon strokeWidth={2.5} className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"/>
                  <FormControl><Input type="password" autoComplete="off" id="encryptionKey" placeholder="something-secret-here" className="pl-7" {...field}/></FormControl>
                </div>
                <FormDescription className="text-slate-500 text-sm">
                  Enter the key used to encrypt/decrypt messages across the
                  selected room. <Link className="underline" to={"/"}>Why?</Link>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}/>

          <FormField name="expiryTime" control={form.control} render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>Expire in...</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Expiry date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Room expiry date</SelectLabel>
                      <SelectItem value="12-hours">12 hours</SelectItem>
                      <SelectItem value="24-hours">24 hours</SelectItem>
                      <SelectItem value="7-days">7 days</SelectItem>
                      <SelectItem value="1-month">1 month</SelectItem>
                      <SelectItem value="1-year">1 year</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                  </Select>
                  <span className="text-slate-500 text-sm">Select how much time is left once a room is created</span>
                </FormItem>
          )} />
          <Button>Create</Button>
        </form>
      </Form>
    </CardContent>
  </>)
}

export default CreateRoomForm