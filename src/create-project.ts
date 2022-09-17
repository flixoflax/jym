import chalk from 'chalk'
import path from 'path'
import { Options } from './types'
import { isFolderEmpty } from './utils/is-folder-empty'
import { isWritable } from './utils/is-writable'
import { makeDir } from './utils/make-dir'

import fs from 'fs'
import os from 'os'
import { tryGitInit } from './utils/git'

export const createProject = async (
  resolvedProjectPath: string,
  options: Options
): Promise<void> => {
  // TODO: Implement createProject method

  const root = path.resolve(resolvedProjectPath)

  // Check if path is writable
  if (!(await isWritable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.'
    )
    console.error(
      "It is likely that you don't have permissions to write to this path."
    )
    process.exit(1)
  }

  // Create folder
  await makeDir(root)
  if (!isFolderEmpty(root, options.name)) {
    process.exit(1)
  }

  // const originalDirectory = process.cwd()

  console.log(`Creating a new Jym SaaS in ${chalk.green(root)}...`)
  console.log()

  process.chdir(root)

  const packageJsonPath = path.join(root, 'package.json')

  /**
   * Create package.json for the new project
   */

  const packageJson = {
    name: options.name,
    description: options.description,
    version: '0.1.0',
    private: true,
    // TODO: Finish package.json (see turborepo)
  }

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + os.EOL
  )

  /**
   * Initialize a git repository
   */
  if (tryGitInit(root)) {
    console.log('Initialized a git repository.')
    console.log()
  }

  /**
   * Print out a success message
   */
  console.log(
    `${chalk.green('Success!')} Created ${
      options.name
    } at ${resolvedProjectPath}`
  )
}
