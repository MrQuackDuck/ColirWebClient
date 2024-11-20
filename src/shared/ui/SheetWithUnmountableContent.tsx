import React, { useCallback } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

// Context for sharing state between components
const SheetContext = createContext({
  open: false,
  onOpenClose: (_: boolean) => {},
  orientation: 'right' as 'left' | 'right' | 'top' | 'bottom'
});

// Types
interface SheetProps {
  children: React.ReactNode;
  open: boolean;
  onOpenClose: (value: boolean) => void;
  orientation?: 'left' | 'right' | 'top' | 'bottom';
}

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
}

// Main Sheet component
export const SheetWithUnmountableContent: React.FC<SheetProps> = ({
  children,
  open,
  onOpenClose,
  orientation = 'right'
}) => {
  const handleOverlayClick = useCallback(() => {
    onOpenClose(false);
  }, [onOpenClose]);

  return (
    <SheetContext.Provider value={{ open, onOpenClose, orientation }}>
      {children}
      {open && (
        <div 
          className="fixed inset-0 z-[45] bg-black/80 transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}
    </SheetContext.Provider>
  );
};

// Trigger component
export const SheetTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const onOpenClose = useContextSelector(SheetContext, c => c.onOpenClose);
  
  return (
    <button 
      onClick={() => onOpenClose(true)}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  );
};

// Content component
export const SheetContent: React.FC<SheetContentProps> = ({ children, className }) => {
  const { open, onOpenClose, orientation } = useContextSelector(SheetContext, c => c);

  const positionClasses = {
    right: 'right-0 h-full w-3/4 sm:max-w-sm border-l',
    left: 'left-0 h-full w-3/4 sm:max-w-sm border-r',
    top: 'top-0 w-full h-3/4 sm:max-h-96 border-b',
    bottom: 'bottom-0 w-full h-3/4 sm:max-h-96 border-t'
  };

  const translateClasses = {
    right: open ? 'translate-x-0' : 'translate-x-full',
    left: open ? 'translate-x-0' : '-translate-x-full',
    top: open ? 'translate-y-0' : '-translate-y-full',
    bottom: open ? 'translate-y-0' : 'translate-y-full'
  };

  return (
    <div
      className={`
        fixed z-50 bg-background shadow-lg transition-transform duration-300 ease-in-out
        ${positionClasses[orientation]}
        ${translateClasses[orientation]}
        ${className || ''}
      `}
    >
      <div className="relative h-full w-full p-6">
        {children}
        <button
          onClick={() => onOpenClose(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};