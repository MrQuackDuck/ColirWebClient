import { ErrorResponse } from "react-router-dom";
import { SignalRResultType } from "./SignalRResultType";

export class SignalRHubResponse<T> {
  public resultType : SignalRResultType;
  public content : T;
  public error : ErrorResponse
}