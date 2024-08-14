import { toast } from "@/shared/ui/use-toast";

export const showErrorToast = () => {
  toast({
    variant: "destructive",
    title: "Uh oh! Something went wrong.",
    description: "There was a problem with your request.",
  });
}