export interface RequestLog {
  method: string;
  query: any;
  body: any;
  headers: any;
  ip: string | undefined;
  browser: string | undefined;
  os: string | undefined;
}
