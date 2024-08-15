import { toast } from "@/shared/ui/use-toast";

export const showErrorToast = (title?, description?) => {
  toast({
    variant: "destructive",
    title: title ?? "Uh oh! Something went wrong.",
    description: description ?? "There was a problem with your request.",
  });
}