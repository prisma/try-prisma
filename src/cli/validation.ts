import { EXAMPLES_DIR_ACCEPT } from "../constants";
import fs from "fs";
import path from "path"

export default {
  directoryName(name: string) {
    // Check for "." or ".." or "./" or "../" or any variations like "./folder"
    if (name === '.' || name === '..' || name.startsWith('./') || name.startsWith('../') || name.startsWith('._') || name.startsWith('.')) {
      throw new Error("Sorry, the filename cannot be a path.");
    }

    // Check if the name already exists as a file or directory in the current directory
    const fullPath = path.join(process.cwd(), name);
    if (fs.existsSync(fullPath)) {
      throw new Error(`Sorry, a file or directory with the name "${name}" already exists.`);
    }

    // Regex for invalid characters and reserved names
    const re = /[<>:"/\\|?*]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
    if (re.test(name)) {
      throw new Error("Sorry, the filename is invalid because it contains invalid characters or is a reserved name.");
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
