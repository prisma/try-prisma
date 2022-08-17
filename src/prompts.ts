import type { DistinctQuestion } from 'inquirer';
import getRepoFolders from './helpers/getRepoFolders'
import inquirer from 'inquirer'

import InquirerSearchList from 'inquirer-search-list'
inquirer.registerPrompt('search-list', InquirerSearchList);

export default async function () {
    const projects = await getRepoFolders()
    const prompts: DistinctQuestion[] = [
        {
            // @ts-ignore
            type: 'search-list',
            message: 'Which template would you like to use?',
            name: 'template',
            choices: projects,
            validate(answer) {
                if ( !projects.includes(answer) ) {
                    return 'Oops! That isn\'t a valid template.'
                } else {
                    return true
                }
            }
        }, {
            type: 'confirm',
            message: 'Should we run `npm install` for you?',
            name: 'packages',
        }, {
            type: 'input',
            message: 'What should the project be named?',
            name: 'dirname',
            validate(answer) {
                let re = /[<>:"\/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
                if (re.test(answer)) {
                    return 'Sorry, that name is invalid.'
                } else {
                    return true
                }
            }
        }
    ]

    return prompts
}