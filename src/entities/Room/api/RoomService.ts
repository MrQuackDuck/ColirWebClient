import { AxiosResponse } from "axios";
import { GetRoomInfoModel } from "../model/request/GetRoomInfoModel";
import { RoomModel } from "../model/RoomModel";
import { CreateRoomModel } from "../model/request/CreateRoomModel";
import { DeleteRoomModel } from "../model/request/DeleteRoomModel";
import { GetLastTimeReadChatModel } from "../model/request/GetLastTimeReadChatModel";
import { JoinRoomModel } from "../model/request/JoinRoomModel";
import { KickMemberModel } from "../model/request/KickMemberModel";
import { LeaveRoomModel } from "../model/request/LeaveRoomModel";
import { RenameRoomModel } from "../model/request/RenameRoomModel";
import { UpdateLastReadMessageModel } from "../model/request/UpdateLastReadMessageModel";
import $api from "@/shared/api";

export default class RoomService {
  static async GetRoomInfo(model: GetRoomInfoModel): Promise<AxiosResponse<RoomModel>> {
    return await $api.get("/Room/GetRoomInfo", {
      params: {
        roomGuid: model.roomGuid
      }
    });
  }

  static async CreateRoom(model: CreateRoomModel): Promise<AxiosResponse<RoomModel>> {
    return await $api.post("/Room/CreateRoom", model);
  }

  static JoinRoom(model: JoinRoomModel): Promise<AxiosResponse<RoomModel>> {
    return $api.post("/Room/JoinRoom", model);
  }

  static async LeaveRoom(model: LeaveRoomModel): Promise<AxiosResponse<void>> {
    return await $api.post("/Room/LeaveRoom", model);
  }

  static async GetLastTimeReadChat(model: GetLastTimeReadChatModel): Promise<AxiosResponse<Date>> {
    return await $api.get("/Room/GetLastTimeReadChat", {
      params: {
        roomGuid: model.roomGuid
      }
    });
  }

  static async UpdateLastReadMessage(model: UpdateLastReadMessageModel): Promise<AxiosResponse<void>> {
    return await $api.put("/Room/UpdateLastReadMessage", model);
  }

  static async KickMember(model: KickMemberModel): Promise<AxiosResponse<void>> {
    return await $api.delete("/Room/KickMember", { data: { targetHexId: model.targetHexId, roomGuid: model.roomGuid } });
  }

  static async RenameRoom(model: RenameRoomModel): Promise<AxiosResponse<void>> {
    return await $api.put("/Room/RenameRoom", model);
  }

  static async DeleteRoom(model: DeleteRoomModel): Promise<AxiosResponse<void>> {
    return await $api.delete("/Room/DeleteRoom", { data: { roomGuid: model.roomGuid } });
  }
}
