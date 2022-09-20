import fs from "fs";
import { EXAMPLES_DIR_ACCEPT } from "./constants";

export default {
  directoryName(name: string) {
    const re = /[<>:"/\\|?*]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
    if (re.test(name)) {
      return "Sorry, that name is invalid.";
    } else {
      return true;
    }
  },
  rootDir(path: string) {
    return EXAMPLES_DIR_ACCEPT.includes(path) || 'Invalid template. Please choose a template from the `javascript` or `typescript` directories in the prisma/prisma-examples repository.'
  },
  directory(path: string) {
    if (path.slice(-1) === "/") {
      return "The path should not end in /";
    }

    if (!fs.existsSync(path)) {
      return `Unable to reach a directory at ${path}`;
    }

    return true;
  },
  project(projects: string[], project: string) {
    if (!projects.includes(project.trim())) {
      return "Oops! That isn't a valid template.";
    } else {
      return true;
    }
  },
};
