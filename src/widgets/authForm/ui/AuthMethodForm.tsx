import { CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { UserIcon } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "@/shared/ui/Separator";
import GoogleLogoIcon from "@/shared/ui/GoogleLogoIcon";

function AuthMethodForm({onProceed} : {onProceed : () => void}) {
  function proceeded(e) {
    e.preventDefault();
    onProceed();
  }

  return (
    <>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-[20px]">Authentication method</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 pb-4">
        <Button onClick={proceeded} variant={"outline"}>
          <UserIcon strokeWidth={2.5} className="mr-2 h-4 w-4" /> Stay anonymous
        </Button>
        <span className="text-[12px] pb-2 leading-3">
          * Rooms you’ve joined will stay only in your browser memory
        </span>
        <Button>
          <GitHubLogoIcon className="mr-2 h-4 w-4" /> Login via GitHub
        </Button>
        <Button>
          <GoogleLogoIcon className="mr-2 h-4 w-4" /> Login via Google
        </Button>
        <Button variant={"link"} className="mr-auto py-[1px] leading-0">
          Why auth?
        </Button>
      </CardContent>
    </>
  );
}

export default AuthMethodForm;
