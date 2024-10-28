<div align=center>

![readme-try-prisma](https://user-images.githubusercontent.com/18456526/202004157-e7c97399-1669-4d80-899c-537e09758214.png)

[![Tests](https://github.com/prisma/try-prisma/actions/workflows/test.yml/badge.svg)](https://github.com/prisma/try-prisma/actions/workflows/test.yml)
[![Linting](https://github.com/prisma/try-prisma/actions/workflows/lint.yml/badge.svg)](https://github.com/prisma/try-prisma/actions/workflows/lint.yml)

</div>

`try-prisma` is a CLI tool that helps you easily get up and running with any project from the [`prisma/prisma-examples`](https://github.com/prisma/prisma-examples) repository.

These projects are meant to be playgrounds for you to test integrations and features, _not production-ready boilerplates or templates_.

> Do you have feedback about a specific example template? Submit it [here](https://pris.ly/prisma-examples-feedback)!

## Usage

The easiest way to set up a project using `try-prisma` is to run the following command:

```sh copy
npx try-prisma
```

This will walk you through a set of interactive options _(detailed below)_ to help you set up your project.

## Arguments

You can _optionally_ provide arguments to the `npx try-prisma` command as an alternative to (or in combination with) the interactive experience.

The options are as follows:

|      Option      | Alias |      Arguments       |            Default            | Description                                                                                                                                                          |
| :--------------: | :---: | :------------------: | :---------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `--install`    |  -i   |       Boolean        |            `false`            |                                                                                                                                                                      | Specifies if you would like to install npm packages automatically after creating the project. You can also specify which package manager to use: `npm`, `yarn`, or `pnpm` |
|     `--name`     |  -n   |                      | Name of the selected template | Defines the name of the resulting directory.                                                                                                                         |
|   `--template`   |  -t   |                      |              n/a              | Specifies which example project you would like to start off with.                                                                                                    |
| `--database-url` |  -d   |                      |              n/a              | Specifies the database URL you would like to use for the project.                                                                                                    |
|    `--vscode`    |  -v   | Boolean _(optional)_ |            `false`            | Adds a `.vscode` folder with an `extensions.json` file suggesting the [Prisma VS Code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma). |

## Examples

### Selecting a template and installing packages

You would like to use the template named `orm/grpc`, and install packages automatically:

```sh
npx try-prisma -t orm/grpc --install
```

In this scenario, you will still be prompted to input values for your preferred package manager and the name of the resulting folder.

### Selecting a package manager

If you wanted to use [`yarn`](https://yarnpkg.com/) to install the packages automatically:

```sh
npx try-prisma -i yarn
```

### Selecting a folder name

You can create a new project in the current directory by executing the following:

```sh
npx try-prisma -n new_folder
```

### All of the options!

Interactive terminal who?? Use all the options!

```npx
npx try-prisma -t orm/grpc -i pnpm -n my_project
```
