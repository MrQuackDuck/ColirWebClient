import { Card } from "@/shared/ui/Card";
import ChooseAuthMethodForm from "./ChooseAuthMethodForm";
import { useEffect, useState } from "react";
import AuthService from "../lib/AuthService";
import { useNavigate, useSearchParams } from "react-router-dom";
import AnonymousLoginForm from "./AnonymousLoginForm";
import { useLoading } from "@/shared/lib/hooks/useLoading";
import OAuth2LoginForm from "./OAuth2LoginForm";
import { AxiosResponse } from "axios";
import { useAuth } from "../lib/hooks/useAuth";
import { cn } from "@/shared/lib/utils";

type AuthorizationType = "Anonymous" | "Google" | "GitHub" | null;

function AuthForm({className}: {className?: string}) {
  const [authType, setAuthType] = useState<AuthorizationType>(null);
  const [queueToken, setQueueToken] = useState("");
  const [queryParams] = useSearchParams();
  const { enableLoading, disableLoading } = useLoading();
  const { authorize } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    enableLoading();
    let code = queryParams.get("code");
    let state = queryParams.get("state");

    const processResponse = (responsePromise : Promise<AxiosResponse>, authType : AuthorizationType) => {
      responsePromise.then((response) => {
        if ('queueToken' in response.data) {
          setQueueToken(response.data.queueToken);
          setAuthType(authType);
        }
        else if ('jwtToken' in response.data && 'refreshToken' in response.data)
          {
            authorize(response.data.jwtToken, response.data.refreshToken);
          }
      })
      .catch(() => {
        navigate("/");
      })
      .finally(() => {
        disableLoading();
      });
    }

    // Checking for query params (if redirected from OAuth2 service)
    if (code && state && window.location.href.includes("githubAuth"))
    {
      processResponse(AuthService.ExchangeGitHubCode(code, state), "GitHub");
      return;
    }

    if (code && state && window.location.href.includes("googleAuth"))
    {
      processResponse(AuthService.ExchangeGoogleCode(code, state), "Google");
      return;
    }

    disableLoading();
  }, []);

  function getForm() {
    if (authType === null) return <ChooseAuthMethodForm onAnonymousMethodChosen={() => setAuthType("Anonymous")}/>
    if (authType === "Anonymous") return <AnonymousLoginForm onBack={() => {setAuthType(null)}}/>
    if (authType === "GitHub") return <OAuth2LoginForm queueToken={queueToken} onBack={() => {setAuthType(null)}}/>
    if (authType === "Google") return <OAuth2LoginForm queueToken={queueToken} onBack={() => {setAuthType(null)}}/>
  }

  return (<>
    <Card className={cn("w-[100%] max-w-[480px]", className)}>
      {getForm()}
    </Card>
  </>);
}

export default AuthForm;