import getRepoFolders from "./helpers/getRepoFolders";
import downloadAndExtractRepoTar from "./helpers/downloadAndExtractRepoTar";
import validate from "./helpers/validation";
import ora from "ora";
import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
import type { CliInput } from "./types";
import logger from "./helpers/logger";
import ic from "./helpers/input-collector";

const execa = promisify(exec);

export default class Cli {
  projects: string[] = [];
  spinner = ora();
  public answers: CliInput = {
    template: "",
    install: false,
    name: "",
    dirpath: "",
    pkgMgr: "",
  };

  validateUserInput() {
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

  async handleRepoProject() {
    this.spinner.start(
      `Downloading and extracting the ${this.answers.name} project`,
    );
    await downloadAndExtractRepoTar(
      this.answers.template,
      `${this.answers.dirpath}/${this.answers.name}`,
    );
    this.spinner.succeed(
      `Downloaded and extracted the ${this.answers.name} project.`,
    );
  }

  async installPackages() {
    this.spinner.start(
      `Running ${chalk.greenBright(
        `\`${this.answers.pkgMgr} install\``,
      )}. This may take a bit...`,
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
                  this.answers.pkgMgr,
                )} you can run ${chalk.green(
                  `${this.answers.pkgMgr} install`,
                )} again.`,
              )
            : ""
        }`,
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
    if (!this.answers.template.length) {
      this.answers.template = await ic.getTemplate(this.projects);
    }
    if (!this.answers.install) {
      this.answers.install = await ic.getInstallSelection();
    }
    if (!this.answers.pkgMgr.length) {
      this.answers.pkgMgr = await ic.selectManager();
    }
    if (!this.answers.name.length) {
      this.answers.name = await ic.getProjectName(
        this.answers.template?.replace("/", "_"),
      );
    }
    if (!this.answers.dirpath.length) {
      this.answers.dirpath = await ic.getProjectDirectory();
    }

    // Scaffold the project
    await this.handleRepoProject();

    // Install the npm packages
    if (this.answers.install) {
      await this.installPackages();
    }

    logger.success(
      `The project is good to go! Check it out at: \`${this.answers.dirpath}/${this.answers.name}\``,
    );
  }
}
