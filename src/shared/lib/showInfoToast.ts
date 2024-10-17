import { toast } from "./hooks/useToast";

export const showInfoToast = (title?, description?) => {
  toast({
    variant: "default",
    title: title ?? "Info",
    description: description ?? "This is an informational message.",
  });
}