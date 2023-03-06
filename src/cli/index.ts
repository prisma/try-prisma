import { Command } from "@molt/command";
import { z } from "zod";

export default () => {
  const args = Command.parameters({
    "t template": z.string(),
    "i install": z.union([z.boolean(), z.enum(["npm", "yarn", "pnpm"])]),
    "n name": z.string(),
    "p path": z.string(),
  }).parse();

  return args;
};
