import type { NextApiRequest, NextApiResponse } from "next";

import UAParser from "ua-parser-js";

import { RequestLog } from "@/lib/types";
import { addRequestLog } from "@/lib/storage";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 解析用户代理字符串
  const uaParser = new UAParser(req.headers["user-agent"]);

  // 收集请求信息
  const requestInfo: RequestLog = {
    timestamp: new Date().toISOString(), // This already stores in UTC
    method: req.method ?? "",
    query: req.query,
    body: req.body,
    headers: req.headers,
    ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
    browser: uaParser.getBrowser().name,
    os: uaParser.getOS().name,
    origin: req.headers.origin || "",
  };

  // 将请求信息添加到存储中
  addRequestLog(requestInfo);

  // 返回响应
  res.status(200).json({
    query: req.query,
    body: req.body,
  });
}
