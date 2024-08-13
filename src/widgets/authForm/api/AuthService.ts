import $api from "@/shared/api";
import { AxiosResponse } from "axios";

export default class AuthService {
  AnonymousLogin(name : string) : Promise<AxiosResponse<{jwtToken : string}>> {
    return $api.post("/Auth/AnonymousLogin", null, {
      params: { name },
      paramsSerializer: {
        indexes: false,
      },
    });
  }
}