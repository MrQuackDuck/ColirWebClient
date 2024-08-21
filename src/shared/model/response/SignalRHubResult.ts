import { ErrorResponse } from "../ErrorResponse";
import { SignalRResultType } from "./SignalRResultType";

export class SignalRHubResponse<T> {
  public resultType : SignalRResultType;
  public content : T;
  public error : ErrorResponse;
}