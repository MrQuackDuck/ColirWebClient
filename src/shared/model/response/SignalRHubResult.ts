import { ErrorResponse } from "react-router-dom";
import { SignalRResultType } from "./SignalRResultType";

export class SignalRHubResponse {
  public resultType : SignalRResultType;
  public content : object;
  public error : ErrorResponse
}