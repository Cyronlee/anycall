import type { NextApiRequest, NextApiResponse } from "next";

import { RequestLog } from "../../lib/types";
import { getRequestLogs } from "../../lib/storage";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestLog[]>,
) {
  const requestLogs = getRequestLogs();

  res.status(200).json(requestLogs);
}
