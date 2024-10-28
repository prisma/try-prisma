import CLI from "../../src/cli";
import * as getProjects from "../../src/helpers/getProjects";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/helpers/getProjects", () => ({
  default: () => [],
}));

vi.mock("../../src/cli/prompts", () => ({
  default: {
    selectStarterOrExample: async () => "example",
    getTemplate: async () => "template",
    getInstallSelection: async () => true,
    selectManager: async () => "npm",
    getProjectName: async () => "projectName",
    getProjectDirectory: async () => "lskdjf",
    getRootDir: async () => "javascript",
    selectORMorPDP: async () => "orm"
  },
}));

describe("Input Collector", () => {
  let MockCLI: CLI;
  beforeEach(async () => {
    MockCLI = new CLI();
    await MockCLI.initialize();
  });
  describe("initialize()", () => {
    it("Should grab the list of projects", async () => {
      vi.spyOn(getProjects, "default").mockImplementationOnce(async () => []);
      await MockCLI.initialize();
      expect(getProjects.default).toHaveBeenCalled();
    });
  });
  describe("collect()", () => {
    beforeEach(async () => {
      vi.spyOn(MockCLI, "validateUserInput").mockImplementationOnce(() => true);
      vi.spyOn(getProjects, "default").mockImplementationOnce(async () => []);
      await MockCLI.initialize();
    });

    it("Should return the input from the prompts", async () => {
      const input = await MockCLI.collect();
      expect(input).toStrictEqual({
        template: "template",
        install: true,
        pkgMgr: "npm",
        name: "projectName",
        help: false,
        folder: "orm",
        path: ".",
        anonymous: false,
        databaseUrl: "",
        vscode: false,
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });
  });

  describe("validateUserInput()", () => {
    beforeEach(() => {
      vi.mock("../../src/utils/validation", () => ({
        default: {
          project: () => true,
          directoryName: () => true,
          directory: () => true,
        },
      }));
    });
    it("Should return an error if a template is provided and is invalid", () => {
      MockCLI.args.template = "template";
      expect(() => MockCLI.validateUserInput()).toThrow();
    });
    it("Should return an error if a projcet name is provided and is invalid", () => {
      MockCLI.args.name = "com2";
      expect(() => MockCLI.validateUserInput()).toThrow();
    });
    it("Should return an error if a directory name is provided and is invalid", () => {
      MockCLI.args.path = "directory/";
      expect(() => MockCLI.validateUserInput()).toThrow();
    });
    afterEach(() => {
      vi.resetAllMocks();
    });
  });
});
