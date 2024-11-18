import { CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "@/shared/ui/Separator";
import GoogleLogoIcon from "@/shared/ui/GoogleLogoIcon";
import AuthService from "../lib/AuthService";
import redirect from "../lib/redirect";
import { UserIcon } from "lucide-react";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";
import { useContextSelector } from "use-context-selector";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { Button } from "@/shared/ui/Button";

function ChooseAuthMethodForm({onAnonymousMethodChosen}: {onAnonymousMethodChosen : () => void}) {
  let enableLoading = useContextSelector(LoadingContext, c => c.enableLoading);
  let disableLoading = useContextSelector(LoadingContext, c => c.disableLoading);

  const authenticateViaGitHub = () => {
    enableLoading();
    AuthService.GetGithubAuthLink()
    .then(response => {
      redirect(response.data);
    })
    .catch(() => {
      showErrorToast();
    })
    .finally(() => {
      disableLoading();
    });
  }

  const authenticateViaGoogle = () => {
    enableLoading();
    AuthService.GetGoogleAuthLink()
    .then(response => {
      redirect(response.data);
    })
    .catch(() => {
      showErrorToast();
    })
    .finally(() => {
      disableLoading();
    });
  }

  return (
    <div className="animate-appearance opacity-25">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-[20px]">Authentication method</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pb-4">
        <Button onClick={onAnonymousMethodChosen} variant={"outline"}>
          <UserIcon strokeWidth={2.5} className="mr-2 h-4 w-4" /> Stay anonymous
        </Button>
        <span className="text-[12px] pb-2 leading-3">
          * You'll get a single-session account without ability to re-login
        </span>
        <Button onClick={authenticateViaGitHub}>
          <GitHubLogoIcon className="mr-2 h-4 w-4" /> Login via GitHub
        </Button>
        <Button  onClick={authenticateViaGoogle}>
          <GoogleLogoIcon className="mr-2 h-4 w-4" /> Login via Google
        </Button>
        <Button variant={"link"} className="mr-auto px-0 py-[1px] leading-0">
          Why auth?
        </Button>
      </CardContent>
    </div>
  );
}

export default ChooseAuthMethodForm;