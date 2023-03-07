import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import InputCollector from "../../src/cli/input-collector";
import * as getProjects from "../../src/helpers/getProjects";
import * as validation from "../../src/utils/validation";

vi.mock("../../src/helpers/getProjects", () => ({
  default: () => [],
}));

vi.mock("../../src/cli/prompts", () => ({
  default: {
    getTemplate: async () => "template",
    getInstallSelection: async () => true,
    selectManager: async () => "npm",
    getProjectName: async () => "projectName",
    getProjectDirectory: async () => "lskdjf",
    getRootDir: async () => "javascript",
  },
}));

describe("Input Collector", () => {
  let MockInputCollector;
  beforeEach(() => {
    MockInputCollector = new InputCollector();
  });
  describe("collect()", () => {
    beforeEach(() => {
      vi.spyOn(MockInputCollector, "validateUserInput").mockImplementationOnce(
        () => true,
      );
      vi.spyOn(getProjects, "default").mockImplementationOnce(async () => []);
    });
    afterEach(() => {
      vi.resetAllMocks();
    });
    it("Should validate the initial input", async () => {
      await MockInputCollector.collect();
      expect(MockInputCollector.validateUserInput).toHaveBeenCalled();
    });
    it("Should grab the list of projects", async () => {
      await MockInputCollector.collect();
      expect(getProjects.default).toHaveBeenCalled();
    });
    it("Should return the input from the prompts", async () => {
      const input = await MockInputCollector.collect();
      expect(input).toStrictEqual({
        template: "template",
        install: true,
        pkgMgr: "npm",
        name: "projectName",
        dirpath: "lskdjf",
        folder: "javascript",
        anonymous: false,
      });
    });
  });

  describe("validateUserInput()", () => {
    beforeEach(() => {
      vi.spyOn(getProjects, "default").mockImplementationOnce(async () => []);
      vi.mock("../../src/utils/validation", () => ({
        default: {
          project: () => true,
          directoryName: () => true,
          directory: () => true,
        },
      }));
    });
    afterEach(() => {
      vi.resetAllMocks();
    });
    it("Should return an error if a template is provided and is invalid", () => {
      MockInputCollector.answers.template = "template";
      vi.spyOn(validation.default as any, "project").mockImplementationOnce(
        () => "invalid",
      );
      expect(() => MockInputCollector.validateUserInput()).toThrow();
    });
    it("Should return an error if a projcet name is provided and is invalid", () => {
      MockInputCollector.answers.name = "name";
      vi.spyOn(
        validation.default as any,
        "directoryName",
      ).mockImplementationOnce(() => "invalid");
      expect(() => MockInputCollector.validateUserInput()).toThrow();
    });
    it("Should return an error if a directory name is provided and is invalid", () => {
      MockInputCollector.answers.dirpath = "directory";
      vi.spyOn(validation.default as any, "directory").mockImplementationOnce(
        () => "invalid",
      );
      expect(() => MockInputCollector.validateUserInput()).toThrow();
    });
  });
});
