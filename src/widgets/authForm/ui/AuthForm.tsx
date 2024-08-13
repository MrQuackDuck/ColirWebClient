import { Card } from "@/shared/ui/Card";
import AuthMethodForm from "./AuthMethodForm";
import ChooseDisplayNameForm from "./ChooseDisplayNameForm";
import { useState } from "react";
import AuthService from "../api/AuthService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/shared/ui/use-toast";
import Loader from "@/shared/ui/Loader";

function AuthForm() {
  const [currentStep, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const authorizeAsAnonymous = (username) => {
    setIsLoading(true);
    new AuthService().AnonymousLogin(username)
      .then(response => {
        if (response["status"] !== 200) throw Error;
        let token = response["data"]["jwtToken"];
        localStorage.setItem("jwtToken", token);
        navigate("/chat");
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (<>
    {!isLoading && 
    <Card className="w-[100%] max-w-[480px]">
      {currentStep == 0 && <AuthMethodForm onProceed={() => setStep(1)}/>}
      {currentStep == 1 && <ChooseDisplayNameForm onProceed={authorizeAsAnonymous} onBack={() => setStep(0)}/>}
    </Card>
    }
    {isLoading && <Loader/>}
  </>);
}

export default AuthForm;
