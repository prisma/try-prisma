import logger from "../helpers/logger";
import validate from "./validation";
import chalk from "chalk";
import inquirer from "inquirer";
import SearchList from "inquirer-search-list";

inquirer.registerPrompt("search-list", SearchList);

const getTemplate = async (projects: string[]): Promise<string> => {
  logger.success(
    `\nDon't see what you're looking for? Request a new template here:\n\xa0\xa0➡ ${chalk.underline.gray(
      "https://pris.ly/prisma-examples-suggestion",
    )}\n`,
  );
  const { template } = await inquirer.prompt({
    // @ts-expect-error Inquirer doesn't register the type.
    type: "search-list",
    message: `Which template would you like to use?`,
    name: "template",
    choices: projects,
    validate: (answer) => {
      try {
        validate.project(projects, answer);
      } catch (e) {
        return false;
      }
      return true;
    },
  });

  return template;
};

const selectORMorPDP = async (): Promise<string> => {
  logger.success(
    `\nThese options correspond to the root directories in the prisma-examples repository:\n`,
  );
  const { start } = await inquirer.prompt({
    // @ts-expect-error Inquirer doesn't register the type.
    type: "search-list",
    message: `Which Prisma product would you like to explore?`,
    name: "start",
    choices: [
      {
        name: "Prisma ORM (Define Prisma schema and run queries)",
        value: "orm",
      },
      {
        name: "Prisma Accelerate (Perform caching and connection pooling)",
        value: "accelerate",
      },
      {
        name: "Prisma Pulse (Monitor and react to real-time database changes)",
        value: "pulse",
      },
      {
        name: "Prisma Optimize (Analyze and improve query performance)",
        value: "optimize",
      }
    ],
  });

  return start;
};

const getRootDir = async (): Promise<string> => {
  logger.success(
    `\nThese options correspond to the root directories in the prisma-examples repository:\n`,
  );
  const { rootDir } = await inquirer.prompt({
    // @ts-expect-error Inquirer doesn't register the type.
    type: "search-list",
    message: `Which language do you want to use?`,
    name: "rootDir",
    choices: [
      {
        name: "TypeScript",
        value: "typescript",
      },
      {
        name: "JavaScript",
        value: "javascript",
      },
    ],
  });

  return rootDir;
};

const getInstallSelection = async (): Promise<boolean> => {
  const { packages } = await inquirer.prompt({
    type: "confirm",
    message: `Should we automatically install packages for you?`,
    name: "packages",
    default: true,
  });
  return Boolean(packages);
};

const selectManager = async (): Promise<"npm" | "yarn" | "pnpm"> => {
  const { manager } = await inquirer.prompt({
    type: "list",
    message: "Which package manager do you prefer?",
    name: "manager",
    default: process.env.npm_config_user_agent,
    choices: ["npm", "yarn", "pnpm"],
  });
  return manager;
};

const getProjectName = async (defaultValue = ""): Promise<string> => {
  const { dirname } = await inquirer.prompt({
    type: "input",
    message: "What should the project folder be named?",
    name: "dirname",
    default: defaultValue,
    filter: (input) => input.replace("/", "_").trim(),
    validate(answer) {
      try {
        validate.directoryName(answer);
      } catch (e) {
        console.log("\n✗ " + chalk.red(e.message))
        return false;
      }
      return true;
    },
  });
  return dirname;
};

const getProjectDirectory = async (): Promise<string> => {
  return "."
};

export default {
  selectORMorPDP,
  getInstallSelection,
  getProjectDirectory,
  getProjectName,
  selectManager,
  getTemplate,
  getRootDir,
};
