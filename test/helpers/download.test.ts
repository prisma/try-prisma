import download from "../../src/helpers/download";
import { describe, expect, it, vi } from "vitest";

describe("Download", () => {
  it("Should fail when no template is sent", async () => {
    await expect(
      async () =>
        await download({
          template: "",
          path: "dirpath",
          install: true,
          name: "name",
          databaseUrl: "",
          pkgMgr: "pnpm",
          folder: "typescript",
          anonymous: false,
          vscode: false,
        }),
    ).rejects.toThrow();
  });

  it("Should fail when the fetch for the repo tar fails", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));
    await expect(
      async () =>
        await download({
          template: "template",
          path: "dirpath",
          install: true,
          name: "name",
          databaseUrl: "",
          pkgMgr: "pnpm",
          folder: "typescript",
          vscode: false,
          anonymous: false,
        }),
    ).rejects.toThrow();
  });

  it("Should run the pipeline", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response("body", { status: 200 }));
    vi.mock("stream/promises", () => ({
      pipeline: vi.fn().mockResolvedValue(null),
    }));
    expect(async () => {
      await download({
        template: "template",
        path: "dirpath",
        install: true,
        name: "name",
        databaseUrl: "",
        pkgMgr: "pnpm",
        folder: "typescript",
        vscode: false,
        anonymous: false,
      });
    }).not.toThrow();
  });
});
