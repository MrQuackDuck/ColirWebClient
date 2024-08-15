import { useEffect, useMemo, useState } from "react";
import ChooseDisplayNameForm from "./ChooseDisplayNameForm";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { API_URL } from "@/shared/api";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { showErrorToast } from "../lib/showErrorToast";
import { SignalRResultType } from "@/shared/model/response/SignalRResultType";
import ChooseColirIdForm from "./ChooseColirIdForm";
import { useAuth } from "../lib/hooks/useAuth";

function OAuth2LoginForm({
  queueToken,
  onBack,
}: {
  queueToken: string;
  onBack: () => void;
}) {
  let [step, setStep] = useState(0);
  let [username, setUsername] = useState("");
  let [connection, setConnection] = useState<HubConnection>();
  let [proposedColors, setProposedColors] = useState<number[]>();
  let { authorize } = useAuth();

  useEffect(() => {
    setConnection(
      new HubConnectionBuilder()
        .withUrl(`${API_URL}/Registration?queueToken=${queueToken}`)
        .configureLogging(LogLevel.Information)
        .build()
    );
  }, []);

  // Registering handlers
  useMemo(() => {
    connection?.on("ReceiveHexsList", (response) => {
      setProposedColors(response);
    });
  }, [connection])

  const usernameChosen = async (username) => {
    setUsername(username);
    const sendSignalAndProceedToNextStep = () => {
      connection?.invoke<SignalRHubResponse>("ChooseUsername", username)
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
    if (connection?.state === HubConnectionState.Disconnected) {
      return connection.start().then(() => {
        sendSignalAndProceedToNextStep();
      });
    }

    // Just send the signal
    sendSignalAndProceedToNextStep();
  };

  const regenerateHexs = () => {
    connection?.invoke<SignalRHubResponse>("RegenerateHexs")
      .then(response => {
        if (response.resultType === SignalRResultType.Error) throw Error;
        setProposedColors(response.content as number[]);
      })
      .catch(showErrorToast);
  }

  const colorChosen = (color) => {
    connection?.invoke<SignalRHubResponse>("ChooseHex", color)
      .then(() => finish())
      .catch(showErrorToast);
  };

  const finish = () => {
    connection?.invoke<SignalRHubResponse>("FinishRegistration")
      .then((response) => {
        console.log(response)
        if (response.resultType === SignalRResultType.Error) throw Error;
        let jwtToken = response.content["jwtToken"].toString();
        let refreshToken = response.content["refreshToken"].toString();
        authorize(jwtToken, refreshToken);
        window.location.href = "/";
      })
      .catch(showErrorToast);
  };

  return (
    <>
      {step === 0 && (
        <ChooseDisplayNameForm
          onProceed={usernameChosen}
          onBack={onBack}
          username={username}
        />
      )}

      {step === 1 && (
        <ChooseColirIdForm
          onProceed={colorChosen}
          onRegenerate={regenerateHexs}
          colors={proposedColors ?? []}
          onBack={() => setStep(0)}
        />
      )}
    </>
  );
}

export default OAuth2LoginForm