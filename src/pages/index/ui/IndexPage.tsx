import { useAuth } from "@/features/authorize/lib/hooks/useAuth";
import AuthForm from "@/features/authorize/ui/AuthForm";
import JoinOrCreateRoom from "@/features/join-or-create-room/ui/JoinOrCreateRoom";

function IndexPage() {
  const { isAuthorized } = useAuth();

  return (
    <div className="flex flex-col justify-center items-center pt-10">
        { !isAuthorized && <AuthForm/> }
        { isAuthorized && <JoinOrCreateRoom/> }
    </div>
  );
}

export default IndexPage;
