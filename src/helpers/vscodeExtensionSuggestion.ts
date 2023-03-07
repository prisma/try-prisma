import { exec } from "child_process";
import { promisify } from "util";
const execa = promisify(exec);
import { CliInput } from "../utils/types";
import fs from "fs";
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
  await execa(`mkdir ${options.dirpath}/${options.name}/.vscode`);
  fs.writeFile(
    `${options.dirpath}/${options.name}/.vscode/extensions.json`,
    content,
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    },
  );
}
