#!/usr/bin/env node
import CLI from "./cli";
import download from "./helpers/download";
import installPackages from "./helpers/installPackages";
import logger from "./helpers/logger";
import vscodeExtensionSuggestion from "./helpers/vscodeExtensionSuggestion";
import chalk from "chalk";

const main = async () => {
  const cli = new CLI();
  await cli.initialize();
  const input = await cli.collect();
  await download(input);

  if (input.install) {
    await installPackages(input.pkgMgr, `${input.path}/${input.name}`);
  }

  if (input.vscode) {
    await vscodeExtensionSuggestion(input);
  }

  cli.addInstruction(
    "Navigate into the project directory:",
    chalk.hex("#4C51BF")(`cd ${input.path}/${input.name}`),
  );

  if (!input.install) {
    cli.addInstruction(
      "Install dependencies:",
      chalk.hex("#4C51BF")(`npm install`),
    );
  }

  cli.addInstruction(
    "Create and execute initial migration based on `schema.prisma`:",
    chalk.hex("#4C51BF")(`npx prisma migrate dev`),
  );

  logger.success(`
    ${chalk.bold(`The project is good to go! Next steps:`)}
    ${cli.instructions.join("")}
    For more information about this project, visit:
    ${chalk.gray.underline(
      `https://github.com/prisma/prisma-examples/tree/latest/${input.template}`,
    )}
  `);

  logger.success(
    `If you have any feedback about this specific template, we want to hear it!\nSubmit any feedback here: ${chalk.gray.underline(
      "https://pris.ly/prisma-examples-feedback",
    )} `,
  );
};

main().catch((e) => {
  if (e instanceof Error) {
    logger.error(e.message);
  } else {
    logger.error(
      "Something strange happened... If the problem persists, please create a GitHub issue with the error below 👇🏻",
    );
  }
  if (!process.env.VITEST) {
    process.exit(1);
  }
});

export default main;
