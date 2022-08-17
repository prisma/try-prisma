import inquirer from "inquirer";
import getRepoFolders from "./helpers/getRepoFolders";
import downloadAndExtractRepoTar from "./helpers/downloadAndExtractRepoTar";
import validate from "./helpers/validation";
import ora from "ora";
import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
import type { CliInput } from "./types";
import logger from "./helpers/logger";
import SearchList from "inquirer-search-list";

inquirer.registerPrompt("search-list", SearchList);

const execa = promisify(exec);

export default class Cli {
  private projects: string[] = [];
  private spinner = ora();
  private ui = new inquirer.ui.BottomBar();
  public answers: CliInput = {
    template: "",
    install: false,
    name: "",
    dirpath: "",
    pkgMgr: "",
  };

  private validateUserInput() {
    if (this.answers.template.length) {
      const valid = validate.project(this.projects, this.answers.template);
      if (typeof valid === "string") {
        throw Error(valid);
      }
    }

    if (this.answers.name.length) {
      const valid = validate.directoryName(this.answers.name);
      if (typeof valid === "string") {
        throw Error(valid);
      }
    }

    if (this.answers.dirpath.length) {
      const valid = validate.directory(this.answers.dirpath);
      if (typeof valid === "string") {
        throw Error(valid);
      }
    }
  }

  private async getTemplate() {
    if (!this.answers.template.length) {
      const { template } = await inquirer.prompt({
        // @ts-ignore
        type: "search-list",
        message: "Which template would you like to use?",
        name: "template",
        choices: this.projects,
        validate: (answer) => {
          return validate.project(this.projects, answer);
        },
      });
      this.answers.template = template;
    }
  }

  private async getInstallSelection() {
    if (!this.answers.install) {
      const { packages } = await inquirer.prompt({
        type: "confirm",
        message: `Should we automatically install packages for you?`,
        name: "packages",
        default: false,
      });
      this.answers.install = packages;
    }

    if (!this.answers.pkgMgr.length && this.answers.install) {
      const { manager } = await inquirer.prompt({
        type: "list",
        message: "Which package manager do you prefer?",
        name: "manager",
        default: process.env.npm_config_user_agent,
        choices: ["npm", "Yarn", "pnpm"],
      });
      this.answers.pkgMgr = manager;
    }
  }

  private async getProjectName() {
    if (!this.answers.name.length) {
      const { dirname } = await inquirer.prompt({
        type: "input",
        message: "What should the project be named?",
        name: "dirname",
        default: this.answers.template?.replace("/", "_") || "",
        filter: (input) => input.replace("/", "_").trim(),
        validate(answer) {
          return validate.directoryName(answer);
        },
      });
      this.answers.name = dirname;
    }
  }

  private async getProjectDirectory() {
    if (!this.answers.dirpath.length) {
      const { dirpath } = await inquirer.prompt({
        type: "input",
        message: "Where should the new folder be created?",
        name: "dirpath",
        default: ".",
        validate(answer) {
          return validate.directory(answer);
        },
      });
      this.answers.dirpath = dirpath;
    }
  }

  private async handleRepoProject() {
    this.spinner.start(
      `Downloading and extracting the ${this.answers.name} project`
    );
    await downloadAndExtractRepoTar(
      this.answers.template,
      `${this.answers.dirpath}/${this.answers.name}`
    );
    this.spinner.succeed(
      `Downloaded and extracted the ${this.answers.name} project.`
    );
  }

  private async installPackages() {
    this.spinner.start(
      `Running ${chalk.greenBright(
        `\`${this.answers.pkgMgr} install\``
      )}. This may take a bit...`
    );

    try {
      // Run the install command
      await execa(`${this.answers.pkgMgr.toLowerCase()} install`, {
        cwd: `${this.answers.dirpath}/${this.answers.name}`,
      });
      this.spinner.succeed(`Installed packages.`);
    } catch (e) {
      this.spinner.stopAndPersist();
      throw Error(
        `There was a problem installing your packages.\n${e.message}${
          // If this was a "command not found" error, let the user know they can install the pkgMgr and run it manually
          e.message.indexOf("command not found") > -1
            ? chalk.cyan(
                `No worries. Once you install ${chalk.green(
                  this.answers.pkgMgr
                )} you can run ${chalk.green(
                  `${this.answers.pkgMgr} install`
                )} again.`
              )
            : ""
        }`
      );
    }
  }

  public async run() {
    // Load the list of available templates
    this.spinner.text = "Loading example projects";
    this.spinner.start();
    this.projects = await getRepoFolders();
    this.spinner.succeed(`Loaded ${this.projects.length} templates`);

    // Validate user input from command line options
    this.validateUserInput();

    // Collect user input
    await this.getTemplate();
    await this.getInstallSelection();
    await this.getProjectName();
    await this.getProjectDirectory();

    // Scaffold the project
    await this.handleRepoProject();

    // Install the npm packages
    if (this.answers.install) {
      await this.installPackages();
    }

    logger.success(
      `The project is good to go! Check it out at: \`${this.answers.dirpath}/${this.answers.name}\``
    );
  }
}
