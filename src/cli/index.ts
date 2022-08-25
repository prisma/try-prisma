import { Command } from "commander";
import { version } from "../../package.json";
import { CliInput } from "../utils/types";

export default () => {
  const program = new Command();

  program
    .name("try-prisma")
    .description(
      "Quickly get up and running with one of Prisma's many starter templates.",
    )
    .version(version)
    .option(
      "-t, --template <template-name>",
      "Which example project would you like to start off with?",
    )
    .option(
      "-i, --install [package-manager]",
      "Specifies you would like to install npm packages automatically after creating the project. You can also specify which package manager to use [npm, yarn, or pnpm]",
    )
    .option(
      "-n, --name <project-name>",
      "What should the resulting directory be named?",
    )
    .option(
      "-p, --path <dir-path>",
      "Where should the resulting directory be created?",
    )
    .parse(process.argv);

  return program.opts<CliInput>();
};
