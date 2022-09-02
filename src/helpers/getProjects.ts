import fetch from "node-fetch";
import { EXAMPLES_REPO_URL, EXAMPLES_DIR_IGNORE } from "../utils/constants";

export default async function getProjects() {
  const result = await fetch(EXAMPLES_REPO_URL)
  const data = await result.json() as { tree: { path: string; type: string; url: string }[]};
  
  if (result.status !== 200) {
    throw new Error(
      `Something went wrong when fetching the available projects from prisma/prisma-examples. Got status code ${status}`,
    );
  }

  const mergedData = data.tree
    // Remove un-needed folders
    .filter(
      (item) => !EXAMPLES_DIR_IGNORE.some((dir) => item.path.startsWith(dir)),
    )
    // Get an object where each key is a folder path and the value is an array of file names
    .reduce((prev, curr) => {
      // If this is a file
      if (curr.type === "blob") {
        // Get the name
        const fileName = curr.path.split("/").pop();
        // Get the path minus the name
        const path = curr.path.replace(`/${fileName}`, "");

        // Add the the file to an array in the object at key path
        if (prev[path]) prev[path].push(fileName);
        // Add the filepath as a key and initialize an array with the filename
        else prev[path] = [fileName];

        return prev;
      } else {
        // If this is a file tree type, just add the tree name
        return { ...prev, [curr.path]: [] };
      }
    }, {});

  // Remove any directory listings where there is no project (signified by the presence of package.json)
  for (const key in mergedData) {
    if (!mergedData[key].includes("package.json")) {
      delete mergedData[key];
    }
  }

  return Object.keys(mergedData).sort();
}
