import { toast } from "./useToast";
import { useTranslation } from "./useTranslation";

export const useInfoToast = () => {
  const t = useTranslation();

  const showInfoToast = (title?, description?) => {
    toast({
      variant: "default",
      title: title ?? t("INFO"),
      description: description ?? t("THIS_IS_INFO_MESSAGE")
    });
  };

  return showInfoToast;
};
