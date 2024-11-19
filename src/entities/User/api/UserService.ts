import $api from "@/shared/api";
import { AxiosResponse } from "axios";
import { DetailedUserModel } from "../model/DetailedUserModel";
import { UserSettingsModel } from "../model/UserSettingsModel";
import { UserStatisticsModel } from "../model/UserStatisticsModel";
import { ChangeUsernameModel } from "../model/ChangeUsernameModel";

export default class UserService {
  public static async GetAccountInfo(): Promise<AxiosResponse<DetailedUserModel>> {
    return await $api.get("/User/GetAccountInfo");
  }

  public static async GetStatistics(): Promise<AxiosResponse<UserStatisticsModel>> {
    return await $api.get("/User/GetStatistics");
  }

  public static async ChangeSettings(newSettings: UserSettingsModel): Promise<AxiosResponse<void>> {
    return await $api.put("/User/ChangeSettings", newSettings);
  }

  public static async ChangeUsername(changeUsernameModel: ChangeUsernameModel): Promise<AxiosResponse<void>> {
    return await $api.put("/User/ChangeUsername", changeUsernameModel);
  }

  public static async DeleteAccount(): Promise<AxiosResponse<void>> {
    return await $api.delete("/User/DeleteAccount");
  }
}