# try-prisma

`try-prisma` is a CLI tool that helps you to easily get up and running with any project in the [`prisma/prisma-examples`](https://github.com/prisma/prisma-examples) repository.

> Do you have feedback about a specific example template? Submit it [here](https://pris.ly/prisma-examples-feedback)!

## Usage

The easiest way to set up a project using `try-prisma` is to run the following command:

```sh copy
npx try-prisma
```

This will walk you through a couple of interactive options _(detailed below)_ to help you set up the project.

<div align="center">
<img width="500" alt="CleanShot 2022-08-31 at 13 05 29@2x" src="https://user-images.githubusercontent.com/18456526/187772042-f7b8a419-2038-48f1-b625-b88c471a8764.png">
</div>

## Arguments

You can _optionally_ provide arguments to the `npx try-prisma` command as an alternative to (or in combination with) the interactive experience.

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
npx try-prisma -t typescript/grpc --install
```

In this scenario, you will still be prompted to input values for your preferred package manager and the name of the resulting folder.

### Selecting a package manager

If you wanted to use [`yarn`](https://yarnpkg.com/) to install the packages automatically:

```sh
npx try-prisma -i yarn
```

### Selecting a directory and folder name

Below, you would create a new project at `../../projects/new_folder`:

```sh
npx try-prisma -p ../../projects -n new_folder
```

### All of the options!

Interactive terminal who?? Use all the options!

```npx
npx try-prisma -t typescript/grpc -i pnpm -n my_project -p ./projects
```
