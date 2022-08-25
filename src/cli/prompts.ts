import inquirer from "inquirer";
import SearchList from "inquirer-search-list";
import validate from "../utils/validation";

inquirer.registerPrompt("search-list", SearchList);

const getTemplate = async (projects: string[]): Promise<string> => {
  const { template } = await inquirer.prompt({
    // @ts-expect-error Inquirer doesn't register the type.
    type: "search-list",
    message: "Which template would you like to use?",
    name: "template",
    choices: projects,
    validate: (answer) => {
      return validate.project(projects, answer);
    },
  });
  return template;
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
    choices: ["npm", "Yarn", "pnpm"],
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
};
