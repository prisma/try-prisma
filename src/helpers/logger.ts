import chalk from "chalk";

export default {
  error: (message: string) => {
    console.log(chalk.redBright(message));
  },
  success: (message: string) => {
    console.log(message);
  },
};
