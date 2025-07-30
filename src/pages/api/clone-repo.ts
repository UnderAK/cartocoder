import type { NextApiRequest, NextApiResponse } from "next";
import { extractImportsFromFiles } from "../../utils/extractImports";
import { tmpdir } from "os";
import { join } from "path";
import { mkdtemp } from "fs/promises";
import AdmZip from "adm-zip";
import fetch from "node-fetch";

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
        } else if (/\.(js|ts|jsx|tsx)$/.test(filePath)) {
      results.push(filePath);
    }
  }
  return results;
};

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
    const tempDir = await mkdtemp(join(tmpdir(), "repo-"));
    // Try main, then fallback to master
    let branches = ["main", "master"];
    let found = false;
    let zipBuffer: Buffer | null = null;
    let branchUsed = "main";
    let subDir = tempDir;
    const urlParts = repoUrl.split("/");
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1].replace(".git", "");
    for (const branch of branches) {
      const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;
      const response = await fetch(zipUrl);
      if (response.ok) {
        zipBuffer = Buffer.from(await response.arrayBuffer());
        found = true;
        branchUsed = branch;
        break;
      }
    }
    if (!found || !zipBuffer) {
      return res.status(404).json({ error: "Repository not found or no main/master branch." });
    }
    // Unzip
    const zip = new AdmZip(zipBuffer);
    zip.extractAllTo(tempDir, true);
    // The files are inside a subfolder: repo-main or repo-master
    subDir = join(tempDir, `${repo}-${branchUsed}`);

    // Recursively scan for .js and .ts files, ignoring node_modules, .git, and test folders
    const fileList = await walk(subDir);

    // Extract dependencies and build the graph
    const graph = extractImportsFromFiles(fileList);

    // Schedule deletion of tempDir after 5 minutes
    setTimeout(async () => {
      try {
        const { rm } = await import('fs/promises');
        await rm(tempDir, { recursive: true, force: true });
      } catch {}
    }, 5 * 60 * 1000);

    return res.status(200).json(graph);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to clone repository.", details: err.message });
  }
}
