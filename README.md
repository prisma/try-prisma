# create-prisma-app

`create-prisma-app` is a CLI tool that helps you to easily get up and running with any project in the [`prisma/prisma-examples`](https://github.com/prisma/prisma-examples) repository.

## Usage

The easiest way to set up a project using `create-prisma-app` is to run the following command:

```sh copy
npx create-prisma-app
```

This will walk you through a couple of interactive options _(detailed below)_ to help you set up the project.

![GIF of the interactive terminal](https://res.cloudinary.com/sabinthedev/image/upload/v1660715698/CleanShot_2022-08-16_at_22.54.20_xgzr3p.gif)

## Arguments

You can _optionally_ provide arguments to the `npx create-prisma-app` command as an alternative to (or in combination with) the interactive experience.

The options are as follows:

|   Option   | Alias |      Arguments      | Description                                                                                                                                                       |
| :--------: | :---: | :-----------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --template |  -t   |                     | Specifies which example project would you like to start off with.                                                                                                 |
| --install  |  -i   | String _(optional)_ | Specifies you would like to install npm packages automatically after creating the project. You can also specify which package manager to use [npm, yarn, or pnpm] |
|   --name   |  -n   |                     | Name of resulting directory.                                                                                                                                      |
|   --path   |  -p   |                     | Path to the directory where the new folder should be created.                                                                                                     |

## Examples

### Selecting a template and installing packages

You would like to use the template named `typescript/grpc`, install packages automatically:

```sh
npx create-prisma-app -t typescript/grpc --install
```

In this scenario, you will still be prompted to input values for your preferred package manager and the name of the resulting folder.

### Selecting a package manager

If you wanted to use [`yarn`](https://yarnpkg.com/) to install the packages automatically:

```sh
npx create-prisma-app -i yarn
```

### Selecting a directory and folder name

Below, you would create a new project at `../../projects/new_folder`:

```sh
npx create-prisma-app -p ../../projects -n new_folder
```

### All of the options!

Interactive terminal who?? Use all the options!

```npx
npx create-prisma-app -t typescript/grpc -i pnpm -n my_project -p ./projects
```
