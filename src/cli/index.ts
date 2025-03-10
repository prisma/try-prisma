import { getProjects } from "../helpers";
import { CliInput } from "../types";
import parameters from "./parameters";
import prompts from "./prompts";
import validation from "./validation";
import { Command } from "@molt/command";
import chalk from "chalk";
import ora from "ora";

const PRISMA_STARTER_TEMPLATE = "databases/prisma-postgres";

export default class Cli {
  instructions: string[] = [];
  projects: string[] = [];
  args: CliInput;
  projectsWithSubfolders: string[] = [];

  async initialize() {
    // Grab projects
    const result = await getProjects();

    this.projects = result?.[0] ?? [];
    this.projectsWithSubfolders = result?.[1] ?? [];

    // Parse CLI arguments
    const cliArgs = Command.parameters(parameters).parse();
    // Massage & apply the data
    cliArgs.name = cliArgs.name ? cliArgs.name.replace("/", "_").trim() : "";
    const folder = cliArgs.template ? cliArgs.template.split("/")[0] : "";
    this.args = { ...cliArgs, path: ".", folder, install: false, pkgMgr: "" };
    this.extractManualInstallInstructions(cliArgs.install);
    this.validateUserInput();
  }

  extractManualInstallInstructions(install: boolean | "npm" | "yarn" | "pnpm") {
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

  async getProductFolder(): Promise<void> {
    if (this.args.folder.length) return;
    const starter = await prompts.selectStarterOrExample();
    if (starter === "starter") {
      this.args.folder = PRISMA_STARTER_TEMPLATE.split("/")[0];
      this.args.template = PRISMA_STARTER_TEMPLATE;
      return;
    } else {
      const projects = await prompts.selectORMorPDP();
      if (projects !== "orm") {
        this.args.folder = projects;
      } else {
        // hack from #DA-1540
        this.args.folder = "typescript";
        if (
          this.projects.filter((project) =>
            project.startsWith(this.args.folder),
          ).length === 0
        ) {
          this.args.folder = "orm";
        }
      }
    }
  }

  async collect() {
    // Load the list of available templates
    const spinner = ora();
    spinner.text = "Loading example projects";
    spinner.start();
    spinner.succeed(`Loaded ${this.projects.length} templates`);

    // Collect user input
    await this.getProductFolder();

    // filter projects based on folder
    this.projects = this.projects.filter((project) =>
      project.startsWith(this.args.folder),
    );

    // select template from list of projects
    if (!this.args.template.length) {
      this.args.template = (await prompts.getTemplate(this.projects)) as string;
    }

    if (!this.args.install) {
      this.args.install = await prompts.getInstallSelection();
    }

    if (this.args.install && !this.args.pkgMgr) {
      this.args.pkgMgr = await prompts.selectManager();
    }

    if (!this.args.name.length) {
      const defaultName =
        this.args.template === PRISMA_STARTER_TEMPLATE
          ? "hello-prisma"
          : this.args.template?.replace("/", "_").split("_").slice(1).join("_");

      this.args.name = await prompts.getProjectName(defaultName);
    }

    if (!this.args.path.length) {
      this.args.path = ".";
    }

    return this.args;
  }
}
