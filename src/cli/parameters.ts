import { z } from "zod";

export default {
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
};
