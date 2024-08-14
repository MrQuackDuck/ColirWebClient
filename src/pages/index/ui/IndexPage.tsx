import { useAuth } from "@/features/authorize/lib/hooks/useAuth";
import AuthForm from "@/features/authorize/ui/AuthForm";

function IndexPage() {
  const { isAuthorized } = useAuth();

  return (
    <div className="flex flex-col justify-center items-center pt-10">
        { !isAuthorized && <AuthForm/> }
        { isAuthorized && <div className="text-center">Greetings!</div> }
    </div>
  );
}

export default IndexPage;
