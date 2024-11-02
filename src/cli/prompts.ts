import { confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";

import logger from "../helpers/logger";
import validate from "./validation";

const selectStarterOrExample = async (): Promise<string> => {
  return await select({
    message: `How would you like to start your new project?`,
    choices: [
      {
        name: `Prisma Starter (Recommended)`,
        value: "starter",
        description:
          "The Prisma Starter is pre-configured with Prisma ORM, Accelerate, Pulse, and a Prisma Postgres database.",
      },
      {
        name: "Explore other examples",
        value: "example",
        description:
          "Our curated list of examples from the prisma/prisma-examples GitHub repository, showing how to use Prisma ORM with various other tools and frameworks.",
      },
    ],
  });
};

const getTemplate = async (projects: string[]) => {
  logger.success(
    `\nDon't see what you're looking for? Request a new template here:\n\xa0\xa0➡ ${chalk.underline.gray(
      "https://pris.ly/prisma-examples-suggestion",
    )}\n`,
  );
  const result = await select({
    message: `Which template would you like to use?`,
    choices: projects,
  });

  return result;
};

const selectORMorPDP = async () => {
  logger.success(
    `\nThese options correspond to the root directories in the prisma-examples repository:\n`,
  );
  return await select({
    message: `Which Prisma examples would you like to explore?`,
    choices: [
      {
        name: `Prisma ORM`,
        value: "orm",
        description: "Define Prisma schema and run queries",
      },
      {
        name: `Prisma Accelerate`,
        value: "accelerate",
        description: "Perform caching and connection pooling",
      },
      {
        name: `Prisma Pulse`,
        value: "pulse",
        description: "Monitor and react to real-time database changes",
      },
      {
        name: `Prisma Optimize`,
        value: "optimize",
        description: "Analyze and improve query performance",
      },
    ],
  });
};

const getInstallSelection = async () => {
  return confirm({
    message: `Should we automatically install packages for you?`,
    default: true,
  });
};

const selectManager = async (): Promise<"npm" | "yarn" | "pnpm"> => {
  return await select({
    message: "Which package manager do you prefer?",
    default: process.env.npm_config_user_agent,
    choices: ["npm", "yarn", "pnpm"],
  });
};

const getProjectName = async (defaultValue = ""): Promise<string> => {
  return await input({
    message: "What should the project folder be named?",
    default: defaultValue,
    transformer: (input) => input.replace("/", "_").trim(),
    // filter: (input) => input.replace("/", "_").trim(),
    validate(answer) {
      try {
        validate.directoryName(answer);
      } catch (e) {
        console.log("\n✗ " + chalk.red(e.message));
        return false;
      }
      return true;
    },
  });
};

export default {
  selectStarterOrExample,
  selectORMorPDP,
  getInstallSelection,
  getProjectName,
  selectManager,
  getTemplate,
};
