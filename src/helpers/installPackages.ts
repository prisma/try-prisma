import { CliInput } from "../types";
import execa from "./execa";
import chalk from "chalk";
import ora from "ora";

export default async function installPackages(
  manager: CliInput["pkgMgr"],
  execDir: string,
) {
  const spinner = ora();
  spinner.start(
    `Running ${chalk.greenBright(
      `\`${manager} install\``,
    )} in ${execDir}. This may take a bit...`,
  );

  if (!manager) {
    spinner.stopAndPersist();
    throw Error(`You must specify a package manager to install packages with.`);
  }

  try {
    await execa(`${manager.toLowerCase()} install`, {
      cwd: `${process.cwd()}/${execDir}`,
    });
    spinner.succeed(`Installed packages in ${execDir}.`);
  } catch (e) {
    spinner.stopAndPersist();
    throw Error(
      `There was a problem installing your packages.\n${e.message}${
        e.message.indexOf("command not found") > -1
          ? chalk.cyan(
              `No worries. Once you install ${chalk.green(
                manager,
              )} you can run ${chalk.green(`${manager} install`)} again.`,
            )
          : ""
      }`,
    );
  }
}
