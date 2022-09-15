export type Args = string[]

export enum ComponentType {
  LandingPage = 'Landing Page Template (ApolloJS)',
  WebApp = 'WebApp (NextJS)',
  MobileApp = 'MobileApp (Expo)',
}

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
}

export interface PricingPlan {
  name: string
  priceMonth: number
  priceYear: number
  features: string[]
}

export interface Options {
  description: string
  components: ComponentType[]
  currency: Currency
  plans: PricingPlan[]
}
