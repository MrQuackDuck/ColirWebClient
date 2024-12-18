import { AxiosResponse } from "axios";

import { $api, API_URL } from "@/shared/api";

import { UploadAttachmentsModel } from "../model/request";

export class UploadService {
  static async UploadAttachments(model: UploadAttachmentsModel): Promise<AxiosResponse<number[]>> {
    const formData: FormData = new FormData();
    formData.append("roomGuid", model.roomGuid);
    model.files.forEach((file) => {
      formData.append("files", file);
    });

    return await $api.post<number[]>(`${API_URL}/Upload/UploadAttachments`, formData);
  }
}
