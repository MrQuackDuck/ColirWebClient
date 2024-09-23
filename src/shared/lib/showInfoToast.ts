import { toast } from "@/shared/ui/use-toast";

export const showInfoToast = (title?, description?) => {
  toast({
    variant: "default",
    title: title ?? "Info",
    description: description ?? "This is an informational message.",
  });
}