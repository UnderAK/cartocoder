import type { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
import { join } from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { files } = req.body;
  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "Missing or invalid 'files' array in request body." });
  }

  // Path to the dependency extraction script
  const scriptPath = join(process.cwd(), "scripts", "extract-imports.js");

  const child = spawn("node", [scriptPath, ...files], { stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (data) => {
    stdout += data;
  });
  child.stderr.on("data", (data) => {
    stderr += data;
  });

  child.on("close", (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(stdout);
        res.status(200).json(result);
      } catch (e) {
        res.status(500).json({ error: "Failed to parse dependency extraction output.", details: e.message });
      }
    } else {
      res.status(500).json({ error: "Dependency extraction script failed.", details: stderr });
    }
  });
}
