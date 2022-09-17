import type { Args, Options } from './types'
import { promptForOptions } from './utils/prompt-for-options'
import { Command } from 'commander'

import packageJson from '../package.json'
import chalk from 'chalk'
import path from 'path'
import { validateNpmName } from './utils/validate-pkg'
import { createProject } from './utils/create-project'

const orange = chalk.hex('#FFA500') // custom color orange

export async function cli(args: Args): Promise<void> {
  let projectPath = ''

  new Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action((name) => {
      projectPath = name
    })
    .allowUnknownOption()
    .exitOverride((err) => {
      if (err) {
        console.log(
          '\nPlease specify the project directory:\n' +
            `  ${orange(packageJson.name)} ${chalk.gray(
              '<project-directory>'
            )}\n` +
            'For example:\n' +
            `  ${orange(packageJson.name)} ${chalk.gray('my-jym-saas')}\n\n` +
            `Run ${orange(`${packageJson.name} --help`)} to see all options.`
        )
      }
      process.exit(1)
    })
    .parse(args)

  projectPath = projectPath.trim()
  const resolvedProjectPath = path.resolve(projectPath)
  const projectName = path.basename(resolvedProjectPath)

  /**
   * Check if the projectName is valid
   */
  const { valid, problems } = validateNpmName(projectName)
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    )

    problems?.forEach((p) => console.error(`    ${chalk.red.bold('*')} ${p}`))
    process.exit(1)
  }

  /**
   * Display CLI header
   */
  console.log(`
  ${orange('\\   /\\')}
  ${orange(")  ( ')")}     ${chalk.gray('Start a SaaS with')} ${chalk.bold(
    orange(packageJson.name)
  )} 😺
 ${orange('(  /  )')}      ${chalk.greenBright('v' + packageJson.version)} 
  ${orange('\\(__)|')}
  `)

  const options: Options = await promptForOptions(projectName)
  await createProject(projectName, options) // Create project

  console.log(options) // Log options
}
