export type CliInput = {
  template: string;
  install: boolean;
  pkgMgr: "" | "npm" | "yarn" | "pnpm";
  name: string;
  anonymous: boolean;
  vscode: boolean;
  path: string;
  folder: string;
  connectionString?: string;
};
