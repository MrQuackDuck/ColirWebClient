import $api from "@/shared/api";
import { AxiosResponse } from "axios";

export default class AuthService {
  static async IsAuthenticated(): Promise<AxiosResponse> {
    return await $api.get("/Auth/IsAuthenticated");
  }

  static AnonymousLogin(name: string): Promise<AxiosResponse<{ jwtToken: string; refreshToken: string }>> {
    return $api.post("/Auth/AnonymousLogin", null, {
      params: { name },
      paramsSerializer: {
        indexes: false
      }
    });
  }

  static ExchangeGitHubCode(code, state): Promise<AxiosResponse<{ queueToken: string } | { jwtToken: string; refreshToken: string }>> {
    return $api.get("/Auth/ExchangeGitHubCode", {
      params: { code, state },
      paramsSerializer: {
        indexes: false
      }
    });
  }

  static ExchangeGoogleCode(code, state): Promise<AxiosResponse<{ queueToken: string } | { jwtToken: string; refreshToken: string }>> {
    return $api.get("/Auth/ExchangeGoogleCode", {
      params: { code, state },
      paramsSerializer: {
        indexes: false
      }
    });
  }

  static GetGithubAuthLink(): Promise<AxiosResponse<string>> {
    return $api.get("/Auth/GitHubLogin");
  }

  static GetGoogleAuthLink(): Promise<AxiosResponse<string>> {
    return $api.get("/Auth/GoogleLogin");
  }

  static RefreshToken(accessToken, refreshToken): Promise<AxiosResponse<{ queueToken: string } | { newJwtToken: string; refreshToken: string }>> {
    return $api.post("/Auth/RefreshToken", { accessToken, refreshToken });
  }

  static LogOut(): Promise<AxiosResponse> {
    return $api.post("/Auth/Logout");
  }
}
