import ColirLogoIcon from "@/shared/ui/ColirLogoIcon";
import ThemeButton from "./ThemeButton";
import ProfileButton from "./ProfileButton";

function Header() {
    return (
      <header className="flex justify-between w-[100vw] h-[72px] leading-[32px] py-[20px] px-[10vw]">
        <ColirLogoIcon className="max-h-[100%] cursor-pointer" />
        <div className="flex gap-[6px]">
          <ThemeButton/>
          <ProfileButton/>
        </div>
      </header>
    );
  }

export default Header