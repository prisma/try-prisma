import path from "path";
import stream from "stream";
import { promisify } from "util";
import gunzip from "gunzip-maybe";
import tar from "tar-fs";
import fetch from "node-fetch";
import logger from "../utils/logger";
import ora from "ora";

import { EXAMPLES_REPO_TAR } from "../utils/constants";
import { CliInput } from "../utils/types";

const pipeline = promisify(stream.pipeline);

export default async function download(options: CliInput): Promise<void> {
  if (!options.template.length) {
    logger.warn(
      `No project was selected from the prisma/prisma-examples repostory.`,
    );
    throw new Error();
  }

  const spinner = ora();
  spinner.start(`Downloading and extracting the ${options.template} project`);

  // Download the repo
  const response = await fetch(EXAMPLES_REPO_TAR, {
    method: "POST",
    body: JSON.stringify(options),
  });

  if (response.status !== 200) {
    spinner.stopAndPersist();
    throw new Error(
      `Something went wrong when fetching prisma/prisma-examples. Recieved a status code ${response.status}.`,
    );
  }

  try {
    await pipeline(
      // Unzip it
      response.body?.pipe(gunzip()),
      // Extract the stuff into this directory
      tar.extract(`${options.dirpath}/${options.name}`, {
        map(header) {
          const originalDirName = header.name.split("/")[0];
          header.name = header.name.replace(`${originalDirName}/`, "");
          options.template = options.template
            .split(path.sep)
            .join(path.posix.sep);
          if (options.template) {
            if (header.name.startsWith(`${options.template}/`)) {
              header.name = header.name.replace(options.template, "");
            } else {
              header.name = "[[ignore-me]]";
            }
          }
          return header;
        },
        ignore(_filename, header) {
          if (!header) {
            throw new Error(`Header is undefined`);
          }

          return header.name === "[[ignore-me]]";
        },
        readable: true,
        writable: true,
      }),
    );
    spinner.succeed(
      `Downloaded and extracted the ${options.template} project.`,
    );
  } catch (e) {
    spinner.stopAndPersist();
    console.log(e);
    throw new Error(
      `Something went wrong when extracting the files from the repostory tar file.`,
    );
  }
}
