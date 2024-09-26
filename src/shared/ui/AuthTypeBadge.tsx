import { UserAuthType } from '@/entities/User/model/UserAuthType'
import { Badge } from './Badge'
import { cn } from '../lib/utils'

interface AuthTypeBadgeProps {
  authType: UserAuthType | undefined;
  className?: string;
}

function AuthTypeBadge(props: AuthTypeBadgeProps) {
  return (
    <Badge className={cn("my-1.5", props.authType == UserAuthType.Google && "bg-red-500 hover:bg-red-600 text-white",
      props.authType == UserAuthType.Github && "bg-gray-800 hover:bg-gray-700 text-white", props.className
    )}>
      {props.authType === UserAuthType.Anonymous ? "Anonymous" :
      props.authType === UserAuthType.Google ? "Google" : 
      props.authType === UserAuthType.Github ? "GitHub" : "Unknown"}
    </Badge>
  )
}

export default AuthTypeBadge