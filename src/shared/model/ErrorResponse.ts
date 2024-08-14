import { ErrorCode } from "./ErrorCode";

export class ErrorResponse {
 public errorCode: ErrorCode;
 public errorCodeAsString: string;
 public details : string;
}