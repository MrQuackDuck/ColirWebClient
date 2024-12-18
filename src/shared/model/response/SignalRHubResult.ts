import { ErrorResponse } from "../ErrorResponse";
import { SignalRResultType } from "./SignalRResultType";

export class SignalRHubResult<T> {
  public resultType: SignalRResultType;
  public content: T;
  public error: ErrorResponse;
}
