import validate from "../../src/cli/validation";
import { expect, it } from "vitest";
import { describe } from "vitest";

describe("Validation", () => {
  describe("directoryName()", () => {
    it("Should fail with an invalid directory name", () => {
      expect(() => validate.directoryName("aux")).toThrow();
    });
    it("Should return true if valid", () => {
      expect(() => validate.directoryName("name")).not.toThrow();
    });
  });
  describe("directory()", () => {
    it('Should fail with a path that ends in "/"', () => {
      expect(() => validate.directory("test/")).toThrow();
    });
    it("Should fail if you try to reach a directory that does not exist", () => {
      expect(() => validate.directory("/this/does/not/exist")).toThrow();
    });
    it("Should success with a valid directory", () => {
      expect(() => validate.directory(".")).not.toThrow();
    });
  });
  describe("project()", () => {
    it("Should fail if the project is not in the list of available projects", () => {
      expect(() => validate.project(["1"], "2")).toThrow();
    });
    it("Should succees if a valid project was selected", () => {
      expect(() => validate.project(["1"], "1")).not.toThrow();
    });
  });
});
