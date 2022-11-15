#!/usr/bin/env node
import chalk from 'chalk'
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
    ic.answers.folder = template.split('/')[0]
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
  await download(input);

  if (input.install) {
    await installPackages(input.pkgMgr, `${input.dirpath}/${input.name}`);
  }

  logger.success(`
${chalk.bold(`The project is good to go! Next steps:`)}

${chalk.bold('1. Navigate into the project directory:')}
   ${chalk.hex('#4C51BF')(`cd ${input.dirpath}/${input.name}`)}

${chalk.bold('2. Install dependencies:')}
   ${chalk.hex('#4C51BF')(`npm install`)}

${chalk.bold('3. Create and execute initial migration based on `schema.prisma`:')}
   ${chalk.hex('#4C51BF')(`npx prisma migrate dev`)}

For more information about this project, visit:
${chalk.gray.underline(`https://github.com/prisma/prisma-examples/tree/latest/${input.template}`)}
  `)
  logger.success(
    `If you have any feedback about this specific template, we want to hear it!\nSubmit any feedback here: ${chalk.gray.underline('https://pris.ly/prisma-examples-feedback')}`
  )
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
  if (!process.env.VITEST) {
    process.exit(1);
  }
});

export default main // Exported for testing purposes