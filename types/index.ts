import {
  CarouselSchema,
  CartSchema,
  DeliveryDateSchema,
  OrderInputSchema,
  OrderItemSchema,
  PaymentMethodSchema,
  ProductInputSchema,
  ReviewInputSchema,
  SettingInputSchema,
  ShippingAddressSchema,
  SiteCurrencySchema,
  SiteLanguageSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
  WebPageInputSchema,
} from '@/lib/validator'
import { z } from 'zod'

export type IReviewInput = z.infer<typeof ReviewInputSchema>
export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}
export type IProductInput = z.infer<typeof ProductInputSchema>

export type Data = {
  settings: ISettingInput[]
  webPages: IWebPageInput[]
  users: IUserInput[]
  products: IProductInput[]
  reviews: {
    title: string
    rating: number
    comment: string
  }[]
  headerMenus: {
    name: string
    href: string
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttonCaption: string
    isPublished: boolean
  }[]
}
// Order
export type IOrderInput = z.infer<typeof OrderInputSchema>
export type IOrderList = IOrderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
}
export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

// user
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>

// webpage
export type IWebPageInput = z.infer<typeof WebPageInputSchema>

// setting
export type ICarousel = z.infer<typeof CarouselSchema>
export type ISettingInput = z.infer<typeof SettingInputSchema>
export type ClientSetting = ISettingInput & {
  currency: string
}
export type SiteLanguage = z.infer<typeof SiteLanguageSchema>
export type SiteCurrency = z.infer<typeof SiteCurrencySchema>
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type DeliveryDate = z.infer<typeof DeliveryDateSchema>
