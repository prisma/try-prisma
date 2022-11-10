import inquirer from "inquirer";
import SearchList from "inquirer-search-list";
import validate from "../utils/validation";
import chalk from 'chalk'
import logger from '../utils/logger'

inquirer.registerPrompt("search-list", SearchList);
const getTemplate = async (projects: string[]): Promise<string> => {
  logger.success(`\nDon't see what you're looking for? Request a new template here:\n\xa0\xa0➡ ${chalk.gray('https://pris.ly/prisma-examples-suggestion')}\n`)
  const { template } = await inquirer.prompt({
    // @ts-expect-error Inquirer doesn't register the type.
    type: "search-list",
    message: `Which template would you like to use?`,
    name: "template",
    choices: projects,
    validate: (answer) => {
      return validate.project(projects, answer);
    },
  });

  return template;
};

const getRootDir = async (): Promise<string> => {
  logger.success(`\nThese options correspond to the root directories in the prisma-examples repository:\n`)
  const { rootDir } = await inquirer.prompt({
    // @ts-expect-error Inquirer doesn't register the type.
    type: "search-list",
    message: `Which language do you want to use?`,
    name: "rootDir",
    choices: [{
      name: 'TypeScript',
      value: 'typescript'
    }, {
      name: 'JavaScript',
      value: 'javascript'
    }]
  });

  return rootDir;
};

const getInstallSelection = async (): Promise<boolean> => {
  const { packages } = await inquirer.prompt({
    type: "confirm",
    message: `Should we automatically install packages for you?`,
    name: "packages",
    default: false,
  });
  return Boolean(packages);
};

const selectManager = async (): Promise<string> => {
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
    message: "What should the project be named?",
    name: "dirname",
    default: defaultValue,
    filter: (input) => input.replace("/", "_").trim(),
    validate(answer) {
      return validate.directoryName(answer);
    },
  });
  return dirname;
};

const getProjectDirectory = async (): Promise<string> => {
  const { dirpath } = await inquirer.prompt({
    type: "input",
    message: "Where should the new folder be created?",
    name: "dirpath",
    default: ".",
    validate(answer) {
      return validate.directory(answer);
    },
  });
  return dirpath;
};

export default {
  getInstallSelection,
  getProjectDirectory,
  getProjectName,
  selectManager,
  getTemplate,
  getRootDir
};
