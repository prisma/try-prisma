import { EXAMPLES_DIR_ACCEPT, EXAMPLES_REPO_URL } from "../constants";
import fetch from "node-fetch";

export default async function getProjects() {
  const result = await fetch(EXAMPLES_REPO_URL);
  const data = (await result.json()) as {
    tree: { path: string; type: string; url: string }[];
  };

  if (result.status !== 200) {
    throw new Error(
      `Something went wrong when fetching the available projects from prisma/prisma-examples. Got status code ${status}`,
    );
  }

  const mergedData = data.tree
    .filter((item) =>
      EXAMPLES_DIR_ACCEPT.some((dir) => item.path.startsWith(dir)),
    )
    .reduce((prev, curr) => {
      if (curr.type === "blob") {
        const fileName = curr.path.split("/").pop();
        const path = curr.path.replace(`/${fileName}`, "");

        if (prev[path]) prev[path].push(fileName);
        else prev[path] = [fileName];

        return prev;
      } else {
        return { ...prev, [curr.path]: [] };
      }
    }, {});
  
  for (const key in mergedData) {
    if (!mergedData[key].includes("package.json")) {
      delete mergedData[key];
    }
  }

  const projectsWithSubfolders:string[] = []

  const paths = Object.keys(mergedData).map(item => {
    const folders = item.split('/');
    
    if(folders.length >= 3) {
      projectsWithSubfolders.push(folders[1])
    }

    return folders.length >= 3 ? folders.slice(0, -1).join('/') : item;
  });

  const uniquePaths = Array.from(new Set(paths)).sort();
  
  return [uniquePaths, projectsWithSubfolders];
}
