import { createContext, useEffect, useState } from "react";

export const LoadingContext = createContext<{
  isLoading: boolean;
  enableLoading: () => void;
  disableLoading: () => void;
}>({ isLoading: false, enableLoading: () => {}, disableLoading: () => {} });

const LoadingProvider = ({ children }) => {
  const [enabledLoadings, setEnabledLoadings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (enabledLoadings <= 0) setIsLoading(false);
    else setIsLoading(true);
  }, [enabledLoadings])

  function enableLoading() {
    setEnabledLoadings(enabledLoadings + 1);
  }

  function disableLoading() {
    if (enabledLoadings >= 0)
      setEnabledLoadings(enabledLoadings - 1);
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
