import getProjects from "../helpers/getProjects";
import validate from "../utils/validation";
import ora from "ora";
import type { CliInput } from "../utils/types";
import prompts from "./prompts";

export default class InteractiveCli {
  projects: string[] = [];
  answers: CliInput = {
    template: "",
    folder: "",
    install: false,
    name: "",
    dirpath: "",
    pkgMgr: "",
    anonymous: false,
  };

  validateUserInput() {
    if (this.answers.folder.length) {
      const valid = validate.rootDir(this.answers.folder);
      if (typeof valid === "string") {
        throw Error(valid);
      }
    }
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

  async collect() {
    // Load the list of available templates
    const spinner = ora();
    spinner.text = "Loading example projects";
    spinner.start();
    this.projects = await getProjects();
    spinner.succeed(`Loaded ${this.projects.length} templates`);

    // Validate user input from command line options
    this.validateUserInput();

    // Collect user input
    if (!this.answers.folder.length) {
      this.answers.folder = await prompts.getRootDir();
      this.projects = this.projects.filter((project) =>
        project.startsWith(this.answers.folder),
      );
    }
    if (!this.answers.template.length) {
      this.answers.template = await prompts.getTemplate(this.projects);
    }
    if (!this.answers.install) {
      this.answers.install = await prompts.getInstallSelection();
    }
    if (!this.answers.pkgMgr.length) {
      this.answers.pkgMgr = await prompts.selectManager();
    }
    if (!this.answers.name.length) {
      this.answers.name = await prompts.getProjectName(
        this.answers.template?.replace("/", "_"),
      );
    }
    if (!this.answers.dirpath.length) {
      this.answers.dirpath = await prompts.getProjectDirectory();
    }

    return this.answers;
  }
}
