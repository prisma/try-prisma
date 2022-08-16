#!/usr/bin/env node
import { Command } from 'commander'
import Cli from './cli'
const program = new Command()

async function main() {
    program.name('create-prisma-app')
        .description('Quickly get up and running with one of Prisma\'s many starter templates.')
        .version('0.0.1')
        .option('-t, --template <template-name>' , 'Which example project would you like to start off with?')
        .parse(process.argv);
    
    const {
        template
    } = program.opts()
    
    const cli = new Cli()
    
    if ( template ) {
        cli.answers.template = template
    }
    
    await cli.run()
    
    console.table(cli.answers)
}
main()