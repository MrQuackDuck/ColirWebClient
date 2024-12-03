import { useEffect, useState } from "react";
import ChooseDisplayNameForm from "./ChooseDisplayNameForm";
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { API_URL } from "@/shared/api";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { SignalRResultType } from "@/shared/model/response/SignalRResultType";
import ChooseColirIdForm from "./ChooseColirIdForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../lib/providers/AuthProvider";
import { useContextSelector } from "use-context-selector";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";

function OAuth2LoginForm({ queueToken, onBack }: { queueToken: string; onBack: () => void }) {
  const showErrorToast = useErrorToast();
  let [step, setStep] = useState(0);
  let [username, setUsername] = useState("");
  let [authConnection, setAuthConnection] = useState<HubConnection>();
  let [proposedHexs, setProposedHexs] = useState<number[]>();
  let authorize = useContextSelector(AuthContext, (c) => c.authorize);
  let navigate = useNavigate();

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
        ?.invoke<SignalRHubResponse<any>>("ChooseUsername", username)
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

    // Just send the signal
    sendSignalAndProceedToNextStep();
  };

  const regenerateHexs = () => {
    authConnection
      ?.invoke<SignalRHubResponse<any>>("RegenerateHexs")
      .then((response) => {
        if (response.resultType === SignalRResultType.Error) throw Error;
        setProposedHexs(response.content as number[]);
      })
      .catch(showErrorToast);
  };

  const colorChosen = (color) => {
    authConnection
      ?.invoke<SignalRHubResponse<any>>("ChooseHex", color)
      .then(() => finish())
      .catch(showErrorToast);
  };

  const finish = () => {
    authConnection
      ?.invoke<SignalRHubResponse<any>>("FinishRegistration")
      .then((response) => {
        if (response.resultType === SignalRResultType.Error) throw Error;
        let jwtToken = response.content["jwtToken"].toString();
        let refreshToken = response.content["refreshToken"].toString();
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
