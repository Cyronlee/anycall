import { RequestLog } from "./types";

let requestLogs: RequestLog[] = [];

export function addRequestLog(log: RequestLog) {
  requestLogs.push(log);
}

export function getRequestLogs(): RequestLog[] {
  return requestLogs;
}
