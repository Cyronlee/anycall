export interface RequestLog {
  timestamp: string; // New field
  method: string;
  query: any;
  body: any;
  headers: any;
  ip: string | undefined;
  browser: string | undefined;
  os: string | undefined;
  origin: string; // New field
}
