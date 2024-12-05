import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./Button";
import classes from "./Input.module.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  // If the input is for a password, we need to show the toggle button and hide the password by default
  const [showPassword, setShowPassword] = React.useState(className?.includes("password") ? false : true);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="relative w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          !showPassword && classes.discText,
          className
        )}
        ref={ref}
        {...props}
      />
      {className?.includes("password") && (
        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={togglePasswordVisibility}>
          {showPassword ? <Eye className="text-foreground/90 h-4 w-4" /> : <EyeOff className="text-foreground/90 h-4 w-4" />}
          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
        </Button>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
