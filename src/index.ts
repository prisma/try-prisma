#!/usr/bin/env node
import InputCollector from "./cli/input-collector";
import logger from "./utils/logger";
import CLI from "./cli";
import download from "./helpers/download";
import installPackages from "./helpers/installPackages";

const main = async () => {
  const { template, install, name, dirpath } = CLI();
  const ic = new InputCollector();

  // Pre-populate the input collector with CLI input
  if (template) {
    ic.answers.template = template;
  }

  if (name) {
    ic.answers.name = name.replace("/", "_").trim();
  }

  if (install) {
    ic.answers.install = true;
    if (typeof install === "string" && install.trim().length) {
      ic.answers.pkgMgr = install.trim();
    }
  }

  if (dirpath) {
    ic.answers.dirpath = dirpath;
  }

  // Collect any manually entered input and supplement the pre-populated values
  const input = await ic.collect();
  // Download template and optionally install packages
  await download(input.template, `${input.dirpath}/${input.name}`);
  if (input.install) {
    await installPackages(input.pkgMgr, `${input.dirpath}/${input.name}`);
  }

  logger.success(
    `The project is good to go! Check it out at: \`${input.dirpath}/${input.name}\``,
  );
};

main().catch((e) => {
  if (e instanceof Error) {
    logger.error(e);
  } else {
    logger.error(
      "Something strange happened... If the problem persists, please create a GitHub issue with the error below 👇🏻",
    );
    console.log(e);
  }
  process.exit(1);
});
