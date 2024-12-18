import AuthService from "../lib/AuthService";
import ChooseDisplayNameForm from "./ChooseDisplayNameForm";
import { AuthContext } from "../lib/providers/AuthProvider";
import { useContextSelector } from "use-context-selector";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";

function AnonymousLoginForm({ onBack }: { onBack: () => void }) {
  const showErrorToast = useErrorToast();
  const enableLoading = useContextSelector(LoadingContext, (c) => c.enableLoading);
  const disableLoading = useContextSelector(LoadingContext, (c) => c.disableLoading);
  const authorize = useContextSelector(AuthContext, (c) => c.authorize);

  const authorizeAsAnonymous = (username) => {
    enableLoading();
    AuthService.AnonymousLogin(username)
      .then((response) => {
        if (response["status"] !== 200) throw Error;
        const jwtToken = response["data"]["jwtToken"];
        const refreshToken = response["data"]["refreshToken"];
        authorize(jwtToken, refreshToken);
      })
      .catch(() => {
        showErrorToast();
      })
      .finally(() => {
        disableLoading();
      });
  };

  return <ChooseDisplayNameForm onProceed={(username) => authorizeAsAnonymous(username)} onBack={onBack} />;
}

export default AnonymousLoginForm;
