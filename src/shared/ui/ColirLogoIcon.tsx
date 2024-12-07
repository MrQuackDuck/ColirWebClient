import { useEffect, useState } from "react";
import { useTheme } from "../lib/providers/ThemeProvider";
import { cn } from "../lib/utils";
import classes from "./ColirLogoIcon.module.css";

function ColirLogoIcon({ className, ...props }) {
  const { theme } = useTheme();
  const [fillColor, setFillColor] = useState("#FFFFFF");
  const [isLogoPressed, setIsLogoPressed] = useState(false);

  useEffect(() => {
    if (theme === "light") setFillColor("#1E293B");
    else setFillColor("#FFFFFF");
  }, [theme]);

  function handleMouseDown() {
    setIsLogoPressed(true);
  }

  function handleMouseUp() {
    setIsLogoPressed(false);
  }

  return (
    <svg
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(classes.logo, isLogoPressed && "scale-[0.95]", className)}
      width="69"
      height="28"
      viewBox="0 0 593 239"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M172.396 111.691H131.489C130.742 106.399 129.216 101.698 126.913 97.5888C124.609 93.4172 121.652 89.8682 118.04 86.9418C114.429 84.0154 110.257 81.7739 105.525 80.2174C100.856 78.6608 95.7811 77.8825 90.302 77.8825C80.4021 77.8825 71.7786 80.3419 64.4316 85.2607C57.0845 90.1172 51.3874 97.2152 47.3403 106.555C43.2932 115.832 41.2696 127.102 41.2696 140.364C41.2696 153.999 43.2932 165.456 47.3403 174.733C51.4497 184.01 57.1779 191.015 64.525 195.747C71.872 200.479 80.371 202.845 90.0218 202.845C95.4387 202.845 100.451 202.129 105.058 200.697C109.728 199.265 113.869 197.179 117.48 194.439C121.091 191.637 124.08 188.244 126.446 184.259C128.874 180.274 130.555 176.729 131.489 171.624L172.396 171.81C171.338 180.59 168.691 188.057 164.458 196.214C160.286 204.308 154.651 211.562 147.553 217.975C140.517 224.326 132.112 229.369 122.336 233.105C112.623 236.778 101.634 238.615 89.368 238.615C72.3079 238.615 57.0534 234.755 43.6045 227.034C30.2179 219.313 19.6332 208.137 11.8503 193.505C4.12961 178.873 0.269287 161.16 0.269287 140.364C0.269287 119.505 4.19187 101.76 12.037 87.1286C19.8822 72.4967 30.5292 61.3516 43.9781 53.6932C57.427 45.9726 72.5569 42.1122 89.368 42.1122C100.451 42.1122 110.724 43.6688 120.188 46.782C129.715 49.8951 138.151 54.4404 145.498 60.4176C152.845 66.3326 158.823 73.5863 163.43 82.1786C168.1 90.771 171.089 100.609 172.396 111.691Z"
        fill={fillColor}
      />
      <path d="M401.727 0.727295V236H361.941V0.727295H401.727Z" fill={fillColor} />
      <path d="M433.598 236V92.5455H473.384V236H433.598Z" fill={fillColor} />
      <path
        d="M505.255 236V92.5455H543.828V117.575H545.322C547.937 108.672 552.326 101.947 558.491 97.402C564.655 92.7945 571.753 90.4908 579.785 90.4908C581.777 90.4908 583.925 90.6153 586.229 90.8644C588.533 91.1134 590.556 91.4559 592.299 91.8917V127.195C590.432 126.635 587.848 126.136 584.548 125.701C581.248 125.265 578.228 125.047 575.488 125.047C569.636 125.047 564.406 126.323 559.798 128.876C555.253 131.367 551.642 134.853 548.964 139.336C546.349 143.819 545.042 148.987 545.042 154.84V236H505.255Z"
        fill={fillColor}
      />
      <path
        d="M265.464 238.802C250.957 238.802 238.411 235.72 227.826 229.556C217.304 223.329 209.178 214.675 203.45 203.592C197.722 192.447 194.858 179.527 194.858 164.833C194.858 150.014 197.722 137.064 203.45 125.981C209.178 114.836 217.304 106.181 227.826 100.017C238.411 93.7906 250.957 90.6775 265.464 90.6775C279.972 90.6775 292.486 93.7906 303.009 100.017C313.594 106.181 321.75 114.836 327.478 125.981C333.207 137.064 336.071 150.014 336.071 164.833C336.071 179.527 333.207 192.447 327.478 203.592C321.75 214.675 313.594 223.329 303.009 229.556C292.486 235.72 279.972 238.802 265.464 238.802ZM265.651 207.981C272.251 207.981 277.761 206.114 282.182 202.378C286.603 198.58 289.934 193.412 292.175 186.874C294.479 180.337 295.631 172.896 295.631 164.553C295.631 156.21 294.479 148.769 292.175 142.231C289.934 135.694 286.603 130.526 282.182 126.728C277.761 122.93 272.251 121.031 265.651 121.031C258.989 121.031 253.385 122.93 248.84 126.728C244.357 130.526 240.964 135.694 238.66 142.231C236.418 148.769 235.298 156.21 235.298 164.553C235.298 172.896 236.418 180.337 238.66 186.874C240.964 193.412 244.357 198.58 248.84 202.378C253.385 206.114 258.989 207.981 265.651 207.981Z"
        fill="url(#paint0_linear_168_3740)"
      />
      <path
        d="M432 57.0563C432 44.9142 440.605 35.1127 451.249 35.1127C459.727 35.1127 460.938 16.8263 464.125 20.4836C471.136 28.3833 477 38.6968 477 49.7417C477 65.8337 465.527 78.9999 451.249 78.9999C448.73 79.0095 446.233 78.4495 443.902 77.352C441.572 76.2544 439.452 74.6407 437.664 72.6031C435.877 70.5654 434.457 68.1437 433.485 65.4762C432.513 62.8086 432.008 59.9476 432 57.0563Z"
        fill={fillColor}
      />
      <defs>
        <linearGradient id="paint0_linear_168_3740" x1="224.5" y1="114" x2="328.5" y2="218" gradientUnits="userSpaceOnUse">
          <stop offset="0.18" stopColor={fillColor} />
          <stop offset="0.181" stopColor="#FF0000" />
          <stop offset="0.31" stopColor="#FF0000" />
          <stop offset="0.31" stopColor="#FFC700" />
          <stop offset="0.44" stopColor="#FFC700" />
          <stop offset="0.44" stopColor="#0764FB" />
          <stop offset="0.57" stopColor="#0764FB" />
          <stop offset="0.57" stopColor="#14C45A" />
          <stop offset="0.7" stopColor="#14C35A" />
          <stop offset="0.7" stopColor={fillColor} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default ColirLogoIcon;