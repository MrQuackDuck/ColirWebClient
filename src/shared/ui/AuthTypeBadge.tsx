import { UserAuthType } from "@/entities/User";

import { useTranslation } from "../lib/hooks/useTranslation";
import { cn } from "../lib/utils";
import { Badge } from "./Badge";

interface AuthTypeBadgeProps {
  authType: UserAuthType | undefined;
  className?: string;
}

export function AuthTypeBadge(props: AuthTypeBadgeProps) {
  const t = useTranslation();

  return (
    <Badge
      className={cn(
        "my-1.5",
        props.authType == UserAuthType.Google && "bg-red-500 hover:bg-red-600 text-white",
        props.authType == UserAuthType.Github && "bg-gray-800 hover:bg-gray-700 text-white",
        props.className
      )}
    >
      {props.authType === UserAuthType.Anonymous ? t("ANONYMOUS_BADGE") : props.authType === UserAuthType.Google ? "Google" : props.authType === UserAuthType.Github ? "GitHub" : t("UNKNOWN_BADGE")}
    </Badge>
  );
}
