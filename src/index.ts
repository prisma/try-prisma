#!/usr/bin/env node
import { Command } from "commander";
import Cli from "./cli";
import logger from "./helpers/logger";

const program = new Command();

async function main() {
  program
    .name("create-prisma-app")
    .description(
      "Quickly get up and running with one of Prisma's many starter templates."
    )
    .version("0.0.1")
    .option(
      "-t, --template <template-name>",
      "Which example project would you like to start off with?"
    )
    .option(
      "-i, --install",
      "Specifies you would like to run `npm install` automatically after creating the project."
    )
    .option(
      "-n, --name <project-name>",
      "What should the resulting directory be named?"
    )
    .option(
      "-p, --path <dir-path>",
      "Where should the resulting directory be created?"
    )
    .parse(process.argv);

  const { template, install, name, path } = program.opts();

  const cli = new Cli();

  if (template) {
    cli.answers.template = template;
  }
  if (name) {
    cli.answers.name = name.replace("/", "_").trim();
  }
  if (install) {
    cli.answers.install = true;
  }
  if (path) {
    cli.answers.dirpath = path;
  }

  try {
    await cli.run();
  } catch (e) {
    logger.error(e.message || "");
  }
}
main();
