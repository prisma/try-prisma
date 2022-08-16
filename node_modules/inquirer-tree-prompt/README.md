## Inquirer Tree Prompt

Heavily based on [inquirer-file-tree-selection](https://github.com/anc95/inquirer-file-tree-selection/blob/master/index.js) by `anc95`.

### QuickDemo

![QuickDemo](./example/screenshot.gif)

### Install

```
npm install inquirer-tree-prompt
```

### Usage

```
const TreePrompt = require('inquirer-tree-prompt');

inquirer.registerPrompt('tree', TreePrompt);

inquirer.prompt({
    type: 'tree',
    ...
})
```

### Options

Takes `type`, `name`, `message`, `tree`, [`filter`, `validate`, `transformer`, `pageSize`, `loop`, `onlyShowValid`, `hideChildrenOfValid`, `multiple`] properties.

The extra options that this plugin provides are:

- `tree`: (Array) list of tree items or (optionally asynchronous) function to obtain them; items are strings or objects with:
  - `name`: (String) to display in list; must provide this or `value`
  - `value`: (String) to put in answers hash; must provide this or `name`
  - `short`: (String) to display after selection
  - `open`: (Boolean) whether the item is expanded or collapsed
  - `children`: (Array or Function) list of child tree items or (optionally asynchronous) function to obtain them; function may return replacement item instead of just list of children

- `onlyShowValid`: (Boolean) if true, will only show valid items (if `validate` is provided). Default: false.

- `hideChildrenOfValid`: (Boolean) if true, will hide children of valid items (if `validate` is provided). Default: false.

- `transformer`: (Function) a hook function to transform the display of item's value (when `name` is not given).

- `multiple`: (Boolean) if true, will enable to select multiple items. Default: false.

### Example

```
const inquirer = require('inquirer');
const TreePrompt = require('inquirer-tree-prompt');

inquirer.registerPrompt('tree', TreePrompt);

inquirer
    .prompt([
        {
            type: 'tree',
            name: 'location',
            message: 'Where is my phone?',
            tree: [
                {
                    value: "in the house",
                    open: true,
                    children: [
                        {
                            value: "in the living room",
                            children: [
                                "on the sofa",
                                "on the TV cabinet"
                            ]
                        },
                        {
                            value: "in the bedroom",
                            children: [
                                "under the bedclothes",
                                "on the bedside table"
                            ]
                        },
                        "in the bathroom"
                    ]
                },
                {
                    value: "in the car",
                    children: [
                        "on the dash",
                        "in the compartment",
                        "on the seat"
                    ]
                }
            ]
        }
    ])
    .then(answers => {
        console.log(JSON.stringify(answers))
    });
```
