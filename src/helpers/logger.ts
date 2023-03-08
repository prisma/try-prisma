import chalk from "chalk";
import dedent from "dedent";

export default {
  error: (message: string) => {
    console.log(chalk.redBright(dedent(message)));
  },
  success: (message: string) => {
    console.log(dedent(message));
  },
};
