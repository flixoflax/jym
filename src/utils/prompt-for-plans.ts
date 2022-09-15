import inquirer from 'inquirer'
import { PricingPlan } from '../types'

export const promptForPlans = async (): Promise<PricingPlan[]> => {
  const plans: PricingPlan[] = []
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: "What's the name of your plan?",
    },
    {
      type: 'input',
      name: 'priceMonth',
      message: "What's the monthly price for your plan?",
      validate(value: string) {
        const valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      filter: Number,
    },
    {
      type: 'input',
      name: 'priceYear',
      message: "What's the annual price for your plan?",
      validate(value: string) {
        const valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      filter: Number,
    },
    {
      type: 'input',
      name: 'features',
      message:
        'What are the features for the plan (comma separated e.g. feature 1, feature 2, ...)?',
      filter(value: string) {
        return value.split(', ')
      },
    },
    {
      type: 'confirm',
      name: 'askAgain',
      message: 'Want to add another pricing plan (just hit enter for YES)?',
      default: true,
    },
  ]

  const ask = async (): Promise<void> => {
    const answers = await inquirer.prompt<PricingPlan & { askAgain: boolean }>(
      questions
    )
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

  await ask()

  return plans
}
