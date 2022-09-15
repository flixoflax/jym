import { ComponentType, Currency, Options } from '../types'
import inquirer from 'inquirer'
import { promptForPlans } from './prompt-for-plans'
import { validateNpmName } from './validate-pkg'
import path from 'path'

export const promptForOptions = async (name: string): Promise<Options> => {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Whats the name of the project?',
      validate: (name: string) => {
        const validation = validateNpmName(path.basename(path.resolve(name)))
        if (validation.valid) {
          return true
        }
        return 'Invalid project name: ' + validation.problems![0]
      },
      default: name,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Whats your project about?',
    },
    {
      type: 'checkbox',
      name: 'components',
      message: 'Which components does your project require?',
      choices: [
        {
          name: ComponentType.LandingPage,
        },
        {
          name: ComponentType.WebApp,
        },
        {
          name: ComponentType.MobileApp,
        },
      ],
      validate(answer: ComponentType[]) {
        if (answer.length < 1) {
          return 'You must choose at least one project component.'
        }

        return true
      },
    },
    {
      type: 'list',
      name: 'currency',
      message: 'Please choose a currency for your pricing plans',
      choices: [Currency.EUR, Currency.USD],
    },
  ]

  const baseOptions = await inquirer.prompt<Options>(questions)

  baseOptions.plans = await promptForPlans(baseOptions.currency)

  return baseOptions
}
