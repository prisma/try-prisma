import { EXAMPLES_REPO_TAR } from "../constants";
import { CliInput } from "../types";
import gunzip from "gunzip-maybe";
import fetch from "node-fetch";
import ora from "ora";
import path from "path";
import stream from "stream";
import tar from "tar-fs";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

export default async function download(options: CliInput): Promise<void> {
  if (!options.template.length) {
    throw new Error(
      `No project was selected from the prisma/prisma-examples repostory.`,
    );
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
      tar.extract(`${options.path}/${options.name}`, {
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
      `Downloaded and extracted the ${options.template} project.\n`,
    );
  } catch (e) {
    spinner.stopAndPersist();
    throw new Error(
      `Something went wrong when extracting the files from the repostory tar file.`,
    );
  }
}
