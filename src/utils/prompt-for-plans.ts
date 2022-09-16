import inquirer from 'inquirer'
import chalk from 'chalk'
import { Currency, PricingPlan } from '../types'

const orange = chalk.hex('#FFA500')

export const promptForPlans = async (
  currency: Currency
): Promise<PricingPlan[]> => {
  const plans: PricingPlan[] = []
  const withCurrency = (num: number): string =>
    num.toLocaleString(undefined, { style: 'currency', currency })

  const ask = async (): Promise<void> => {
    const prompt = async (): Promise<PricingPlan & { askAgain: boolean }> => {
      const namePrompt = await inquirer.prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: "What's the name of your plan?",
          validate(input, answers?) {
            const valid = input.trim().length > 0
            return valid || 'Please enter a name for your plan'
          },
        },
      ])

      const monthlyPrompt = await inquirer.prompt<{ priceMonth: number }>([
        {
          type: 'input',
          name: 'priceMonth',
          message: `What's the monthly price for your ${orange(
            namePrompt.name
          )} plan?`,
          validate(value: string) {
            const valid = !isNaN(parseFloat(value))
            return valid || 'Please enter a number'
          },
          filter: Number,
        },
      ])

      const restPrompt = await inquirer.prompt<{
        priceYear: number
        features: string[]
      }>([
        {
          type: 'input',
          name: 'priceYear',
          message: `What's the annual price for your ${orange(
            namePrompt.name
          )} plan?`,
          validate(value: string) {
            const valid = !isNaN(parseFloat(value))
            return valid || 'Please enter a number'
          },
          filter: Number,
          default: monthlyPrompt.priceMonth * 12,
        },
        {
          type: 'input',
          name: 'features',
          message: `What are the features for your ${orange(
            namePrompt.name
          )} plan (comma separated e.g. feature 1, feature 2, ...)?`,
          filter(value: string) {
            return value.split(', ')
          },
        },
      ])

      console.log(`
${chalk.green('Alright!')} Created ${orange(
        namePrompt.name
      )} Plan for ${withCurrency(
        monthlyPrompt.priceMonth
      )}/mo and ${withCurrency(restPrompt.priceYear)}/yr!
      `)

      const askAgainPrompt = await inquirer.prompt<{ askAgain: boolean }>([
        {
          type: 'confirm',
          name: 'askAgain',
          message: 'Want to add another pricing plan (just hit enter for YES)?',
          default: true,
        },
      ])

      return {
        ...namePrompt,
        ...monthlyPrompt,
        ...restPrompt,
        ...askAgainPrompt,
      }
    }

    const answers = await prompt()

    plans.push({
      name: answers.name,
      priceMonth: answers.priceMonth,
      priceYear: answers.priceYear,
      features: answers.features,
    })

    if (answers.askAgain) {
      await ask()
    }
  }

  console.log(`
${chalk.green('Alright!')} Let's create some pricing plans!
  `)
  await ask()

  return plans
}
