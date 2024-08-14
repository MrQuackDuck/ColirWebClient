import { CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "@/shared/ui/Separator";
import GoogleLogoIcon from "@/shared/ui/GoogleLogoIcon";
import AuthService from "../../../entities/User/api/AuthService";
import { toast } from "@/shared/ui/use-toast";
import redirect from "../lib/redirect";
import { showErrorToast } from "../lib/showErrorToast";
import { useLoading } from "@/shared/lib/hooks/useLoading";
import { UserIcon } from "lucide-react";

function ChooseAuthMethodForm({onAnonymousMethodChosen}: {onAnonymousMethodChosen : () => void}) {
  const { enableLoading, disableLoading } = useLoading();

  const gitHubAuth = () => {
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

  const googleAuth = () => {
    AuthService.GetGoogleAuthLink()
    .then(response => {
      redirect(response.data);
    })
    .catch(() => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    })
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
        <Button onClick={gitHubAuth}>
          <GitHubLogoIcon className="mr-2 h-4 w-4" /> Login via GitHub
        </Button>
        <Button  onClick={googleAuth}>
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