import { showErrorToast } from "../../../shared/lib/showErrorToast";
import AuthService from "../lib/AuthService";
import ChooseDisplayNameForm from "./ChooseDisplayNameForm";
import { AuthContext } from "../lib/providers/AuthProvider";
import { useContextSelector } from "use-context-selector";
import { LoadingContext } from "@/shared/lib/providers/LoadingProvider";

function AnonymousLoginForm({ onBack }: { onBack: () => void }) {
  let enableLoading = useContextSelector(LoadingContext, (c) => c.enableLoading);
  let disableLoading = useContextSelector(LoadingContext, (c) => c.disableLoading);
  let authorize = useContextSelector(AuthContext, (c) => c.authorize);

  const authorizeAsAnonymous = (username) => {
    enableLoading();
    AuthService.AnonymousLogin(username)
      .then((response) => {
        if (response["status"] !== 200) throw Error;
        let jwtToken = response["data"]["jwtToken"];
        let refreshToken = response["data"]["refreshToken"];
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
