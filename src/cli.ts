import inquirer from 'inquirer'
import getRepoFolders from './helpers/getRepoFolders'
import SearchList from 'inquirer-search-list'
inquirer.registerPrompt('search-list', SearchList )

export default class Cli {
    public answers: {
        template: String | null,
        install: boolean,
        name: String
    } = {
        template: null,
        install: false,
        name: ''
    }

    constructor(){}

    public async run() {
        const projects = await getRepoFolders()

        if ( !this.answers.template ) {
           const { template } = await inquirer.prompt({
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
            })
            this.answers.template = template
        }

        const { packages } = await inquirer.prompt({
            type: 'confirm',
            message: 'Should we run `npm install` for you?',
            name: 'packages',
            default: false
        })
        this.answers.install = packages

        const { dirname } = await inquirer.prompt({
            type: 'input',
            message: 'What should the project be named?',
            name: 'dirname',
            default: this.answers.template?.replace('/', '_') || '',
            filter: (input) => input.replace('/', '_'),
            validate(answer) {
                let re = /[<>:"\/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
                if (re.test(answer)) {
                    return 'Sorry, that name is invalid.'
                } else {
                    return true
                }
            }
        })
        this.answers.name = dirname
    }

    public downloadRepo() {
        
    }
}