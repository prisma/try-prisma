import { EXAMPLES_DIR_ACCEPT } from "../constants";
import fs from "fs";

export default {
  directoryName(name: string) {
    const re = /[<>:"/\\|?*]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
    if (re.test(name)) {
      throw new Error("Sorry, that name is invalid.");
    }
  },
  rootDir(path: string) {
    if (!EXAMPLES_DIR_ACCEPT.includes(path)) {
      throw new Error(
        "Invalid template. Please choose a template from the `javascript`, `typescript`, `accelerate`, `pulse`, or `optimize` directories in the prisma/prisma-examples repository.",
      );
    }
  },
  directory(path: string) {
    if (path.slice(-1) === "/") {
      throw new Error("The path should not end in /");
    }

    if (!fs.existsSync(path)) {
      try {
        fs.mkdirSync(path, { recursive: true });
      } catch {
        throw new Error(`Unable to reach a directory at ${path}`);
      }
    }
  },
  project(projects: string[], project: string) {
    if (!projects.includes(project.trim())) {
      throw new Error("Oops! That isn't a valid template.");
    }
  },
};
