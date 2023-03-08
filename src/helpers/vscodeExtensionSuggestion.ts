import { CliInput } from "../types";
import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";

const execa = promisify(exec);

export default async function vscodeExtensionSuggestion(options: CliInput) {
  const content = `
  {
    // See https://go.microsoft.com/fwlink/?LinkId=827846
    // for the documentation about the extensions.json format
    "recommendations": [
      "Prisma.prisma"
    ]
  }
  `;
  await execa(`mkdir ${options.path}/${options.name}/.vscode`);
  fs.writeFile(
    `${options.path}/${options.name}/.vscode/extensions.json`,
    content,
    (err) => {
      if (err) {
        throw new Error(err?.message);
      }
    },
  );
}
