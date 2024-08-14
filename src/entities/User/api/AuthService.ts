import $api from "@/shared/api";
import { AxiosResponse } from "axios";

export default class AuthService {
  static AnonymousLogin(
    name: string
  ): Promise<AxiosResponse<{ jwtToken: string }>> {
    return $api.post("/Auth/AnonymousLogin", null, {
      params: { name },
      paramsSerializer: {
        indexes: false,
      },
    });
  }

  static ExchangeGitHubCode(
    code,
    state
  ): Promise<AxiosResponse<{ queueToken: string } | { jwtToken: string }>> {
    return $api.get("/Auth/ExchangeGitHubCode", {
      params: { code, state },
      paramsSerializer: {
        indexes: false,
      },
    });
  }

  static ExchangeGoogleCode(
    code,
    state
  ): Promise<AxiosResponse<{ queueToken: string } | { jwtToken: string }>> {
    return $api.get("/Auth/ExchangeGoogleCode", {
      params: { code, state },
      paramsSerializer: {
        indexes: false,
      },
    });
  }

  static GetGithubAuthLink(): Promise<AxiosResponse<string>> {
    return $api.get("/Auth/GitHubLogin");
  }

  static GetGoogleAuthLink(): Promise<AxiosResponse<string>> {
    return $api.get("/Auth/GoogleLogin");
  }

  static LogOut(): Promise<AxiosResponse> {
    return $api.post("/Auth/Logout");
  }
}
