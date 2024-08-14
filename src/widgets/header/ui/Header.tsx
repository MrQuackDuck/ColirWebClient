import ColirLogoIcon from "@/shared/ui/ColirLogoIcon";
import ThemeButton from "./ThemeButton";
import ProfileButton from "./ProfileButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/authorize/lib/hooks/useAuth";
import classes from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();

  const navigateHome = () => {
    navigate("/", { replace: true });
  }

  return (
    <header className={`flex z-20 justify-between w-[100vw] h-[72px] leading-[32px] py-[20px] px-[10vw] ${classes.header}`}>
      <ColirLogoIcon onClick={() => navigateHome()} className="max-h-[100%] cursor-pointer" />
      <div className="flex gap-[6px]">
        <ThemeButton />
        {isAuthorized && <ProfileButton/>}
      </div>
    </header>
  );
}

export default Header;
