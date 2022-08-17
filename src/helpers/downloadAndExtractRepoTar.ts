import path from "path";
import stream from "stream";
import { promisify } from "util";
import gunzip from "gunzip-maybe";
import tar from "tar-fs";
import fetch from "node-fetch";
import logger from "./logger";

import { EXAMPLES_REPO_TAR } from "../constants";

const pipeline = promisify(stream.pipeline);

export default async function downloadAndExtractTarball(
  subFolderPath: string,
  outputDir: string
): Promise<void> {
  if (!subFolderPath) {
    logger.warn(
      `No project was selected from the prisma/prisma-examples repostory.`
    );
    throw new Error();
  }

  // Download the repo
  let response = await fetch(EXAMPLES_REPO_TAR);

  if (response.status !== 200) {
    throw new Error(
      `Something went wrong when fetching prisma/prisma-examples. Recieved a status code ${response.status}.`
    );
  }

  try {
    await pipeline(
      // Unzip it
      response.body?.pipe(gunzip()),
      // Extract the stuff into this directory
      tar.extract(outputDir, {
        map(header) {
          let originalDirName = header.name.split("/")[0];
          header.name = header.name.replace(`${originalDirName}/`, "");
          subFolderPath = subFolderPath.split(path.sep).join(path.posix.sep);
          if (subFolderPath) {
            if (header.name.startsWith(subFolderPath)) {
              header.name = header.name.replace(subFolderPath, "");
            } else {
              header.name = "<ignore-me>";
            }
          }
          return header;
        },
        ignore(_filename, header) {
          if (!header) {
            throw new Error(`Header is undefined`);
          }

          return header.name === "<ignore-me>";
        },
      })
    );
  } catch (_) {
    throw new Error(
      `Something went wrong when extracting the files from the repostory tar file.`
    );
  }
}
