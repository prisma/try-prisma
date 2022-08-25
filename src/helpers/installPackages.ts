import ora from "ora";
import { exec } from "child_process";
import { promisify } from "util";
const execa = promisify(exec);
import chalk from "chalk";

export default async function installPackages(
  manager: string,
  execDir: string,
) {
  const spinner = ora();
  spinner.start(
    `Running ${chalk.greenBright(
      `\`${manager} install\``,
    )}. This may take a bit...`,
  );

  try {
    // Run the install command
    await execa(`${manager.toLowerCase()} install`, {
      cwd: `${process.cwd()}/${execDir}`,
    });
    spinner.succeed(`Installed packages.`);
  } catch (e) {
    spinner.stopAndPersist();
    console.log(e)
    throw Error(
      `There was a problem installing your packages.\n${e.message}${
      // If this was a "command not found" error, let the user know they can install the pkgMgr and run it manually
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
