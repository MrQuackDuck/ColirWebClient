import ColirLogoIcon from "@/shared/ui/ColirLogoIcon";
import ThemeButton from "./ThemeButton";
import ProfileButton from "./ProfileButton";
import { useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import { useContextSelector } from "use-context-selector";
import { AuthContext } from "@/features/authorize/lib/providers/AuthProvider";

function Header() {
  const navigate = useNavigate();
  let isAuthorized = useContextSelector(AuthContext, c => c.isAuthorized);

  const navigateHome = () => {
    navigate("/", { replace: true });
  }

  return (
    <header className={`flex z-40 justify-between w-[100vw] min-h-[60px] leading-[32px] ${classes.header}`}>
      <ColirLogoIcon onClick={() => navigateHome()} className="max-h-[100%] cursor-pointer" />
      <div className="flex gap-[6px]">
        <ThemeButton />
        {isAuthorized && <ProfileButton/>}
      </div>
    </header>
  );
}

export default Header;
