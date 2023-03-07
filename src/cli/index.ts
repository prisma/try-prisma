import { Command } from "@molt/command";
import { z } from "zod";
import { CliInput } from "../utils/types";

export default (): Omit<CliInput, "folder" | "pkgMgr"> => {
  const args = Command.parameters({
    "t template": z
      .string()
      .default("")
      .describe(
        "Available options are folders within the `javascript` and `typescript` directories.",
      ),
    "i install": z
      .union([
        z.boolean().describe("Using -i or --install will assume `true`"),
        z.enum(["npm", "yarn", "pnpm"]).describe("Select a package manager"),
      ])
      .describe("Automatically install packages?")
      .default(false),
    "n name": z.string().default("").describe("Resulting directory's name"),
    "p path": z.string().default("").describe("Resulting directory's location"),
    "a anonymous": z
      .boolean()
      .default(false)
      .describe("Should this invocation be recorded with Prisma's analytics?"),
    "v vscode": z.boolean().default(false).describe("Are you using VSCode?"),
  }).parse();

  return {
    template: args.template,
    dirpath: args.path,
    install: args.install,
    name: args.name,
    anonymous: args.anonymous,
    vscode: args.vscode,
  };
};
