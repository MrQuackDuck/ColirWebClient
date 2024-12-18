import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContextSelector } from "use-context-selector";

import { JoinedRoomsContext } from "@/entities/Room";
import { cn, LoadingContext } from "@/shared/lib";
import { Card } from "@/shared/ui";

import { AuthService } from "../lib/AuthService";
import { AuthContext } from "../lib/providers/AuthProvider";
import AnonymousLoginForm from "./AnonymousLoginForm";
import ChooseAuthMethodForm from "./ChooseAuthMethodForm";
import OAuth2LoginForm from "./OAuth2LoginForm";

type AuthorizationType = "Anonymous" | "Google" | "GitHub" | null;

export function AuthForm({ className }: { className?: string }) {
  const [authType, setAuthType] = useState<AuthorizationType>(null);
  const [queueToken, setQueueToken] = useState("");
  const [queryParams] = useSearchParams();
  const enableLoading = useContextSelector(LoadingContext, (c) => c.enableLoading);
  const disableLoading = useContextSelector(LoadingContext, (c) => c.disableLoading);
  const authorize = useContextSelector(AuthContext, (c) => c.authorize);
  const navigate = useNavigate();
  const updateRooms = useContextSelector(JoinedRoomsContext, (c) => c.updateRooms);

  useEffect(() => {
    enableLoading();
    const code = queryParams.get("code");
    const state = queryParams.get("state");

    const processResponse = (responsePromise: Promise<AxiosResponse>, authType: AuthorizationType) => {
      responsePromise
        .then((response) => {
          if ("queueToken" in response.data) {
            setQueueToken(response.data.queueToken);
            setAuthType(authType);
          } else if ("jwtToken" in response.data && "refreshToken" in response.data) authorize(response.data.jwtToken, response.data.refreshToken);
        })
        .catch(() => {
          navigate("/");
        })
        .finally(() => {
          updateRooms();
          disableLoading();
        });
    };

    // Checking for query params (if redirected from OAuth2 service)
    if (code && state && window.location.href.includes("githubAuth")) {
      processResponse(AuthService.ExchangeGitHubCode(code, state), "GitHub");
      return;
    }

    if (code && state && window.location.href.includes("googleAuth")) {
      processResponse(AuthService.ExchangeGoogleCode(code, state), "Google");
      return;
    }

    disableLoading();
  }, []);

  function getForm() {
    if (authType === null) return <ChooseAuthMethodForm onAnonymousMethodChosen={() => setAuthType("Anonymous")} />;
    if (authType === "Anonymous")
      return (
        <AnonymousLoginForm
          onBack={() => {
            setAuthType(null);
          }}
        />
      );
    if (authType === "GitHub")
      return (
        <OAuth2LoginForm
          queueToken={queueToken}
          onBack={() => {
            setAuthType(null);
          }}
        />
      );
    if (authType === "Google")
      return (
        <OAuth2LoginForm
          queueToken={queueToken}
          onBack={() => {
            setAuthType(null);
          }}
        />
      );
  }

  return (
    <>
      <Card className={cn("w-[100%] max-w-[480px]", className)}>{getForm()}</Card>
    </>
  );
}
