import getProjects from "../../src/helpers/getProjects";
import { describe, expect, it, vi } from "vitest";

describe("Get Projects", () => {
  it("Should throw an error if the GET request fails for project data", () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));
    expect(async () => await getProjects()).rejects.toThrow();
  });

  it('Should ignore directories that start with "."', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => ({
        tree: [
          {
            path: ".github/package.json",
            type: "blob",
          },
        ],
      }),
    });
    const data = await getProjects();

    expect(data[0]).toStrictEqual([]);
  });
  it("Should ignore directories that do not have a package.json", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => ({
        tree: [
          {
            path: "test/README.md",
            type: "blob",
          },
          {
            path: "test/index.ts",
            type: "blob",
          },
        ],
      }),
    });
    const data = await getProjects();

    expect(data[0]).toStrictEqual([]);
  });

  it("Should return an array with a file path to a valid project", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => ({
        tree: [
          {
            path: "orm/README.md",
            type: "blob",
          },
          {
            path: "orm/package.json",
            type: "blob",
          },
        ],
      }),
    });
    const data = await getProjects();

    expect(data[0].length).toBe(1);
    expect(data[0]).toContain("orm");
  });

  it('Should work as expected with a "tree" type', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => ({
        tree: [
          {
            path: "orm",
            type: "tree",
          },
          {
            path: "orm/package.json",
            type: "blob",
          },
        ],
      }),
    });
    const data = await getProjects();

    expect(data[0].length).toBe(1);
    expect(data[0]).toContain("orm");
  });

  it("Should return multiple valid projects", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => ({
        tree: [
          {
            path: "accelerate",
            type: "tree",
          },
          {
            path: "accelerate/package.json",
            type: "blob",
          },
          {
            path: "orm",
            type: "tree",
          },
          {
            path: "orm/package.json",
            type: "blob",
          },
        ],
      }),
    });
    const data = await getProjects();
    console.log(data[0]);
    expect(data[0].length).toBe(2);
    expect(data[0]).toContain("orm");
    expect(data[0]).toContain("accelerate");
  });

  it("Should return valid projects and filter bad projects", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => ({
        tree: [
          {
            path: "javascript",
            type: "tree",
          },
          {
            path: "javascript/readme.md",
            type: "blob",
          },
          {
            path: "orm",
            type: "tree",
          },
          {
            path: "orm/package.json",
            type: "blob",
          },
        ],
      }),
    });
    const data = await getProjects();

    expect(data[0].length).toBe(1);
    expect(data[0]).toContain("orm");
  });
});
