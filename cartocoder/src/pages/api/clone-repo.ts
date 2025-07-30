import type { NextApiRequest, NextApiResponse } from "next";
import { tmpdir } from "os";
import { join } from "path";
import { mkdtemp } from "fs/promises";
import simpleGit from "simple-git";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { repoUrl } = req.body;
  if (!repoUrl || typeof repoUrl !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'repoUrl' in request body." });
  }

  // Basic validation for GitHub repo URL
  const githubRegex = /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/i;
  if (!githubRegex.test(repoUrl)) {
    return res.status(400).json({ error: "Invalid GitHub repository URL." });
  }

  try {
    // Create a temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "cloned-repo-"));
    const git = simpleGit();
    await git.clone(repoUrl, tempDir);

    // Recursively scan for .js and .ts files, ignoring node_modules, .git, and test folders
    const walk = async (dir: string, ignoreDirs = ["node_modules", ".git", "test"]) => {
      const { readdir } = await import("fs/promises");
      const { stat } = await import("fs/promises");
      let results: string[] = [];
      const list = await readdir(dir);
      for (const file of list) {
        const filePath = join(dir, file);
        const fileStat = await stat(filePath);
        if (fileStat.isDirectory()) {
          if (ignoreDirs.includes(file)) continue;
          results = results.concat(await walk(filePath, ignoreDirs));
        } else if (filePath.endsWith(".js") || filePath.endsWith(".ts")) {
          results.push(filePath);
        }
      }
      return results;
    };

    const fileList = await walk(tempDir);

    // Schedule deletion of tempDir after 5 minutes
    // NOTE: In serverless/server environments, this is best-effort only; the process may be killed before timer fires.
    setTimeout(async () => {
      try {
        const { rm } = await import('fs/promises');
        await rm(tempDir, { recursive: true, force: true });
        // Optionally log cleanup
      } catch (cleanupErr) {
        // Optionally log cleanup error
      }
    }, 5 * 60 * 1000); // 5 minutes

    return res.status(200).json({ success: true, tempDir, files: fileList });
  } catch (err: any) {
    if (err.message?.includes("Repository not found")) {
      return res.status(404).json({ error: "Repository not found." });
    }
    return res.status(500).json({ error: "Failed to clone repository.", details: err.message });
  }
}
