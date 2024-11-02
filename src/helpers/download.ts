import { EXAMPLES_REPO_TAR, EXAMPLES_REPO_INTERCEPTOR } from "../constants";
import { CliInput } from "../types";
import gunzip from "gunzip-maybe";
import ora from "ora";
import path from "path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import tar from "tar-fs";

export default async function download(options: CliInput): Promise<void> {
  if (!options.template.length) {
    throw new Error(
      `No project was selected from the prisma/prisma-examples repository.`,
    );
  }

  const templateName =
    options.template === "databases/prisma-postgres"
      ? "Prisma Starter"
      : options.template;

  const spinner = ora();
  spinner.start(`Downloading and extracting the ${templateName} project`);

  try {
    // Download the repo via the interceptor
    let response = await fetch(EXAMPLES_REPO_INTERCEPTOR, {
      method: "POST",
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      // fallback to GitHub direct download
      response = await fetch(EXAMPLES_REPO_TAR, {
        method: "GET",
      });
    }

    if (!response.ok || !response.body) {
      throw new Error(
        `Failed to fetch prisma/prisma-examples. Status: ${response.status}`,
      );
    }

    await pipeline(
      Readable.from(response.body),
      gunzip(),
      tar.extract(`${options.path}/${options.name}`, {
        map(header) {
          const originalDirName = header.name.split("/")[0];
          header.name = header.name.replace(`${originalDirName}/`, "");

          const normalizedTemplate = options.template
            .split(path.sep)
            .join(path.posix.sep);

          if (header.name.startsWith(`${normalizedTemplate}/`)) {
            header.name = header.name.replace(normalizedTemplate, "");
          } else {
            header.name = "[[ignore-me]]";
          }

          return header;
        },
        ignore(_filename, header) {
          if (!header) {
            throw new Error(`Header is undefined`);
          }
          return header.name === "[[ignore-me]]";
        },
      }),
    );
  } catch (error) {
    spinner.fail();
    throw new Error(
      `Failed to download or extract files: ${(error as Error).message}`,
    );
  }
  spinner.succeed(
    `Downloaded and extracted the ${options.template} project in ${options.path}/${options.name}.\n`,
  );
}
