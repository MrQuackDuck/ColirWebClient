import { useContext } from "react";
import { LoadingContext } from "../LoadingContext";

export const useLoading = (): {
  isLoading: boolean;
  enableLoading: () => void;
  disableLoading: () => void;
} => {
  let { isLoading, enableLoading, disableLoading } = useContext(LoadingContext);
  return { isLoading, enableLoading, disableLoading };
};
