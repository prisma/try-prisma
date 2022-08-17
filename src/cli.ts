import inquirer from "inquirer";
import getRepoFolders from "./helpers/getRepoFolders";
import downloadTarAndExtract from "./helpers/downloadTarbalAndExtract";
import validate from "./helpers/validation";
import ora from "ora";
import SearchList from "inquirer-search-list";
inquirer.registerPrompt("search-list", SearchList);
import { exec } from "child_process";
import { promisify } from "util";

const execa = promisify(exec);
export default class Cli {
  private projects: string[] = [];
  public answers: {
    template: string;
    install: boolean;
    name: string;
    dirpath: string;
    pkgMgr: string;
  } = {
    template: "",
    install: false,
    name: "",
    dirpath: "",
    pkgMgr: "",
  };

  constructor() {}

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

  public async run() {
    const spinner = ora("Loading example projects").start();
    this.projects = await getRepoFolders();
    spinner.stop();
    this.validateUserInput();

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

    if (!this.answers.install) {
      const { packages } = await inquirer.prompt({
        type: "confirm",
        message: "Should we run `npm install` for you?",
        name: "packages",
        default: false,
      });
      this.answers.install = packages;
    }

    if (!this.answers.pkgMgr.length && this.answers.install) {
      const { manager } = await inquirer.prompt({
        // @ts-ignore
        type: "list",
        message: "Which package manager do you prefer?",
        name: "manager",
        default: "npm",
        choices: ["npm", "Yarn"],
      });
      this.answers.pkgMgr = manager;
    }

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

    if (!this.answers.dirpath.length) {
      const { dirpath } = await inquirer.prompt({
        type: "input",
        message: "Where should the new folder be created?",
        name: "dirpath",
        default: "./",
        validate(answer) {
          return validate.directory(answer);
        },
      });
      this.answers.dirpath = dirpath;
    }

    await this.performSetup();
  }

  public async performSetup() {
    const spinner = ora(
      `Downloading and extracting the ${this.answers.name} project`
    ).start();

    await downloadTarAndExtract(
      this.answers.template,
      `${this.answers.dirpath}/${this.answers.name}`
    );
    if (this.answers.install) {
      spinner.text = `Running \`${this.answers.pkgMgr} install\``;
      await execa(`${this.answers.pkgMgr.toLowerCase()} install`, {
        cwd: `${this.answers.dirpath}/${this.answers.name}`,
      });
    }
    spinner.succeed("You're all set!");

    console.log(this.answers);
    // Finish
  }
}
