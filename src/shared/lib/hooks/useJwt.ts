import { AuthService } from "@/features/authorize";

import { useLocalStorage } from "./useLocalStorage";

export const useJwt = () => {
  const { getFromLocalStorage } = useLocalStorage();

  async function getJwt(): Promise<string> {
    // AuthService uses $api object, that intercepts "Unauthorized (401)" objcets and requests a new JWT token with refresh token
    return await AuthService.IsAuthenticated().then(() => getFromLocalStorage("jwtToken")!);
  }

  return getJwt;
};
