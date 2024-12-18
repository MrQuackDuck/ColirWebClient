import React from "react";

import { cn } from "../lib/utils";

interface TabProps {
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export function Tab({ children, isSelected, onClick, className }: React.PropsWithChildren<TabProps>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `flex items-center text-nowrap text-popover-foreground whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-1.5px] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer
    hover:bg-accent hover:text-accent-foreground text-ellipsis h-9 px-2 py-2 ${isSelected ? "bg-accent" : null}`,
        className
      )}
    >
      {children}
    </button>
  );
}
