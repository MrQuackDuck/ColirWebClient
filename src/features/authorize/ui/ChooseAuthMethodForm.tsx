import { CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "@/shared/ui/Separator";
import GoogleLogoIcon from "@/shared/ui/GoogleLogoIcon";
import AuthService from "../lib/AuthService";
import redirect from "../lib/redirect";
import { UserIcon } from "lucide-react";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";
import { useContextSelector } from "use-context-selector";
import { Button } from "@/shared/ui/Button_";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { FaqControlContext } from "@/features/open-close-faq/libs/providers/FaqControlProvider";
import { FaqTabs } from "@/pages/faq/model/FaqTabs";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";

function ChooseAuthMethodForm({ onAnonymousMethodChosen }: { onAnonymousMethodChosen: () => void }) {
  const t = useTranslation();
  const showErrorToast = useErrorToast();
  const setIsFaqOpen = useContextSelector(FaqControlContext, (c) => c.setIsFaqOpen);
  const setSelectedFaqTab = useContextSelector(FaqControlContext, (c) => c.setSelectedFaqTab);
  let enableLoading = useContextSelector(LoadingContext, (c) => c.enableLoading);
  let disableLoading = useContextSelector(LoadingContext, (c) => c.disableLoading);

  const authenticateViaGitHub = () => {
    enableLoading();
    AuthService.GetGithubAuthLink()
      .then((response) => {
        redirect(response.data);
      })
      .catch(() => {
        showErrorToast();
      })
      .finally(() => {
        disableLoading();
      });
  };

  const authenticateViaGoogle = () => {
    enableLoading();
    AuthService.GetGoogleAuthLink()
      .then((response) => {
        redirect(response.data);
      })
      .catch(() => {
        showErrorToast();
      })
      .finally(() => {
        disableLoading();
      });
  };

  const handleWhyAuthLinkButtonClick = (e) => {
    e.preventDefault();
    setSelectedFaqTab(FaqTabs.WhyDoYouNeedAuth);
    setIsFaqOpen(true);
  };

  return (
    <div className="animate-appearance opacity-25">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-[20px]">{t("AUTHENTICATION_METHOD")}</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pb-4">
        <Button onClick={onAnonymousMethodChosen} variant={"outline"}>
          <UserIcon strokeWidth={2.5} className="mr-2 h-4 w-4" /> {t("STAY_ANONYMOUS")}
        </Button>
        <span className="text-[12px] pb-2 leading-3">{t("YOU_WILL_GET_SINGLE_SESSION_ACCOUNT")}</span>
        <Button onClick={authenticateViaGitHub}>
          <GitHubLogoIcon className="mr-2 h-4 w-4" /> {t("LOGIN_VIA_GITHUB")}
        </Button>
        <Button onClick={authenticateViaGoogle}>
          <GoogleLogoIcon className="mr-2 h-4 w-4" /> {t("LOGIN_VIA_GOOGLE")}
        </Button>
        <Button onClick={handleWhyAuthLinkButtonClick} variant={"link"} className="mr-auto px-0 py-[1px] leading-0">
          {t("WHY_AUTH")}
        </Button>
      </CardContent>
    </div>
  );
}

export default ChooseAuthMethodForm;
