import type { NextApiRequest, NextApiResponse } from "next";
import { extractImportsFromFiles } from "../../utils/extractImports";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { files } = req.body;
  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "Missing or invalid 'files' array in request body." });
  }

  try {
    const result = extractImportsFromFiles(files);
    return res.status(200).json(result);
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ error: "Failed to extract imports.", details: errMsg });
  }
}

