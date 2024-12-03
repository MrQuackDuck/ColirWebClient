import { toast } from "./useToast";
import { useTranslation } from "./useTranslation";

export const useErrorToast = () => {
  const t = useTranslation();

  const showErrorToast = (title?, description?) => {
    toast({
      variant: "destructive",
      title: title ?? t("SOMETHING_WENT_WRONG"),
      description: description ?? t("THERE_WAS_A_PROBLEM_WITH_YOUR_REQUEST")
    });
  };

  return showErrorToast;
};
