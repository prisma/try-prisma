import inquirer from "inquirer";
import getRepoFolders from "./helpers/getRepoFolders";
import downloadTarAndExtract from "./helpers/downloadTarbalAndExtract";
import SearchList from "inquirer-search-list";
import validate from "./helpers/validation";

inquirer.registerPrompt("search-list", SearchList);

export default class Cli {
  private projects: string[] = [];
  public answers: {
    template: string;
    install: boolean;
    name: string;
    dirpath: string;
  } = {
    template: "",
    install: false,
    name: "",
    dirpath: "",
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
    this.projects = await getRepoFolders();

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
    await downloadTarAndExtract(
      this.answers.template,
      `${this.answers.dirpath}/${this.answers.name}`
    );

    if (this.answers.install) {
      // Install the packages if needed
    }

    console.log(this.answers);
    // Finish
  }
}
