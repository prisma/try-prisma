import { Command } from "@molt/command";
import { z } from "zod";

export default () => {
  const args = Command.parameters({
    "t template": z
      .string()
      .optional()
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
    "n name": z.string().optional().describe("Resulting directory's name"),
    "p path": z.string().optional().describe("Resulting directory's location"),
  }).parse();

  return args;
};
