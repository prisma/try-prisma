import chalk from "chalk";

export default {
  error: (message) => {
    console.log(chalk.redBright(message));
  },
  info: (message) => {
    console.log(chalk.cyanBright(message));
  },
  warn: (message) => {
    console.log(chalk.yellowBright(message));
  },
  success: (message) => {
    console.log(chalk.greenBright(message));
  },
};
