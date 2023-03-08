import validate from "../../src/utils/validation";
import { expect, it } from "vitest";
import { describe } from "vitest";

describe("Validation", () => {
  describe("directoryName()", () => {
    it("Should fail with an invalid directory name", () => {
      const result = validate.directoryName("aux");
      expect(result).not.toBe(true);
    });
    it("Should return true if valid", () => {
      const result = validate.directoryName("name");
      expect(result).toBe(true);
    });
  });
  describe("directory()", () => {
    it('Should fail with a path that ends in "/"', () => {
      const result = validate.directory("test/");
      expect(result).not.toBe(true);
    });
    it("Should fail if you try to reach a directory that does not exist", () => {
      const result = validate.directory("/this/does/not/exist");
      expect(result).not.toBe(true);
    });
    it("Should success with a valid directory", () => {
      const result = validate.directory(".");
      expect(result).toBe(true);
    });
  });
  describe("project()", () => {
    it("Should fail if the project is not in the list of available projects", () => {
      const result = validate.project(["1"], "2");
      expect(result).not.toBe(true);
    });
    it("Should succees if a valid project was selected", () => {
      const result = validate.project(["1"], "1");
      expect(result).toBe(true);
    });
  });
});
