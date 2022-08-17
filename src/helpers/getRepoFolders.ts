import axios from "axios";
import { EXAMPLES_REPO_URL, EXAMPLES_DIR_IGNORE } from "../constants";

export default async function () {
  const { data, status } = await axios.get<{
    tree: { path: string; type: string; url: string }[];
  }>(EXAMPLES_REPO_URL);

  if (status !== 200) {
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

  // Remove any directory listings where there is no project (signified by the presence of package.json)
  for (let key in mergedData) {
    if (!mergedData[key].includes("package.json")) {
      delete mergedData[key];
    }
  }

  return Object.keys(mergedData).sort();
}
