import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContextSelector } from "use-context-selector";

import { API_URL } from "@/shared/api";
import { useErrorToast } from "@/shared/lib";
import { SignalRHubResult, SignalRResultType } from "@/shared/model";

import { AuthContext } from "../lib/providers/AuthProvider";
import ChooseColirIdForm from "./ChooseColirIdForm";
import ChooseDisplayNameForm from "./ChooseDisplayNameForm";

function OAuth2LoginForm({ queueToken, onBack }: { queueToken: string; onBack: () => void }) {
  const showErrorToast = useErrorToast();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [authConnection, setAuthConnection] = useState<HubConnection>();
  const [proposedHexs, setProposedHexs] = useState<number[]>();
  const authorize = useContextSelector(AuthContext, (c) => c.authorize);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthConnection(new HubConnectionBuilder().withUrl(`${API_URL}/Registration?queueToken=${queueToken}`).configureLogging(LogLevel.Information).build());
  }, []);

  // Registering handlers
  useEffect(() => {
    authConnection?.on("ReceiveHexsList", (response) => {
      setProposedHexs(response);
    });
  }, [authConnection]);

  const usernameChosen = async (username) => {
    setUsername(username);
    const sendSignalAndProceedToNextStep = () => {
      authConnection
        ?.invoke<SignalRHubResult<any>>("ChooseUsername", username)
        .then((response) => {
          if (response.resultType === SignalRResultType.Error) throw Error();
          setStep(1);
        })
        .catch((e) => {
          console.error(e);
          showErrorToast();
        });
    };

    // Start the connection if not connected yet
    if (authConnection?.state === HubConnectionState.Disconnected) {
      return authConnection.start().then(() => {
        sendSignalAndProceedToNextStep();
      });
    }

    // Send a signal that the username is chosen and proceed to the next step
    sendSignalAndProceedToNextStep();
  };

  const regenerateHexs = () => {
    authConnection
      ?.invoke<SignalRHubResult<any>>("RegenerateHexs")
      .then((response) => {
        if (response.resultType === SignalRResultType.Error) throw Error;
        setProposedHexs(response.content as number[]);
      })
      .catch(showErrorToast);
  };

  const colorChosen = (color) => {
    authConnection
      ?.invoke<SignalRHubResult<any>>("ChooseHex", color)
      .then(() => finish())
      .catch(showErrorToast);
  };

  const finish = () => {
    authConnection
      ?.invoke<SignalRHubResult<any>>("FinishRegistration")
      .then((response) => {
        if (response.resultType === SignalRResultType.Error) throw Error;
        const jwtToken = response.content["jwtToken"].toString();
        const refreshToken = response.content["refreshToken"].toString();
        authorize(jwtToken, refreshToken);
        navigate("/");
      })
      .catch(showErrorToast);
  };

  return (
    <>
      {step === 0 && <ChooseDisplayNameForm onProceed={usernameChosen} onBack={onBack} username={username} />}

      {step === 1 && <ChooseColirIdForm onProceed={colorChosen} onRegenerate={regenerateHexs} colors={proposedHexs ?? []} onBack={() => setStep(0)} />}
    </>
  );
}

export default OAuth2LoginForm;
