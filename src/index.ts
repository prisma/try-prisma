#!/usr/bin/env node
import { Command } from "commander";
import Cli from "./cli";
import logger from "./helpers/logger";
import { CliInput } from "./types";

const program = new Command();
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
    "-i, --install [package-manager]",
    "Specifies you would like to run `npm install` automatically after creating the project. You can also specify which package manager to use [npm or yarn]"
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

const { template, install, name, dirpath }: CliInput = program.opts();

const cli = new Cli();

if (template) {
  cli.answers.template = template;
}

if (name) {
  cli.answers.name = name.replace("/", "_").trim();
}

if (install) {
  cli.answers.install = true;
  if (typeof install === "string" && install.trim().length) {
    cli.answers.pkgMgr = install.trim();
  }
}

if (dirpath) {
  cli.answers.dirpath = dirpath;
}

try {
  cli.run();
} catch (e) {
  logger.error(e.message || "");
}
