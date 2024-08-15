import { CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Separator } from "@/shared/ui/Separator";
import { Input } from "@/shared/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/Form";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(50, {
    message: "Username can't be longer than 50 characters!"
  })
});

function ChooseDisplayNameForm({onProceed, onBack, username}: {
  onProceed: (chosenUsername) => void;
  onBack: () => void;
  username?: string;
}) {
  function back(e) {
    e.preventDefault();
    onBack();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: username ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onProceed(values.username);
  }

  return (
    <div className="animate-appearance opacity-25">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-row justify-between items-center">
          <Button
            onClick={back}
            variant={"outline"}
            className="w-9 h-9"
            size={"icon"}
          >
            <ArrowLeftIcon strokeWidth={2.5} className="h-4 w-4" />
          </Button>
          <CardTitle className="text-[20px]">Choose display name</CardTitle>
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
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" placeholder="cool-username-goes-here" {...field} />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">Enter a name you want to be displayed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>
              Continue <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}

export default ChooseDisplayNameForm;
