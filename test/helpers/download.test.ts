import download from "../../src/helpers/download";
import * as fetch from "node-fetch";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Download", () => {
  beforeEach(() => {
    vi.mock("node-fetch", () => ({ default: vi.fn() }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should fail when no template is sent", async () => {
    await expect(
      async () =>
        await download({
          template: "",
          path: "dirpath",
          install: true,
          name: "name",
          pkgMgr: "pnpm",
          folder: "typescript",
          anonymous: false,
          vscode: false,
        }),
    ).rejects.toThrow();
  });

  it("Should fail when the fetch for the repo tar fails", async () => {
    vi.spyOn(fetch as any, "default").mockResolvedValue({ status: 404 });
    await expect(
      async () =>
        await download({
          template: "template",
          path: "dirpath",
          install: true,
          name: "name",
          pkgMgr: "pnpm",
          folder: "typescript",
          vscode: false,
          anonymous: false,
        }),
    ).rejects.toThrow();
  });

  it("Should run the pipeline", async () => {
    vi.mock("util", () => ({
      promisify: () => {
        return () => null;
      },
    }));

    vi.spyOn(fetch as any, "default").mockResolvedValue({ status: 200 });
    expect(async () => {
      await download({
        template: "template",
        path: "dirpath",
        install: true,
        name: "name",
        pkgMgr: "pnpm",
        folder: "typescript",
        vscode: false,
        anonymous: false,
      });
    }).not.toThrow();
  });
});
