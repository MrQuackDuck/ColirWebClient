import { useLoading } from "@/shared/lib/hooks/useLoading";
import { showErrorToast } from "../lib/showErrorToast";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../entities/User/api/AuthService";
import ChooseDisplayNameForm from "./ChooseDisplayNameForm";
import { useAuth } from "../lib/hooks/useAuth";

function AnonymousLoginForm({onBack} : {onBack : () => void}) {
  const { enableLoading, disableLoading } = useLoading();
  const { authorize } = useAuth();

  const authorizeAsAnonymous = (username) => {
    enableLoading();
    AuthService.AnonymousLogin(username)
      .then(response => {
        if (response["status"] !== 200) throw Error;
        let token = response["data"]["jwtToken"];
        authorize(token);
      })
      .catch(() => {
        showErrorToast();
      })
      .finally(() => {
        disableLoading();
      });
  }
  
  return (
    <ChooseDisplayNameForm onProceed={(username) => authorizeAsAnonymous(username)} onBack={onBack} />
  )
}

export default AnonymousLoginForm