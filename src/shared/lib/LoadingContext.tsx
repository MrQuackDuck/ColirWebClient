import { createContext, useState } from "react";

export const LoadingContext = createContext<{
  isLoading: boolean;
  enableLoading: () => void;
  disableLoading: () => void;
}>({ isLoading: false, enableLoading: () => {}, disableLoading: () => {} });

const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function enableLoading() {
    setIsLoading(true);
  }

  function disableLoading() {
    setIsLoading(false);
  }

  return (
    <LoadingContext.Provider
      value={{ isLoading, enableLoading, disableLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
