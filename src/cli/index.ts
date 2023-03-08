import { Command } from "@molt/command";
import ora from "ora";
import chalk from "chalk";
import { CliInput } from "../types";
import validation from "./validation";
import { getProjects } from "../helpers";
import parameters from "./parameters";
import prompts from "./prompts";

export default class Cli {
  instructions: string[] = [];
  projects: string[] = [];
  args: CliInput;

  constructor() {
    const cliArgs = Command.parameters(parameters).parse();
    cliArgs.name = cliArgs.name ? cliArgs.name.replace("/", "_").trim() : "";
    const folder = cliArgs.template ? cliArgs.template.split("/")[0] : "";
    this.args = { ...cliArgs, folder, install: false, pkgMgr: "" };
    this.extractManualIntallInstructions(cliArgs.install);
    this.validateUserInput();
  }

  extractManualIntallInstructions(install: boolean | "npm" | "yarn" | "pnpm") {
    if (typeof install !== "string") {
      this.args.install = install;
      this.args.pkgMgr = "";
    } else {
      this.args.pkgMgr = install;
      this.args.install = true;
    }
  }

  addInstruction(name: string, details: string) {
    this.instructions.push(`
      ${chalk.bold(`${this.instructions.length + 1}. ${name}`)}
      ${details}
    `);
  }

  validateUserInput() {
    if (this.args.folder.length) {
      validation.rootDir(this.args.folder);
    }
    if (this.args.template.length) {
      validation.project(this.projects, this.args.template);
    }
    if (this.args.name.length) {
      validation.directoryName(this.args.name);
    }
    if (this.args.path.length) {
      validation.directory(this.args.path);
    }
  }

  async collect() {
    // Load the list of available templates
    const spinner = ora();
    spinner.text = "Loading example projects";
    spinner.start();
    this.projects = await getProjects();
    spinner.succeed(`Loaded ${this.projects.length} templates`);

    // Collect user input
    if (!this.args.folder.length) {
      this.args.folder = await prompts.getRootDir();
      this.projects = this.projects.filter((project) =>
        project.startsWith(this.args.folder),
      );
    }

    if (!this.args.template.length) {
      this.args.template = await prompts.getTemplate(this.projects);
    }

    if (!this.args.install) {
      this.args.install = await prompts.getInstallSelection();
    }

    if (!this.args.pkgMgr.length && this.args.install) {
      this.args.pkgMgr = await prompts.selectManager();
    }

    if (!this.args.name.length) {
      this.args.name = await prompts.getProjectName(
        this.args.template?.replace("/", "_"),
      );
    }

    if (!this.args.path.length) {
      this.args.path = await prompts.getProjectDirectory();
    }

    return this.args;
  }
}
