# 36-make-website-multilingual

## update lib/validator.ts

```ts
// Setting

export const SiteLanguageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
})
export const CarouselSchema = z.object({
  title: z.string().min(1, 'title is required'),
  url: z.string().min(1, 'url is required'),
  image: z.string().min(1, 'image is required'),
  buttonCaption: z.string().min(1, 'buttonCaption is required'),
})

export const SiteCurrencySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  convertRate: z.coerce.number().min(0, 'Convert rate must be at least 0'),
  symbol: z.string().min(1, 'Symbol is required'),
})

export const PaymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  commission: z.coerce.number().min(0, 'Commission must be at least 0'),
})

export const DeliveryDateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  daysToDeliver: z.number().min(0, 'Days to deliver must be at least 0'),
  shippingPrice: z.coerce.number().min(0, 'Shipping price must be at least 0'),
  freeShippingMinPrice: z.coerce
    .number()
    .min(0, 'Free shipping min amount must be at least 0'),
})

export const SettingInputSchema = z.object({
  // PROMPT: create fields
  // codeium, based on the mongoose schema for settings
  common: z.object({
    pageSize: z.coerce
      .number()
      .min(1, 'Page size must be at least 1')
      .default(9),
    isMaintenanceMode: z.boolean().default(false),
    freeShippingMinPrice: z.coerce
      .number()
      .min(0, 'Free shipping min price must be at least 0')
      .default(0),
    defaultTheme: z
      .string()
      .min(1, 'Default theme is required')
      .default('light'),
    defaultColor: z
      .string()
      .min(1, 'Default color is required')
      .default('gold'),
  }),
  site: z.object({
    name: z.string().min(1, 'Name is required'),
    logo: z.string().min(1, 'logo is required'),
    slogan: z.string().min(1, 'Slogan is required'),
    description: z.string().min(1, 'Description is required'),
    keywords: z.string().min(1, 'Keywords is required'),
    url: z.string().min(1, 'Url is required'),
    email: z.string().min(1, 'Email is required'),
    phone: z.string().min(1, 'Phone is required'),
    author: z.string().min(1, 'Author is required'),
    copyright: z.string().min(1, 'Copyright is required'),
    address: z.string().min(1, 'Address is required'),
  }),
  availableLanguages: z
    .array(SiteLanguageSchema)
    .min(1, 'At least one language is required'),

  carousels: z
    .array(CarouselSchema)
    .min(1, 'At least one language is required'),
  defaultLanguage: z.string().min(1, 'Language is required'),
  availableCurrencies: z
    .array(SiteCurrencySchema)
    .min(1, 'At least one currency is required'),
  defaultCurrency: z.string().min(1, 'Currency is required'),
  availablePaymentMethods: z
    .array(PaymentMethodSchema)
    .min(1, 'At least one payment method is required'),
  defaultPaymentMethod: z.string().min(1, 'Payment method is required'),
  availableDeliveryDates: z
    .array(DeliveryDateSchema)
    .min(1, 'At least one delivery date is required'),
  defaultDeliveryDate: z.string().min(1, 'Delivery date is required'),
})
```

## update types/index.ts

```ts
  CarouselSchema,
  DeliveryDateSchema,
  PaymentMethodSchema,
  SettingInputSchema,
  SiteCurrencySchema,
  SiteLanguageSchema,
  settings: ISettingInput[]

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
```

## create lib/db/models/setting.model.ts

```ts
import { ISettingInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface ISetting extends Document, ISettingInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const settingSchema = new Schema<ISetting>(
  {
    common: {
      pageSize: { type: Number, required: true, default: 9 },
      isMaintenanceMode: { type: Boolean, required: true, default: false },
      freeShippingMinPrice: { type: Number, required: true, default: 0 },
      defaultTheme: { type: String, required: true, default: 'light' },
      defaultColor: { type: String, required: true, default: 'gold' },
    },
    site: {
      name: { type: String, required: true },
      url: { type: String, required: true },
      logo: { type: String, required: true },
      slogan: { type: String, required: true },
      description: { type: String, required: true },
      keywords: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      author: { type: String, required: true },
      copyright: { type: String, required: true },
      address: { type: String, required: true },
    },
    carousels: [
      {
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
          unique: true,
        },
        image: {
          type: String,
          required: true,
        },
        buttonCaption: {
          type: String,
          required: true,
        },
      },
    ],
    availableLanguages: [
      {
        name: {
          type: String,
          required: true,
          set: (value: string) => Buffer.from(value).toString('utf8'),
        },
        code: { type: String, required: true },
      },
    ],
    defaultLanguage: { type: String, required: true },
    availableCurrencies: [
      {
        name: {
          type: String,
          required: true,
          set: (value: string) => Buffer.from(value).toString('utf8'),
        },
        code: { type: String, required: true },
        convertRate: { type: Number, required: true },
        symbol: {
          type: String,
          required: true,
          set: (value: string) => Buffer.from(value).toString('utf8'),
        },
      },
    ],
    defaultCurrency: { type: String, required: true },
    availablePaymentMethods: [
      {
        name: { type: String, required: true },
        commission: { type: Number, required: true, default: 0 },
      },
    ],
    defaultPaymentMethod: { type: String, required: true },
    availableDeliveryDates: [
      {
        name: { type: String, required: true },
        daysToDeliver: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        freeShippingMinPrice: { type: Number, required: true },
      },
    ],
    defaultDeliveryDate: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const Setting =
  (models.Setting as Model<ISetting>) ||
  model<ISetting>('Setting', settingSchema)

export default Setting
```

## update lib/data.ts

```ts
import { i18n } from '@/i18n-config'
  settings: [
    {
      common: {
        freeShippingMinPrice: 35,
        isMaintenanceMode: false,
        defaultTheme: 'Light',
        defaultColor: 'Gold',
        pageSize: 9,
      },
      site: {
        name: 'NxtAmzn',
        description:
          'NxtAmzn is a sample Ecommerce website built with Next.js, Tailwind CSS, and MongoDB.',
        keywords: 'Next Ecommerce, Next.js, Tailwind CSS, MongoDB',
        url: 'https://next-mongo-ecommerce-final.vercel.app',
        logo: '/icons/logo.svg',
        slogan: 'Spend less, enjoy more.',
        author: 'Next Ecommerce',
        copyright: '2000-2024, Next-Ecommerce.com, Inc. or its affiliates',
        email: 'admin@example.com',
        address: '123, Main Street, Anytown, CA, Zip 12345',
        phone: '+1 (123) 456-7890',
      },
      carousels: [
        {
          title: 'Most Popular Shoes For Sale',
          buttonCaption: 'Shop Now',
          image: '/images/banner3.jpg',
          url: '/search?category=Shoes',
        },
        {
          title: 'Best Sellers in T-Shirts',
          buttonCaption: 'Shop Now',
          image: '/images/banner1.jpg',
          url: '/search?category=T-Shirts',
        },
        {
          title: 'Best Deals on Wrist Watches',
          buttonCaption: 'See More',
          image: '/images/banner2.jpg',
          url: '/search?category=Wrist Watches',
        },
      ],
      availableLanguages: i18n.locales.map((locale) => ({
        code: locale.code,
        name: locale.name,
      })),
      defaultLanguage: 'en-US',
      availableCurrencies: [
        {
          name: 'United States Dollar',
          code: 'USD',
          symbol: '$',
          convertRate: 1,
        },
        { name: 'Euro', code: 'EUR', symbol: '€', convertRate: 0.96 },
        { name: 'UAE Dirham', code: 'AED', symbol: 'AED', convertRate: 3.67 },
      ],
      defaultCurrency: 'USD',
      availablePaymentMethods: [
        { name: 'PayPal', commission: 0 },
        { name: 'Stripe', commission: 0 },
        { name: 'Cash On Delivery', commission: 0 },
      ],
      defaultPaymentMethod: 'PayPal',
      availableDeliveryDates: [
        {
          name: 'Tomorrow',
          daysToDeliver: 1,
          shippingPrice: 12.9,
          freeShippingMinPrice: 0,
        },
        {
          name: 'Next 3 Days',
          daysToDeliver: 3,
          shippingPrice: 6.9,
          freeShippingMinPrice: 0,
        },
        {
          name: 'Next 5 Days',
          daysToDeliver: 5,
          shippingPrice: 4.9,
          freeShippingMinPrice: 35,
        },
      ],
      defaultDeliveryDate: 'Next 5 Days',
    },
  ],
```

## update lib/db/seed.ts

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import data from '@/lib/data'
import { connectToDatabase } from '.'
import User from './models/user.model'
import Product from './models/product.model'
import Review from './models/review.model'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import Order from './models/order.model'
import {
  calculateFutureDate,
  calculatePastDate,
  generateId,
  round2,
} from '../utils'
import WebPage from './models/web-page.model'
import Setting from './models/setting.model'
import { OrderItem, IOrderInput, ShippingAddress } from '@/types'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const { users, products, reviews, webPages, settings } = data
    await connectToDatabase(process.env.MONGODB_URI)

    await User.deleteMany()
    const createdUser = await User.insertMany(users)

    await Setting.deleteMany()
    const createdSetting = await Setting.insertMany(settings)

    await WebPage.deleteMany()
    await WebPage.insertMany(webPages)

    await Product.deleteMany()
    const createdProducts = await Product.insertMany(
      products.map((x) => ({ ...x, _id: undefined }))
    )

    await Review.deleteMany()
    const rws = []
    for (let i = 0; i < createdProducts.length; i++) {
      let x = 0
      const { ratingDistribution } = createdProducts[i]
      for (let j = 0; j < ratingDistribution.length; j++) {
        for (let k = 0; k < ratingDistribution[j].count; k++) {
          x++
          rws.push({
            ...reviews.filter((x) => x.rating === j + 1)[
              x % reviews.filter((x) => x.rating === j + 1).length
            ],
            isVerifiedPurchase: true,
            product: createdProducts[i]._id,
            user: createdUser[x % createdUser.length]._id,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          })
        }
      }
    }
    const createdReviews = await Review.insertMany(rws)

    await Order.deleteMany()
    const orders = []
    for (let i = 0; i < 200; i++) {
      orders.push(
        await generateOrder(
          i,
          createdUser.map((x) => x._id),
          createdProducts.map((x) => x._id)
        )
      )
    }
    const createdOrders = await Order.insertMany(orders)
    console.log({
      createdUser,
      createdProducts,
      createdReviews,
      createdOrders,
      createdSetting,
      message: 'Seeded database successfully',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

const generateOrder = async (
  i: number,
  users: any,
  products: any
): Promise<IOrderInput> => {
  const product1 = await Product.findById(products[i % products.length])

  const product2 = await Product.findById(
    products[
      i % products.length >= products.length - 1
        ? (i % products.length) - 1
        : (i % products.length) + 1
    ]
  )
  const product3 = await Product.findById(
    products[
      i % products.length >= products.length - 2
        ? (i % products.length) - 2
        : (i % products.length) + 2
    ]
  )

  if (!product1 || !product2 || !product3) throw new Error('Product not found')

  const items = [
    {
      clientId: generateId(),
      product: product1._id,
      name: product1.name,
      slug: product1.slug,
      quantity: 1,
      image: product1.images[0],
      category: product1.category,
      price: product1.price,
      countInStock: product1.countInStock,
    },
    {
      clientId: generateId(),
      product: product2._id,
      name: product2.name,
      slug: product2.slug,
      quantity: 2,
      image: product2.images[0],
      category: product1.category,
      price: product2.price,
      countInStock: product1.countInStock,
    },
    {
      clientId: generateId(),
      product: product3._id,
      name: product3.name,
      slug: product3.slug,
      quantity: 3,
      image: product3.images[0],
      category: product1.category,
      price: product3.price,
      countInStock: product1.countInStock,
    },
  ]

  const order = {
    user: users[i % users.length],
    items: items.map((item) => ({
      ...item,
      product: item.product,
    })),
    shippingAddress: data.users[i % users.length].address,
    paymentMethod: data.users[i % users.length].paymentMethod,
    isPaid: true,
    isDelivered: true,
    paidAt: calculatePastDate(i),
    deliveredAt: calculatePastDate(i),
    createdAt: calculatePastDate(i),
    expectedDeliveryDate: calculateFutureDate(i % 2),
    ...calcDeliveryDateAndPriceForSeed({
      items: items,
      shippingAddress: data.users[i % users.length].address,
      deliveryDateIndex: i % 2,
    }),
  }
  return order
}

export const calcDeliveryDateAndPriceForSeed = ({
  items,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  const { availableDeliveryDates } = data.settings[0]
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliveryDate =
    availableDeliveryDates[
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex
    ]

  const shippingPrice = deliveryDate.shippingPrice

  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )
  return {
    availableDeliveryDates,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}

main()
```

## create hooks/use-setting-store.ts

```ts
/* eslint-disable no-unused-vars */

import data from '@/lib/data'
import { ClientSetting, SiteCurrency } from '@/types'
import { create } from 'zustand'

interface SettingState {
  setting: ClientSetting
  setSetting: (newSetting: ClientSetting) => void
  getCurrency: () => SiteCurrency
  setCurrency: (currency: string) => void
}

const useSettingStore = create<SettingState>((set, get) => ({
  setting: {
    ...data.settings[0],
    currency: data.settings[0].defaultCurrency,
  } as ClientSetting,
  setSetting: (newSetting: ClientSetting) => {
    set({
      setting: {
        ...newSetting,
        currency: newSetting.currency || get().setting.currency,
      },
    })
  },
  getCurrency: () => {
    return (
      get().setting.availableCurrencies.find(
        (c) => c.code === get().setting.currency
      ) || data.settings[0].availableCurrencies[0]
    )
  },
  setCurrency: async (currency: string) => {
    set({ setting: { ...get().setting, currency } })
  },
}))

export default useSettingStore
```

## create components/shared/app-initializer.tsx

```ts
import React, { useEffect, useState } from 'react'
import useSettingStore from '@/hooks/use-setting-store'
import { ClientSetting } from '@/types'

export default function AppInitializer({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    setRendered(true)
  }, [setting])
  if (!rendered) {
    useSettingStore.setState({
      setting,
    })
  }

  return children
}
```

## update components/shared/client-providers.tsx

```ts
-import { Toaster } from '../ui/toaster'
import { Toaster } from '../ui/toaster'
import AppInitializer from './app-initializer'
import { ClientSetting } from '@/types'
  setting,
  setting: ClientSetting
-  const isCartSidebarOpen = useCartSidebar()
  const visible = useCartSidebar()
-    <>
-      <ThemeProvider attribute='class' defaultTheme='system'>
-        {isCartSidebarOpen ? (
    <AppInitializer setting={setting}>
      <ThemeProvider
        attribute='class'
        defaultTheme={setting.common.defaultTheme.toLocaleLowerCase()}
      >
        {visible ? (
-    </>
    </AppInitializer>
```

## Install Package

npm i next-intl --legacy-peer-deps

## create i18n-config.ts

```ts
export const i18n = {
  locales: [
    { code: 'en-US', name: 'English', icon: '🇺🇸' },
    { code: 'fr', name: 'Français', icon: '🇫🇷' },
    { code: 'ar', name: 'العربية', icon: '🇸🇦' },
  ],
  defaultLocale: 'en-US',
}

export const getDirection = (locale: string) => {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
export type I18nConfig = typeof i18n
export type Locale = I18nConfig['locales'][number]
```

## create i18n/routing.ts

```ts
import { i18n } from '@/i18n-config'
import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: i18n.locales.map((locale) => locale.code),
  defaultLocale: 'en-US',
  localePrefix: 'as-needed',
  pathnames: {
    // If all locales use the same pathname, a single
    // external path can be used for all locales
  },
})

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
```

## create i18n/request.ts

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

## create messages/en-US.json

```ts
{
  "Header": {
    "Hello": "Hello",
    "sign in": "sign in",
    "All": "All",
    "Gold": "Gold",
    "Green": "Green",
    "Red": "Red",
    "Shop By Department": "Shop By Department",
    "Account & Orders": "Account & Orders",
    "Sign up": "Sign up",
    "Sign in": "Sign in",
    "Sign out": "Sign out",
    "Admin": "Admin",
    "Your account": "Your account",
    "Your orders": "Your orders",
    "New Customer": "New Customer",
    "Help & Settings": "Help & Settings",
    "Search Site": "Search {name}",
    "Cart": "Cart",
    "Dark": "Dark",
    "Light": "Light",
    "Color": "Color",
    "Today's Deal": "Today's Deal",
    "New Arrivals": "New Arrivals",
    "Featured Products": "Featured Products",
    "Best Sellers": "Best Sellers",
    "Browsing History": "Browsing History",
    "Customer Service": "Customer Service",
    "About Us": "About Us",
    "Help": "Help",
    "Site Menu": "Site Menu",
    "Subtotal": "Subtotal",
    "Go to cart": "Go to cart"
  },
  "Home": {
    "Categories to explore": "Categories to explore",
    "See More": "See More",
    "Explore New Arrivals": "Explore New Arrivals",
    "Discover Best Sellers": "Discover Best Sellers",
    "Featured Products": "Featured Products",
    "View All": "View All",
    "Shop Now": "Shop Now",
    "Today's Deals": "Today's Deals",
    "Best Selling Products": "Best Selling Products",
    "Related to items that you've viewed": "Related to items that you've viewed",
    "Your browsing history": "Your browsing history",
    "Most Popular Shoes For Sale": "Most Popular Shoes For Sale",
    "Best Sellers in T-Shirts": "Best Sellers in T-Shirts",
    "Best Deals on Wrist Watches": "Best Deals on Wrist Watches"
  },
  "Product": {
    "Added to Cart": "Added to Cart",
    "Go to Cart": "Go to Cart",
    "Deleted User": "Deleted User",
    "Brand": "Brand",
    "Limited time deal": "Limited time deal",
    "Was": "Was",
    "List price": "List price",
    "Off": "Off",
    "In Stock": "In Stock",
    "Out of Stock": "Out of Stock",
    "Add to Cart": "Add to Cart",
    "Quantity": "Quantity",
    "Buy Now": "Buy Now",
    "Color": "Color",
    "Size": "Size",
    "Description": "Description",
    "Customer Reviews": "Customer Reviews",
    "numReviews ratings": "{numReviews} ratings",
    "rating star": "{rating} star",
    "avgRating out of 5": "{avgRating} out of 5",
    "ratings": "ratings",
    "See customer reviews": "See customer reviews",
    "Review this product": "Review this product",
    "Share your thoughts with other customers": "Share your thoughts with other customers",
    "Write a customer review": "Write a customer review",
    "Write a review": "Write a review",
    "Cancel": "Cancel",
    "Submit": "Submit",
    "Sort by": "Sort by",
    "Price: Low to High": "Price: Low to High",
    "Price: High to Low": "Price: High to Low",
    "Most Recent": "Most Recent",
    "Most Helpful": "Most Helpful",
    "Verified Purchase": "Verified Purchase",
    "Best Sellers in": "Best Sellers in {name}",
    "Inspired by Your browsing history": "Inspired by Your browsing history",
    "Recently Viewed Products": "Recently Viewed Products",
    "Title": "Title",
    "Enter title": "Enter title",
    "Comment": "Comment",
    "Enter comment": "Enter comment",
    "Select a rating": "Select a rating",
    "Please": "Please",
    "sign in": "sign in",
    "to write a review": "to write a review",
    "See more reviews": "See more reviews",
    "Loading": "Loading...",
    "Rating": "Rating",
    "No reviews yet": "No reviews yet",
    "Submitting": "Submitting..."
  },
  "Cart": {
    "Shopping Cart": "Shopping Cart",
    "Price": "Price",
    "Quantity": "Quantity",
    "items": "items",
    "Your Shopping Cart is empty": "Your Shopping Cart is empty.",
    "Your order qualifies for FREE Shipping": "Your order qualifies for FREE Shipping.",
    "of eligible items to your order to qualify for FREE Shipping": "of eligible items to your order to qualify for FREE Shipping.",
    "Continue shopping on": "Continue shopping on <home>{name} home page</home>",
    "Add": "Add",
    "Added to cart": "Added to cart",
    "Color": "Color",
    "Size": "Size",
    "Go to Cart": "Go to Cart",
    "Choose this option at checkout": "Choose this option at checkout.",
    "Items": "Items",
    "Subtotal": "Subtotal",
    "Shipping": "Shipping",
    "Tax": "Tax",
    "Proceed to Checkout": "Proceed to Checkout",
    "Delete": "Delete",
    "Update": "Update",
    "Checkout": "Checkout"
  },
  "Search": {
    "for": "for",
    "Search": "Search",
    "Results": "Results",
    "No results found": "No results found",
    "Search for": "Search for",
    "Department": "Department",
    "Price": "Price",
    "Tag": "Tag",
    "Category": "Category",
    "Rating": "Rating",
    "Search Products": "Search Products",
    "No": "No",
    "of": "of",
    "results": "results",
    "up": "up",
    "Clear": "Clear",
    "Filters": "Filters",
    "All": "All",
    "Customer Review": "Customer Review",
    "& Up": "& Up",
    "Check each product page for other buying options": "Check each product page for other buying options.",
    "No product found": "No product found",
    "Next": "Next",
    "Previous": "Previous",
    "Page": "Page"
  },
  "Footer": {
    "Select a currency": "Select a currency",
    "Select a language": "Select a language",
    "Back to top": "Back to top",
    "Get to Know Us": "Get to Know Us",
    "Careers": "Careers",
    "Blog": "Blog",
    "About name": "About {name}",
    "Make Money with Us": "Make Money with Us",
    "Sell products on": "Sell products on {name}",
    "Become an Affiliate": "Become an Affiliate",
    "Advertise Your Products": "Advertise Your Products",
    "Let Us Help You": "Let Us Help You",
    "Shipping Rates & Policies": "Shipping Rates & Policies",
    "Returns & Replacements": "Returns & Replacements",
    "Conditions of Use": "Conditions of Use",
    "Privacy Notice": "Privacy Notice",
    "Help": "Help"
  },
  "Loading": {
    "Loading": "Loading..."
  },
  "Error": {
    "Error": "Error",
    "Try again": "Try again",
    "Back To Home": "Back To Home"
  },
  "Admin": {
    "Deleted User": "Deleted User",
    "Overview": "Overview",
    "Products": "Products",
    "Orders": "Orders",
    "Users": "Users",
    "Pages": "Pages",
    "Carousel": "Carousel",
    "Settings": "Settings",
    "Dashboard": "Dashboard",
    "Total Revenue": "Total Revenue",
    "View revenue": "View revenue",
    "Sales": "Sales",
    "View orders": "View orders",
    "Customers": "Customers",
    "View customers": "View customers",
    "View products": "View products",
    "Sales Overview": "Sales Overview",
    "How much you’re earning": "How much you’re earning",
    "Estimated": "Estimated",
    "Last 6 months": "Last 6 months",
    "Product Performance": "Product performance",
    "Best-Selling Categories": "Best-Selling Categories",
    "Recent Sales": "Recent Sales",
    "Buyer": "Buyer",
    "Date": "Date",
    "Total": "Total",
    "Status": "Status",
    "Actions": "Actions",
    "Details": "Details"
  }
}
```

## create messages/ar.json

```ts
{
  "Header": {
    "Hello": "مرحباً",
    "sign in": "تسجيل الدخول",
    "All": "الكل",
    "Gold": "ذهبي",
    "Green": "أخضر",
    "Red": "أحمر",
    "Shop By Department": "التسوق حسب القسم",
    "Account & Orders": "الحساب والطلبات",
    "Sign up": "اشتراك",
    "Sign in": "تسجيل الدخول",
    "Sign out": "تسجيل الخروج",
    "Admin": "مدير",
    "Your account": "حسابك",
    "Your orders": "طلباتك",
    "New Customer": "عميل جديد",
    "Help & Settings": "المساعدة والإعدادات",
    "Search Site": "البحث في {name}",
    "Cart": "السلة",
    "Dark": "داكن",
    "Light": "فاتح",
    "Color": "اللون",
    "Today's Deal": "صفقة اليوم",
    "New Arrivals": "الوافدين الجدد",
    "Featured Products": "المنتجات المميزة",
    "Best Sellers": "الأكثر مبيعًا",
    "Browsing History": "سجل التصفح",
    "Customer Service": "خدمة العملاء",
    "About Us": "معلومات عنا",
    "Help": "مساعدة",
    "Site Menu": "قائمة الموقع",
    "Subtotal": "المجموع الفرعي",
    "Go to cart": "اذهب إلى السلة"
  },
  "Home": {
    "Categories to explore": "فئات للاستكشاف",
    "See More": "شاهد المزيد",
    "Explore New Arrivals": "اكتشف الوافدين الجدد",
    "Discover Best Sellers": "اكتشف الأكثر مبيعًا",
    "Featured Products": "المنتجات المميزة",
    "View All": "عرض الكل",
    "Shop Now": "تسوق الآن",
    "Today's Deals": "عروض اليوم",
    "Best Selling Products": "المنتجات الأكثر مبيعًا",
    "Related to items that you've viewed": "ذات صلة بالعناصر التي عرضتها",
    "Your browsing history": "سجل التصفح الخاص بك",
    "Most Popular Shoes For Sale": "الأحذية الأكثر شعبية للبيع",
    "Best Sellers in T-Shirts": "الأكثر مبيعًا في التيشيرتات",
    "Best Deals on Wrist Watches": "أفضل العروض على ساعات المعصم"
  },
  "Product": {
    "Added to Cart": "أضيف إلى السلة",
    "Go to Cart": "اذهب إلى السلة",
    "Deleted User": "مستخدم محذوف",
    "Brand": "العلامة التجارية",
    "Limited time deal": "صفقة محدودة الوقت",
    "Was": "كان",
    "List price": "سعر القائمة",
    "Off": "خصم",
    "In Stock": "في المخزن",
    "Out of Stock": "نفد المخزون",
    "Add to Cart": "أضف إلى السلة",
    "Quantity": "الكمية",
    "Buy Now": "اشتري الآن",
    "Color": "اللون",
    "Size": "الحجم",
    "Description": "الوصف",
    "Customer Reviews": "مراجعات العملاء",
    "numReviews ratings": "{numReviews} تقييمات",
    "rating star": "{rating} نجمة",
    "avgRating out of 5": "{avgRating} من 5",
    "ratings": "التقييمات",
    "See customer reviews": "اطلع على آراء العملاء",
    "Review this product": "راجع هذا المنتج",
    "Share your thoughts with other customers": "شارك أفكارك مع العملاء الآخرين",
    "Write a customer review": "اكتب مراجعة للعميل",
    "Write a review": "اكتب مراجعة",
    "Cancel": "إلغاء",
    "Submit": "إرسال",
    "Sort by": "فرز حسب",
    "Price: Low to High": "السعر: من الأدنى إلى الأعلى",
    "Price: High to Low": "السعر: من الأعلى إلى الأدنى",
    "Most Recent": "الأحدث",
    "Most Helpful": "الأكثر فائدة",
    "Verified Purchase": "شراء تم التحقق منه",
    "Best Sellers in": "الأكثر مبيعًا في {name}",
    "Inspired by Your browsing history": "مستوحى من سجل التصفح الخاص بك",
    "Recently Viewed Products": "المنتجات التي تم عرضها مؤخرًا",
    "Title": "العنوان",
    "Enter title": "أدخل العنوان",
    "Comment": "تعليق",
    "Enter comment": "أدخل تعليقًا",
    "Select a rating": "حدد تقييمًا",
    "Please": "من فضلك",
    "sign in": "تسجيل الدخول",
    "to write a review": "لكتابة مراجعة",
    "See more reviews": "عرض المزيد من المراجعات",
    "Loading": "جاري التحميل...",
    "Rating": "التقييم",
    "No reviews yet": "لا توجد مراجعات حتى الآن",
    "Submitting": "جاري الإرسال..."
  },
  "Cart": {
    "Shopping Cart": "عربة التسوق",
    "Price": "السعر",
    "Quantity": "الكمية",
    "items": "العناصر",
    "Your Shopping Cart is empty": "عربة التسوق فارغة.",
    "Your order qualifies for FREE Shipping": "طلبك مؤهل للشحن المجاني.",
    "of eligible items to your order to qualify for FREE Shipping": "من العناصر المؤهلة لطلبك للتأهل للشحن المجاني.",
    "Continue shopping on": "متابعة التسوق على <home>{name} الصفحة الرئيسية</home>",
    "Add": "إضافة",
    "Added to cart": "تمت الإضافة إلى السلة",
    "Color": "اللون",
    "Size": "الحجم",
    "Go to Cart": "اذهب إلى السلة",
    "Choose this option at checkout": "اختر هذا الخيار عند الخروج.",
    "Items": "العناصر",
    "Subtotal": "المجموع الفرعي",
    "Shipping": "الشحن",
    "Tax": "الضريبة",
    "Proceed to Checkout": "المتابعة إلى الخروج",
    "Delete": "حذف",
    "Update": "تحديث",
    "Checkout": "الخروج"
  },
  "Search": {
    "for": "لـ",
    "Search": "بحث",
    "Results": "النتائج",
    "No results found": "لم يتم العثور على نتائج",
    "Search for": "ابحث عن",
    "Department": "القسم",
    "Price": "السعر",
    "Tag": "علامة",
    "Category": "الفئة",
    "Rating": "التقييم",
    "Search Products": "البحث عن المنتجات",
    "No": "لا",
    "of": "من",
    "results": "النتائج",
    "up": "وما فوق",
    "Clear": "مسح",
    "Filters": "الفلاتر",
    "All": "الكل",
    "Customer Review": "مراجعة العملاء",
    "& Up": "وما فوق",
    "Check each product page for other buying options": "تحقق من صفحة كل منتج لمعرفة خيارات الشراء الأخرى.",
    "No product found": "لم يتم العثور على منتج",
    "Next": "التالي",
    "Previous": "السابق",
    "Page": "الصفحة"
  },

  "Footer": {
    "Select a currency": "حدد عملة",
    "Select a language": "حدد لغة",
    "Back to top": "العودة إلى الأعلى",
    "Get to Know Us": "تعرف علينا",
    "Careers": "وظائف",
    "Blog": "مدونة",
    "About name": "حول {name}",
    "Make Money with Us": "اكسب المال معنا",
    "Sell products on": "بيع المنتجات على {name}",
    "Become an Affiliate": "انضم كشريك تسويق",
    "Advertise Your Products": "أعلن عن منتجاتك",
    "Let Us Help You": "دعنا نساعدك",
    "Shipping Rates & Policies": "أسعار وسياسات الشحن",
    "Returns & Replacements": "المرتجعات والاستبدالات",
    "Conditions of Use": "شروط الاستخدام",
    "Privacy Notice": "إشعار الخصوصية",
    "Help": "مساعدة"
  },
  "Loading": {
    "Loading": "جاري التحميل..."
  },
  "Error": {
    "Error": "خطأ",
    "Try again": "حاول مرة أخرى",
    "Back To Home": "العودة إلى الرئيسية"
  },
  "Admin": {
    "Deleted User": "مستخدم محذوف",
    "Overview": "نظرة عامة",
    "Products": "المنتجات",
    "Orders": "الطلبات",
    "Users": "المستخدمون",
    "Pages": "الصفحات",
    "Carousel": "دائري",
    "Settings": "الإعدادات",
    "Dashboard": "لوحة التحكم",
    "Total Revenue": "إجمالي الإيرادات",
    "View revenue": "عرض الإيرادات",
    "Sales": "المبيعات",
    "View orders": "عرض الطلبات",
    "Customers": "العملاء",
    "View customers": "عرض العملاء",
    "View products": "عرض المنتجات",
    "Sales Overview": "نظرة عامة على المبيعات",
    "How much you’re earning": "كم تربح",
    "Estimated": "مُقدَّر",
    "Last 6 months": "آخر 6 أشهر",
    "Product Performance": "أداء المنتج",
    "Best-Selling Categories": "الفئات الأكثر مبيعًا",
    "Recent Sales": "المبيعات الأخيرة",
    "Buyer": "المشتري",
    "Date": "التاريخ",
    "Total": "الإجمالي",
    "Status": "الحالة",
    "Actions": "الإجراءات",
    "Details": "التفاصيل"
  }
}
```

## create messages/fr.json

```ts
{
  "Header": {
    "Hello": "Bonjour",
    "sign in": "se connecter",
    "All": "Tout",
    "Gold": "Or",
    "Green": "Vert",
    "Red": "Rouge",
    "Shop By Department": "Magasiner par département",
    "Account & Orders": "Compte et commandes",
    "Sign up": "S'inscrire",
    "Sign in": "Se connecter",
    "Sign out": "Se déconnecter",
    "Admin": "Admin",
    "Your account": "Votre compte",
    "Your orders": "Vos commandes",
    "New Customer": "Nouveau client",
    "Help & Settings": "Aide et paramètres",
    "Search Site": "Rechercher {name}",
    "Cart": "Panier",
    "Dark": "Sombre",
    "Light": "Clair",
    "Color": "Couleur",
    "Today's Deal": "Offre du jour",
    "New Arrivals": "Nouveautés",
    "Featured Products": "Produits vedettes",
    "Best Sellers": "Meilleures ventes",
    "Browsing History": "Historique de navigation",
    "Customer Service": "Service client",
    "About Us": "À propos de nous",
    "Help": "Aide",
    "Site Menu": "Menu du site",
    "Subtotal": "Sous-total",
    "Go to cart": "Aller au panier"
  },
  "Home": {
    "Categories to explore": "Catégories à explorer",
    "See More": "Voir plus",
    "Explore New Arrivals": "Explorer les nouveautés",
    "Discover Best Sellers": "Découvrir les meilleures ventes",
    "Featured Products": "Produits vedettes",
    "View All": "Tout afficher",
    "Shop Now": "Acheter maintenant",
    "Today's Deals": "Offres du jour",
    "Best Selling Products": "Produits les plus vendus",
    "Related to items that you've viewed": "Lié aux articles que vous avez consultés",
    "Your browsing history": "Votre historique de navigation",
    "Most Popular Shoes For Sale": "Chaussures les plus populaires à vendre",
    "Best Sellers in T-Shirts": "Meilleures ventes de t-shirts",
    "Best Deals on Wrist Watches": "Meilleures offres sur les montres-bracelets"
  },
  "Product": {
    "Added to Cart": "Ajouté au panier",
    "Go to Cart": "Aller au panier",
    "Deleted User": "Utilisateur supprimé",
    "Brand": "Marque",
    "Limited time deal": "Offre à durée limitée",
    "Was": "Était",
    "List price": "Prix courant",
    "Off": "De réduction",
    "In Stock": "En stock",
    "Out of Stock": "Rupture de stock",
    "Add to Cart": "Ajouter au panier",
    "Quantity": "Quantité",
    "Buy Now": "Acheter maintenant",
    "Color": "Couleur",
    "Size": "Taille",
    "Description": "Description",
    "Customer Reviews": "Avis des clients",
    "numReviews ratings": "{numReviews} évaluations",
    "rating star": "{rating} étoile",
    "avgRating out of 5": "{avgRating} sur 5",
    "ratings": "évaluations",
    "See customer reviews": "Voir les avis des clients",
    "Review this product": "Évaluer ce produit",
    "Share your thoughts with other customers": "Partagez vos impressions avec d'autres clients",
    "Write a customer review": "Rédiger un avis client",
    "Write a review": "Rédiger un avis",
    "Cancel": "Annuler",
    "Submit": "Soumettre",
    "Sort by": "Trier par",
    "Price: Low to High": "Prix : du plus bas au plus élevé",
    "Price: High to Low": "Prix : du plus élevé au plus bas",
    "Most Recent": "Plus récents",
    "Most Helpful": "Plus utiles",
    "Verified Purchase": "Achat vérifié",
    "Best Sellers in": "Meilleures ventes dans {name}",
    "Inspired by Your browsing history": "Inspiré par votre historique de navigation",
    "Recently Viewed Products": "Produits récemment consultés",
    "Title": "Titre",
    "Enter title": "Saisir le titre",
    "Comment": "Commentaire",
    "Enter comment": "Saisir le commentaire",
    "Select a rating": "Sélectionner une évaluation",
    "Please": "Veuillez",
    "sign in": "vous connecter",
    "to write a review": "pour rédiger un avis",
    "See more reviews": "Voir plus d'avis",
    "Loading": "Chargement...",
    "Rating": "Évaluation",
    "No reviews yet": "Pas encore d'avis",
    "Submitting": "Envoi en cours..."
  },
  "Cart": {
    "Shopping Cart": "Panier d'achat",
    "Price": "Prix",
    "Quantity": "Quantité",
    "items": "articles",
    "Your Shopping Cart is empty": "Votre panier est vide.",
    "Your order qualifies for FREE Shipping": "Votre commande est admissible à la livraison GRATUITE.",
    "of eligible items to your order to qualify for FREE Shipping": "d'articles admissibles à votre commande pour être admissible à la livraison GRATUITE.",
    "Continue shopping on": "Continuer les achats sur <home>{name} page d'accueil</home>",
    "Add": "Ajouter",
    "Added to cart": "Ajouté au panier",
    "Color": "Couleur",
    "Size": "Taille",
    "Go to Cart": "Aller au panier",
    "Choose this option at checkout": "Choisissez cette option à la caisse.",
    "Items": "Articles",
    "Subtotal": "Sous-total",
    "Shipping": "Livraison",
    "Tax": "Taxes",
    "Proceed to Checkout": "Passer à la caisse",
    "Delete": "Supprimer",
    "Update": "Mettre à jour",
    "Checkout": "Paiement"
  },
  "Search": {
    "for": "pour",
    "Search": "Rechercher",
    "Results": "Résultats",
    "No results found": "Aucun résultat trouvé",
    "Search for": "Rechercher",
    "Department": "Département",
    "Price": "Prix",
    "Tag": "Mot-clé",
    "Category": "Catégorie",
    "Rating": "Évaluation",
    "Search Products": "Rechercher des produits",
    "No": "Aucun",
    "of": "de",
    "results": "résultats",
    "up": "et plus",
    "Clear": "Effacer",
    "Filters": "Filtres",
    "All": "Tout",
    "Customer Review": "Avis client",
    "& Up": "& Plus",
    "Check each product page for other buying options": "Vérifiez chaque page produit pour d'autres options d'achat.",
    "No product found": "Aucun produit trouvé",
    "Next": "Suivant",
    "Previous": "Précédent",
    "Page": "Page"
  },
  "Footer": {
    "Select a currency": "Sélectionner une devise",
    "Select a language": "Sélectionner une langue",
    "Back to top": "Retour en haut",
    "Get to Know Us": "Apprenez à nous connaître",
    "Careers": "Carrières",
    "Blog": "Blogue",
    "About name": "À propos de {name}",
    "Make Money with Us": "Gagnez de l'argent avec nous",
    "Sell products on": "Vendez des produits sur {name}",
    "Become an Affiliate": "Devenez affilié",
    "Advertise Your Products": "Faites la publicité de vos produits",
    "Let Us Help You": "Laissez-nous vous aider",
    "Shipping Rates & Policies": "Tarifs et politiques d'expédition",
    "Returns & Replacements": "Retours et remplacements",
    "Conditions of Use": "Conditions d'utilisation",
    "Privacy Notice": "Avis de confidentialité",
    "Help": "Aide"
  },
  "Loading": {
    "Loading": "Chargement..."
  },
  "Admin": {
    "Deleted User": "Utilisateur supprimé",
    "Overview": "Aperçu",
    "Products": "Produits",
    "Orders": "Commandes",
    "Users": "Utilisateurs",
    "Pages": "Pages",
    "Carousel": "Carrousel",
    "Settings": "Paramètres",
    "Dashboard": "Tableau de bord",
    "Total Revenue": "Revenu total",
    "View revenue": "Voir les revenus",
    "Sales": "Ventes",
    "View orders": "Voir les commandes",
    "Customers": "Clients",
    "View customers": "Voir les clients",
    "View products": "Voir les produits",
    "Sales Overview": "Aperçu des ventes",
    "How much you’re earning": "Combien gagnez-vous",
    "Estimated": "Estimé",
    "Last 6 months": "6 derniers mois",
    "Product Performance": "Performance des produits",
    "Best-Selling Categories": "Catégories les plus vendues",
    "Recent Sales": "Ventes récentes",
    "Buyer": "Acheteur",
    "Date": "Date",
    "Total": "Total",
    "Status": "Statut",
    "Actions": "Actions",
    "Details": "Détails"
  }
}
```

## update middleware.ts

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

-export const { auth: middleware } = NextAuth(authConfig)
const publicPages = [
  '/',
  '/search',
  '/sign-in',
  '/sign-up',
  '/cart',
  '/cart/(.*)',
  '/product/(.*)',
  '/page/(.*)',
  // (/secret requires auth)
]

const intlMiddleware = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  )
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    // return NextResponse.next()
    return intlMiddleware(req)
  } else {
    if (!req.auth) {
      const newUrl = new URL(
        `/sign-in?callbackUrl=${
          encodeURIComponent(req.nextUrl.pathname) || '/'
        }`,
        req.nextUrl.origin
      )
      return Response.redirect(newUrl)
    } else {
      return intlMiddleware(req)
    }
  }
})
-  matcher: [
-    /*
-     * Match all request paths except for the ones starting with:
-     * - api (API routes)
-     * - _next/static (static files)
-     * - _next/image (image optimization files)
-     * - favicon.ico (favicon file)
-     */
-    '/((?!api|_next/static|_next/image|favicon.ico).*)',
-  ],
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
```

## update next.config.ts

```ts
-import type { NextConfig } from "next";
import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'
-const nextConfig: NextConfig = {
const nextConfig: NextConfig = withNextIntl()({
-};
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
})
-export default nextConfig;
export default nextConfig
```

## update components/shared/browsing-history-list.tsx

```ts
import { useTranslations } from 'next-intl'

  const t = useTranslations('Home')
-          title={"Related to items that you've viewed"}
          title={t("Related to items that you've viewed")}
-          title={'Your browsing history'}
          title={t('Your browsing history')}
  excludeId = '',
  excludeId?: string
-        `/api/products/browsing-history?type=${type}&categories=${products
        `/api/products/browsing-history?type=${type}&excludeId=${excludeId}&categories=${products
-  }, [products, type])
  }, [excludeId, products, type])
```

## update components/shared/cart-sidebar.tsx

```ts
import useSettingStore from '@/hooks/use-setting-store'
-import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'
  const {
    setting: {
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()

  const t = useTranslations()
  const locale = useLocale()
-    <div className='w-36 overflow-y-auto'>
-      <div className={`fixed border-l h-full`}>
-        <div className='p-2 h-full flex flex-col gap-2 justify-start items-center'>
    <div className='w-32 overflow-y-auto'>
      <div
        className={`w-32 fixed  h-full ${
          getDirection(locale) === 'rtl' ? 'border-r' : 'border-l'
        }`}
      >
        <div className='p-2 h-full flex flex-col gap-2 justify-center items-center'>
-            <div> Subtotal</div>
-            <div className='font-bold'>
            <div> {t('Cart.Subtotal')}</div>
            <div className='font-bold '>
-            {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
            {itemsPrice > freeShippingMinPrice && (
-                Your order qualifies for FREE Shipping
                {t('Cart.Your order qualifies for FREE Shipping')}
-              Go to Cart
              {t('Cart.Go to Cart')}
```

## update components/shared/footer.tsx

```ts
-
-import { Button } from '../ui/button'
-import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import useSettingStore from '@/hooks/use-setting-store'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'

import { SelectValue } from '@radix-ui/react-select'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { i18n } from '@/i18n-config'
  const router = useRouter()
  const pathname = usePathname()
  const {
    setting: { site, availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()
  const { locales } = i18n

  const locale = useLocale()
  const t = useTranslations()
-          Back to top
          {t('Footer.Back to top')}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto'>
          <div>
            <h3 className='font-bold mb-2'>{t('Footer.Get to Know Us')}</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/careers'>{t('Footer.Careers')}</Link>
              </li>
              <li>
                <Link href='/page/blog'>{t('Footer.Blog')}</Link>
              </li>
              <li>
                <Link href='/page/about-us'>
                  {t('Footer.About name', { name: site.name })}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-2'>{t('Footer.Make Money with Us')}</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/sell'>
                  {t('Footer.Sell products on', { name: site.name })}
                </Link>
              </li>
              <li>
                <Link href='/page/become-affiliate'>
                  {t('Footer.Become an Affiliate')}
                </Link>
              </li>
              <li>
                <Link href='/page/advertise'>
                  {t('Footer.Advertise Your Products')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-2'>{t('Footer.Let Us Help You')}</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/shipping'>
                  {t('Footer.Shipping Rates & Policies')}
                </Link>
              </li>
              <li>
                <Link href='/page/returns-policy'>
                  {t('Footer.Returns & Replacements')}
                </Link>
              </li>
              <li>
                <Link href='/page/help'>{t('Footer.Help')}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-800'>
          <div className='max-w-7xl mx-auto py-8 px-4 flex flex-col items-center space-y-4'>
            <div className='flex items-center space-x-4 flex-wrap md:flex-nowrap'>
              <Image
                src='/icons/logo.svg'
                alt={`${site.name} logo`}
                width={48}
                height={48}
                className='w-14'
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />{' '}
              <Select
                value={locale}
                onValueChange={(value) => {
                  router.push(pathname, { locale: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Footer.Select a language')} />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((lang, index) => (
                    <SelectItem key={index} value={lang.code}>
                      <Link
                        className='w-full flex items-center gap-1'
                        href={pathname}
                        locale={lang.code}
                      >
                        <span className='text-lg'>{lang.icon}</span> {lang.name}
                      </Link>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={currency}
                onValueChange={(value) => {
                  setCurrency(value)
                  window.scrollTo(0, 0)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Footer.Select a currency')} />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies
                    .filter((x) => x.code)
                    .map((currency, index) => (
                      <SelectItem key={index} value={currency.code}>
                        {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
-          <Link href='/page/conditions-of-use'>Conditions of Use</Link>
-          <Link href='/page/privacy-policy'> Privacy Notice</Link>
-          <Link href='/page/help'>Help</Link>
          <Link href='/page/conditions-of-use'>
            {t('Footer.Conditions of Use')}
          </Link>
          <Link href='/page/privacy-policy'>{t('Footer.Privacy Notice')}</Link>
          <Link href='/page/help'>{t('Footer.Help')}</Link>
-          <p> © 2000-2024, {APP_NAME}, Inc. or its affiliates</p>
          <p> © {site.copyright}</p>
-          123, Main Street, Anytown, CA, Zip 12345 | +1 (123) 456-7890
          {site.address} | {site.phone}
```

## create components/shared/header/language-switcher.tsx

```ts
'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import useSettingStore from '@/hooks/use-setting-store'
import { i18n } from '@/i18n-config'
import { setCurrencyOnServer } from '@/lib/actions/setting.actions'
import { ChevronDownIcon } from 'lucide-react'

export default function LanguageSwitcher() {
  const { locales } = i18n
  const locale = useLocale()
  const pathname = usePathname()

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()
  const handleCurrencyChange = async (newCurrency: string) => {
    await setCurrencyOnServer(newCurrency)
    setCurrency(newCurrency)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='header-button h-[41px]'>
        <div className='flex items-center gap-1'>
          <span className='text-xl'>
            {locales.find((l) => l.code === locale)?.icon}
          </span>
          {locale.toUpperCase().slice(0, 2)}
          <ChevronDownIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale}>
          {locales.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.code}>
              <Link
                className='w-full flex items-center gap-1'
                href={pathname}
                locale={c.code}
              >
                <span className='text-lg'>{c.icon}</span> {c.name}
              </Link>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Currency</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={handleCurrencyChange}
        >
          {availableCurrencies.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.code}>
              {c.symbol} {c.code}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## update components/shared/header/cart-button.tsx

```ts
import useShowSidebar from '@/hooks/use-cart-sidebar'
-import useCartSidebar from '@/hooks/use-cart-sidebar'
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'
-  const isCartSidebarOpen = useCartSidebar()
  const showSidebar = useShowSidebar()
  const t = useTranslations()

  const locale = useLocale()
-              `bg-black  px-1 rounded-full text-primary text-base font-bold absolute right-[30px] top-[-4px] z-10`,
              `bg-black  px-1 rounded-full text-primary text-base font-bold absolute ${
                getDirection(locale) === 'rtl' ? 'right-[5px]' : 'left-[10px]'
              } top-[-4px] z-10`,
-        <span className='font-bold'>Cart</span>
-        {isCartSidebarOpen && (
        <span className='font-bold'>{t('Header.Cart')}</span>

        {showSidebar && (
-            className={`absolute top-[20px] right-[-16px] rotate-[-90deg] z-10 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background`}
            className={`absolute top-[20px] ${
              getDirection(locale) === 'rtl'
                ? 'left-[-16px] rotate-[-270deg]'
                : 'right-[-16px] rotate-[-90deg]'
            }  z-10   w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background`}
```

## update components/shared/header/index.tsx

```ts
-import { APP_NAME } from '@/lib/constants'
import { getAllCategories } from '@/lib/actions/product.actions'
-import data from '@/lib/data'
import data from '@/lib/data'
-import { getAllCategories } from '@/lib/actions/product.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'
  const { site } = await getSetting()
  const t = await getTranslations()
-                src='/icons/logo.svg'
                src={site.logo}
-                alt={`${APP_NAME} logo`}
                alt={`${site.name} logo`}
-              {APP_NAME}
              {site.name}

-              className='header-button !p-2'
              className='header-button !p-2 '
-              {menu.name}
              {t('Header.' + menu.name)}
```

## update components/shared/header/menu.tsx

```ts
import LanguageSwitcher from './language-switcher'
import { useTranslations } from 'next-intl'
  const t = useTranslations()
        <LanguageSwitcher />
-                <SheetTitle>Site Menu</SheetTitle>
                <SheetTitle className='  '>{t('Header.Site Menu')}</SheetTitle>
            <LanguageSwitcher />
```

## update components/shared/header/search.tsx

```ts

import { getAllCategories } from '@/lib/actions/product.actions'
-} from '@/components/ui/select'
-import { APP_NAME } from '@/lib/constants'
-import { getAllCategories } from '@/lib/actions/product.actions'
} from '../../ui/select'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

  const {
    site: { name },
  } = await getSetting()

  const t = await getTranslations()
-        <SelectTrigger className='w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r  rounded-r-none rounded-l-md'>
-          <SelectValue placeholder='All' />
        <SelectTrigger className='w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r  rounded-r-none rounded-l-md rtl:rounded-r-md rtl:rounded-l-none  '>
          <SelectValue placeholder={t('Header.All')} />
-          <SelectItem value='all'>All</SelectItem>
          <SelectItem value='all'>{t('Header.All')}</SelectItem>
-        placeholder={`Search Site ${APP_NAME}`}
        placeholder={t('Header.Search Site', { name })}
```

## update components/shared/header/sidebar.tsx

```ts
import { getLocale, getTranslations } from 'next-intl/server'
import { getDirection } from '@/i18n-config'
  const locale = await getLocale()

  const t = await getTranslations()
-    <Drawer direction='left'>
    <Drawer direction={getDirection(locale) === 'rtl' ? 'right' : 'left'}>
-        All
        {t('Header.All')}
-                        Hello, {session.user.name}
                        {t('Header.Hello')}, {session.user.name}
-                        Hello, sign in
                        {t('Header.Hello')}, {t('Header.sign in')}
-              <h2 className='text-lg font-semibold'>Shop By Department</h2>
              <h2 className='text-lg font-semibold'>
                {t('Header.Shop By Department')}
              </h2>
-              <h2 className='text-lg font-semibold'>Help & Settings</h2>
              <h2 className='text-lg font-semibold'>
                {t('Header.Help & Settings')}
              </h2>
-                Your account
                {t('Header.Your account')}
-                Customer Service
                {t('Header.Customer Service')}
-                  Sign out
                  {t('Header.Sign out')}
-                Sign in
                {t('Header.Sign in')}
```

## update components/shared/header/theme-switcher.tsx

```ts
import { useTranslations } from 'next-intl'
  const t = useTranslations('Header')
-            <Moon className='h-4 w-4' /> Dark <ChevronDownIcon />
            <Moon className='h-4 w-4' /> {t('Dark')} <ChevronDownIcon />
-            <Sun className='h-4 w-4' /> Light
-            <ChevronDownIcon />
            <Sun className='h-4 w-4' /> {t('Light')} <ChevronDownIcon />
-            <Moon className='h-4 w-4 mr-1' /> Dark
            <Moon className='h-4 w-4 mr-1' /> {t('Dark')}
-            <Sun className='h-4 w-4 mr-1' /> Light
            <Sun className='h-4 w-4 mr-1' /> {t('Light')}
-        <DropdownMenuLabel>Color</DropdownMenuLabel>
        <DropdownMenuLabel>{t('Color')}</DropdownMenuLabel>
-              {c.name}
              {t(c.name)}
```

## update components/shared/header/user-button.tsx

```ts
// import Link from 'next/link'

-import { ChevronDown } from 'lucide-react'
import { ChevronDownIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
  const t = await getTranslations()
-              <span>Hello, {session ? session.user.name : 'sign in'}</span>
-              <span className='font-bold'>Account & Orders</span>
              <span>
                {t('Header.Hello')},{' '}
                {session ? session.user.name : t('Header.sign in')}
              </span>
              <span className='font-bold'>{t('Header.Account & Orders')}</span>
-            <ChevronDown />
            <ChevronDownIcon />
-                <DropdownMenuItem>Your account</DropdownMenuItem>
                <DropdownMenuItem>{t('Header.Your account')}</DropdownMenuItem>
-                <DropdownMenuItem>Your orders</DropdownMenuItem>
                <DropdownMenuItem>{t('Header.Your orders')}</DropdownMenuItem>
-                  <DropdownMenuItem>Admin</DropdownMenuItem>
                  <DropdownMenuItem>{t('Header.Admin')}</DropdownMenuItem>
-                  Sign out
                  {t('Header.Sign out')}
-                  Sign in
                  {t('Header.Sign in')}
-                New Customer? <Link href='/sign-up'>Sign up</Link>
                {t('Header.New Customer')}?{' '}
                <Link href='/sign-up'>{t('Header.Sign up')}</Link>
```

## update components/shared/home/home-carousel.tsx

```ts
// https://v0.dev/chat/ccfVZZ99JUg

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { ICarousel } from '@/types'
-export function HomeCarousel({
-  items,
-}: {
-  items: {
-    image: string
-    url: string
-    title: string
-    buttonCaption: string
-  }[]
-}) {
export function HomeCarousel({ items }: { items: ICarousel[] }) {
  const t = useTranslations('Home')

-                  <h2 className='text-xl md:text-6xl font-bold mb-4 text-primary'>
-                    {item.title}
                  <h2
                    className={cn(
                      'text-xl md:text-6xl font-bold mb-4 text-primary  '
                    )}
                  >
                    {t(`${item.title}`)}
-                    {item.buttonCaption}
                    {t(`${item.buttonCaption}`)}
```

## update components/shared/pagination.tsx

```ts
import { useTranslations } from 'next-intl'

  const t = useTranslations()
-        <ChevronLeft /> Previous
        <ChevronLeft /> {t('Search.Previous')}
-      Page {page} of {totalPages}
      {t('Search.Page')} {page} {t('Search.of')} {totalPages}
-        Next <ChevronRight />
        {t('Search.Next')} <ChevronRight />
```

## update components/shared/product/add-to-cart.tsx

```ts
import { useTranslations } from 'next-intl'
  //PROMPT: add quantity state
  const t = useTranslations()

-            description: 'Added to Cart',
            description: t('Product.Added to Cart'),
-                Go to Cart
                {t('Product.Go to Cart')}
-      Add to Cart
      {t('Product.Add to Cart')}
-          <SelectValue>Quantity: {quantity}</SelectValue>
          <SelectValue>
            {t('Product.Quantity')}: {quantity}
          </SelectValue>
-        Add to Cart
        {t('Product.Add to Cart')}
-        Buy Now
        {t('Product.Buy Now')}
```

## update components/shared/product/product-price.tsx

```ts
-import { cn, formatCurrency } from '@/lib/utils'
import useSettingStore from '@/hooks/use-setting-store'
import { cn, round2 } from '@/lib/utils'
import { useFormatter, useTranslations } from 'next-intl'
-  const discountPercent = Math.round(100 - (price / listPrice) * 100)
-  const stringValue = price.toString()
  const { getCurrency } = useSettingStore()
  const currency = getCurrency()
  const t = useTranslations()
  const convertedPrice = round2(currency.convertRate * price)
  const convertedListPrice = round2(currency.convertRate * listPrice)

  const format = useFormatter()
  const discountPercent = Math.round(
    100 - (convertedPrice / convertedListPrice) * 100
  )
  const stringValue = convertedPrice.toString()
-    formatCurrency(price)
-  ) : listPrice == 0 ? (
    format.number(convertedPrice, {
      style: 'currency',
      currency: currency.code,
      currencyDisplay: 'narrowSymbol',
    })
  ) : convertedListPrice == 0 ? (
-      <span className='text-xs align-super'>$</span>
      <span className='text-xs align-super'>{currency.symbol}</span>
-          {discountPercent}% Off
          {discountPercent}% {t('Product.Off')}
-          Limited time deal
          {t('Product.Limited time deal')}
-          <span className='text-xs align-super'>$</span>
          <span className='text-xs align-super'>{currency.symbol}</span>
-          Was: <span className='line-through'>{formatCurrency(listPrice)}</span>
          {t('Product.Was')}:{' '}
          <span className='line-through'>
            {format.number(convertedListPrice, {
              style: 'currency',
              currency: currency.code,
              currencyDisplay: 'narrowSymbol',
            })}
          </span>
-          <span className='text-xs align-super'>$</span>
          <span className='text-xs align-super'>{currency.symbol}</span>
-        List price:{' '}
-        <span className='line-through'>{formatCurrency(listPrice)}</span>
        {t('Product.List price')}:{' '}
        <span className='line-through'>
          {format.number(convertedListPrice, {
            style: 'currency',
            currency: currency.code,
            currencyDisplay: 'narrowSymbol',
          })}
        </span>
```

## update components/shared/product/rating-summary.tsx

```ts
import { useTranslations } from 'next-intl'
  const t = useTranslations()
-            {avgRating.toFixed(1)} out of 5
            {t('Product.avgRating out of 5', {
              avgRating: avgRating.toFixed(1),
            })}
-        <div className='text-lg '>{numReviews} ratings</div>
        <div className='text-lg '>
          {t('Product.numReviews ratings', { numReviews })}
        </div>
-                <div className='text-sm'> {rating} star</div>
                <div className='text-sm'>
                  {' '}
                  {t('Product.rating star', { rating })}
                </div>
-              See customer reviews
              {t('Product.See customer reviews')}
-          {numReviews} ratings
          {t('Product.numReviews ratings', { numReviews })}
```

## update emails/ask-review-order-items.tsx

```ts
-import { SERVER_URL } from '@/lib/constants'
import { getSetting } from '@/lib/actions/setting.actions'
  const { site } = await getSetting()
-                    <Link href={`${SERVER_URL}/product/${item.slug}`}>
                    <Link href={`${site.url}/product/${item.slug}`}>
-                            ? `${SERVER_URL}${item.image}`
                            ? `${site.url}${item.image}`
-                    <Link href={`${SERVER_URL}/product/${item.slug}`}>
                    <Link href={`${site.url}/product/${item.slug}`}>
-                      href={`${SERVER_URL}/product/${item.slug}#reviews`}
                      href={`${site.url}/product/${item.slug}#reviews`}
```

## update emails/purchase-receipt.tsx

```ts
-import { SERVER_URL } from '@/lib/constants'
import { getSetting } from '@/lib/actions/setting.actions'
  const { site } = await getSetting()
-                    <Link href={`${SERVER_URL}/product/${item.slug}`}>
                    <Link href={`${site.url}/product/${item.slug}`}>
-                            ? `${SERVER_URL}${item.image}`
                            ? `${site.url}${item.image}`
-                    <Link href={`${SERVER_URL}/product/${item.slug}`}>
                    <Link href={`${site.url}/product/${item.slug}`}>
```

## update emails/index.tsx

```ts
-import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'

-  console.log('order', order)

```

## update hooks/use-cart-sidebar.ts

```ts
import { i18n } from '@/i18n-config'

const locales = i18n.locales
  .filter((locale) => locale.code !== 'en-US')
  .map((locale) => locale.code)

const isNotInPaths = (s: string) => {
  console.log(locales)
  console.log(s)
  const localePattern = `/(?:${locales.join('|')})` // Match locales
  const pathsPattern = `^(?:${localePattern})?(?:/$|/cart$|/checkout$|/sign-in$|/sign-up$|/order(?:/.*)?$|/account(?:/.*)?$|/admin(?:/.*)?$)?$`
  console.log(!new RegExp(pathsPattern).test(s))
  return !new RegExp(pathsPattern).test(s)
}
-const isNotInPaths = (s: string) =>
-  !/^\/$|^\/cart$|^\/checkout$|^\/sign-in$|^\/sign-up$|^\/order(\/.*)?$|^\/account(\/.*)?$|^\/admin(\/.*)?$/.test(
-    s
-  )
```

## update lib/actions/order.actions.ts

```ts
-import { AVAILABLE_DELIVERY_DATES, PAGE_SIZE } from '../constants'
import { getSetting } from './setting.actions'
-// GET
-  limit = limit || PAGE_SIZE
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
-  limit = limit || PAGE_SIZE
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  const { availableDeliveryDates } = await getSetting()
-    AVAILABLE_DELIVERY_DATES[
    availableDeliveryDates[
-        ? AVAILABLE_DELIVERY_DATES.length - 1
        ? availableDeliveryDates.length - 1
-
-    AVAILABLE_DELIVERY_DATES,
    availableDeliveryDates,
-        ? AVAILABLE_DELIVERY_DATES.length - 1
        ? availableDeliveryDates.length - 1
  const {
    common: { pageSize },
  } = await getSetting()
  const limit = pageSize
-    .limit(PAGE_SIZE)
    .limit(limit)
```

## update lib/actions/product.actions.ts

```ts
-import { PAGE_SIZE } from '../constants'
import { getSetting } from './setting.actions'
-  const pageSize = limit || PAGE_SIZE
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
-    .skip(pageSize * (Number(page) - 1))
-    .limit(pageSize)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
-  limit = PAGE_SIZE,
  limit = 4,
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
-  limit = limit || PAGE_SIZE
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
```

## update lib/actions/review.actions.ts

```ts
-import { PAGE_SIZE } from '../constants'
import { getSetting } from './setting.actions'
-  limit = limit || PAGE_SIZE
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
```

## create lib/actions/setting.actions.ts

```ts
'use server'
import { ISettingInput } from '@/types'
import data from '../data'
import Setting from '../db/models/setting.model'
import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { cookies } from 'next/headers'

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null
}
export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  await connectToDatabase()
  const setting = await Setting.findOne()
  return JSON.parse(JSON.stringify(setting)) as ISettingInput
}

export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    console.log('hit db')
    await connectToDatabase()
    const setting = await Setting.findOne().lean()
    globalForSettings.cachedSettings = setting
      ? JSON.parse(JSON.stringify(setting))
      : data.settings[0]
  }
  return globalForSettings.cachedSettings as ISettingInput
}

export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    await connectToDatabase()
    const updatedSetting = await Setting.findOneAndUpdate({}, newSetting, {
      upsert: true,
      new: true,
    }).lean()
    globalForSettings.cachedSettings = JSON.parse(
      JSON.stringify(updatedSetting)
    ) // Update the cache
    return {
      success: true,
      message: 'Setting updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Server action to update the currency cookie
export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('currency', newCurrency)

  return {
    success: true,
    message: 'Currency updated successfully',
  }
}
```

## update lib/actions/user.actions.ts

```ts
-import { PAGE_SIZE } from '../constants'
import { getSetting } from './setting.actions'
-  limit = limit || PAGE_SIZE
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
```

## update lib/constants.ts

```ts
-export const SERVER_URL =
-  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
-export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NxtAmzn'
-export const APP_SLOGAN =
-  process.env.NEXT_PUBLIC_APP_SLOGAN || 'Spend less, enjoy more.'
-export const APP_DESCRIPTION =
-  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
-  'An Amazon clone built with Next.js and MongoDB'
-export const APP_COPYRIGHT =
-  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
-  `Copyright © 2025 ${APP_NAME}. All rights reserved.`
-
-export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
-export const FREE_SHIPPING_MIN_PRICE = Number(
-  process.env.FREE_SHIPPING_MIN_PRICE || 35
-)
-
-export const AVAILABLE_PAYMENT_METHODS = [
-  {
-    name: 'PayPal',
-    commission: 0,
-    isDefault: true,
-  },
-  {
-    name: 'Stripe',
-    commission: 0,
-    isDefault: true,
-  },
-  {
-    name: 'Cash On Delivery',
-    commission: 0,
-    isDefault: true,
-  },
-]
-export const DEFAULT_PAYMENT_METHOD =
-  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'
-
-export const AVAILABLE_DELIVERY_DATES = [
-  {
-    name: 'Tomorrow',
-    daysToDeliver: 1,
-    shippingPrice: 12.9,
-    freeShippingMinPrice: 0,
-  },
-  {
-    name: 'Next 3 Days',
-    daysToDeliver: 3,
-    shippingPrice: 6.9,
-    freeShippingMinPrice: 0,
-  },
-  {
-    name: 'Next 5 Days',
-    daysToDeliver: 5,
-    shippingPrice: 4.9,
-    freeShippingMinPrice: 35,
-  },
-]
-
-export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'
export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'
export const COLORS = ['Gold', 'Green', 'Red']
export const THEMES = ['Light', 'Dark', 'System']
```

## create app/[locale]/(auth)/layout.tsx

```ts
import { getSetting } from '@/lib/actions/setting.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { site } = await getSetting()
  return (
    <div className='flex flex-col items-center min-h-screen highlight-link  '>
      <header className='mt-8'>
        <Link href='/'>
          <Image
            src='/icons/logo.svg'
            alt='logo'
            width={64}
            height={64}
            priority
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Link>
      </header>
      <main className='mx-auto max-w-sm min-w-80 p-4'>{children}</main>
      <footer className=' flex-1 mt-8  bg-gray-800 w-full flex flex-col gap-4 items-center p-8 text-sm'>
        <div className='flex justify-center space-x-4'>
          <Link href='/page/conditions-of-use'>Conditions of Use</Link>
          <Link href='/page/privacy-policy'> Privacy Notice</Link>
          <Link href='/page/help'> Help </Link>
        </div>
        <div>
          <p className='text-gray-400'>{site.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
```

## create app/[locale]/(auth)/sign-in/credentials-signin-form.tsx

```ts
'use client'
import { redirect, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import useSettingStore from '@/hooks/use-setting-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { IUserSignIn } from '@/types'
import { signInWithCredentials } from '@/lib/actions/user.actions'

import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignInSchema } from '@/lib/validator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

const signInDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        email: 'admin@example.com',
        password: '123456',
      }
    : {
        email: '',
        password: '',
      }

export default function CredentialsSignInForm() {
  const {
    setting: { site },
  } = useSettingStore()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: IUserSignIn) => {
    try {
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      redirect(callbackUrl)
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className='space-y-6'>
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type='submit'>Sign In</Button>
          </div>
          <div className='text-sm'>
            By signing in, you agree to {site.name}&apos;s{' '}
            <Link href='/page/conditions-of-use'>Conditions of Use</Link> and{' '}
            <Link href='/page/privacy-policy'>Privacy Notice.</Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
```

## create app/[locale]/(auth)/sign-in/google-signin-form.tsx

```ts
'use client'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { SignInWithGoogle } from '@/lib/actions/user.actions'

export function GoogleSignInForm() {
  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className="w-full" variant="outline">
        {pending ? 'Redirecting to Google...' : 'Sign In with Google'}
      </Button>
    )
  }
  return (
    <form action={SignInWithGoogle}>
      <SignInButton />
    </form>
  )
}
```

## create app/[locale]/(auth)/sign-in/page.tsx

```ts
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import SeparatorWithOr from '@/components/shared/separator-or'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import CredentialsSignInForm from './credentials-signin-form'
import { GoogleSignInForm } from './google-signin-form'
import { Button } from '@/components/ui/button'
import { getSetting } from '@/lib/actions/setting.actions'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function SignInPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams
  const { site } = await getSetting()

  const { callbackUrl = '/' } = searchParams

  const session = await auth()
  if (session) {
    return redirect(callbackUrl)
  }

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <CredentialsSignInForm />
            <SeparatorWithOr />
            <div className='mt-4'>
              <GoogleSignInForm />
            </div>
          </div>
        </CardContent>
      </Card>
      <SeparatorWithOr>New to {site.name}?</SeparatorWithOr>

      <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        <Button className='w-full' variant='outline'>
          Create your {site.name} account
        </Button>
      </Link>
    </div>
  )
}
```

## create app/[locale]/(auth)/sign-up/page.tsx

```ts
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import SignUpForm from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default async function SignUpPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams

  const { callbackUrl } = searchParams

  const session = await auth()
  if (session) {
    return redirect(callbackUrl || '/')
  }

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}
```

## create app/[locale]/(auth)/sign-up/signup-form.tsx

```ts
'use client'
import { redirect, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import useSettingStore from '@/hooks/use-setting-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { IUserSignUp } from '@/types'
import { registerUser, signInWithCredentials } from '@/lib/actions/user.actions'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignUpSchema } from '@/lib/validator'
import { Separator } from '@/components/ui/separator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

const signUpDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'john doe',
        email: 'john@me.com',
        password: '123456',
        confirmPassword: '123456',
      }
    : {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }

export default function CredentialsSignInForm() {
  const {
    setting: { site },
  } = useSettingStore()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: IUserSignUp) => {
    try {
      const res = await registerUser(data)
      if (!res.success) {
        toast({
          title: 'Error',
          description: res.error,
          variant: 'destructive',
        })
        return
      }
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      redirect(callbackUrl)
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className='space-y-6'>
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Confirm Password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type='submit'>Sign Up</Button>
          </div>
          <div className='text-sm'>
            By creating an account, you agree to {site.name}&apos;s{' '}
            <Link href='/page/conditions-of-use'>Conditions of Use</Link> and{' '}
            <Link href='/page/privacy-policy'> Privacy Notice. </Link>
          </div>
          <Separator className='mb-4' />
          <div className='text-sm'>
            Already have an account?{' '}
            <Link className='link' href={`/sign-in?callbackUrl=${callbackUrl}`}>
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
```

## create app/[locale]/(home)/layout.tsx

```ts
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 flex flex-col'>{children}</main>
      <Footer />
    </div>
  )
}
```

## create app/[locale]/(home)/page.tsx

```ts
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import {
  getProductsForCard,
  getProductsByTag,
  getAllCategories,
} from '@/lib/actions/product.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { toSlug } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Home')
  const { carousels } = await getSetting()
  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })

  const categories = (await getAllCategories()).slice(0, 4)
  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
  })
  const featureds = await getProductsForCard({
    tag: 'featured',
  })
  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
  })
  const cards = [
    {
      title: t('Categories to explore'),
      link: {
        text: t('See More'),
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: t('Explore New Arrivals'),
      items: newArrivals,
      link: {
        text: t('View All'),
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: t('Discover Best Sellers'),
      items: bestSellers,
      link: {
        text: t('View All'),
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: t('Featured Products'),
      items: featureds,
      link: {
        text: t('Shop Now'),
        href: '/search?tag=new-arrival',
      },
    },
  ]

  return (
    <>
      <HomeCarousel items={carousels} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCard cards={cards} />
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider
              title={t('Best Selling Products')}
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>

      <div className='p-4 bg-background'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}
```

## create app/[locale]/(root)/account/layout.tsx

```ts
import React from 'react'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=' flex-1 p-4'>
      <div className='max-w-5xl mx-auto space-y-4'>{children}</div>
    </div>
  )
}
```

## create app/[locale]/(root)/account/manage/name/page.tsx

```ts
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'

const PAGE_TITLE = 'Change Your Name'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function ProfilePage() {
  const session = await auth()
  const { site } = await getSetting()
  return (
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex gap-2 '>
          <Link href='/account'>Your Account</Link>
          <span>›</span>
          <Link href='/account/manage'>Login & Security</Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>
        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
        <Card className='max-w-2xl'>
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <p className='text-sm py-2'>
              If you want to change the name associated with your {site.name}
              &apos;s account, you may do so below. Be sure to click the Save
              Changes button when you are done.
            </p>
            <ProfileForm />
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
```

## create app/[locale]/(root)/account/manage/name/profile-form.tsx

```ts
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { updateUserName } from '@/lib/actions/user.actions'
import { UserNameSchema } from '@/lib/validator'

export const ProfileForm = () => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof UserNameSchema>>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
    },
  })
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof UserNameSchema>) {
    const res = await updateUserName(values)
    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      })

    const { data, message } = res
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    }
    await update(newSession)
    toast({
      description: message,
    })
    router.push('/account/manage')
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='  flex flex-col gap-5'
      >
        <div className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='font-bold'>New name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Name'
                    {...field}
                    className='input-field'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          size='lg'
          disabled={form.formState.isSubmitting}
          className='button col-span-2 w-full'
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}
```

## create app/[locale]/(root)/account/manage/page.tsx

```ts
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default async function ProfilePage() {
  const session = await auth()
  return (
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex gap-2 '>
          <Link href='/account'>Your Account</Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>
        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
        <Card className='max-w-2xl '>
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Name</h3>
              <p>{session?.user.name}</p>
            </div>
            <div>
              <Link href='/account/manage/name'>
                <Button className='rounded-full w-32' variant='outline'>
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
          <Separator />
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Email</h3>
              <p>{session?.user.email}</p>
              <p>will be implemented in the next version</p>
            </div>
            <div>
              <Link href='#'>
                <Button
                  disabled
                  className='rounded-full w-32'
                  variant='outline'
                >
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
          <Separator />
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Password</h3>
              <p>************</p>
              <p>will be implemented in the next version</p>
            </div>
            <div>
              <Link href='#'>
                <Button
                  disabled
                  className='rounded-full w-32'
                  variant='outline'
                >
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
```

## create app/[locale]/(root)/account/orders/[id]/page.tsx

```ts
import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import Link from 'next/link'
import { formatId } from '@/lib/utils'

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  return {
    title: `Order ${formatId(params.id)}`,
  }
}

export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  return (
    <>
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>
        <span>›</span>
        <Link href='/account/orders'>Your Orders</Link>
        <span>›</span>
        <span>Order {formatId(order._id)}</span>
      </div>
      <h1 className='h1-bold py-4'>Order {formatId(order._id)}</h1>
      <OrderDetailsForm
        order={order}
        isAdmin={session?.user?.role === 'Admin' || false}
      />
    </>
  )
}
```

## create app/[locale]/(root)/account/orders/page.tsx

```ts
import { Metadata } from 'next'
import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getMyOrders } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime, formatId } from '@/lib/utils'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'

const PAGE_TITLE = 'Your Orders'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const orders = await getMyOrders({
    page,
  })
  return (
    <div>
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>
        <span>›</span>
        <span>{PAGE_TITLE}</span>
      </div>
      <h1 className='h1-bold pt-4'>{PAGE_TITLE}</h1>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className=''>
                  You have no orders.
                </TableCell>
              </TableRow>
            )}
            {orders.data.map((order: IOrder) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Link href={`/account/orders/${order._id}`}>
                    {formatId(order._id)}
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell>
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'No'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'No'}
                </TableCell>
                <TableCell>
                  <Link href={`/account/orders/${order._id}`}>
                    <span className='px-2'>Details</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages} />
        )}
      </div>
      <BrowsingHistoryList className='mt-16' />
    </div>
  )
}
```

## create app/[locale]/(root)/account/page.tsx

```ts
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { Card, CardContent } from '@/components/ui/card'
import { Home, PackageCheckIcon, User } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

const PAGE_TITLE = 'Your Account'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default function AccountPage() {
  return (
    <div>
      <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
      <div className='grid md:grid-cols-3 gap-4 items-stretch'>
        <Card>
          <Link href='/account/orders'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div>
                <PackageCheckIcon className='w-12 h-12' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>Orders</h2>
                <p className='text-muted-foreground'>
                  Track, return, cancel an order, download invoice or buy again
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card>
          <Link href='/account/manage'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div>
                <User className='w-12 h-12' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>Login & security</h2>
                <p className='text-muted-foreground'>
                  Manage password, email and mobile number
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card>
          <Link href='/account/addresses'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div>
                <Home className='w-12 h-12' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>Addresses</h2>
                <p className='text-muted-foreground'>
                  Edit, remove or set default address
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
      <BrowsingHistoryList className='mt-16' />
    </div>
  )
}
```

## create app/[locale]/(root)/cart/[itemId]/cart-add-item.tsx

```ts
'use client'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CheckCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'

export default function CartAddItem({ itemId }: { itemId: string }) {
  const {
    cart: { items, itemsPrice },
  } = useCartStore()
  const {
    setting: {
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()
  const item = items.find((x) => x.clientId === itemId)

  const t = useTranslations()
  if (!item) return notFound()
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
        <Card className='w-full rounded-none'>
          <CardContent className='flex h-full items-center justify-center  gap-3 py-4'>
            <Link href={`/product/${item.slug}`}>
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Link>
            <div>
              <h3 className='text-xl font-bold flex gap-2 my-2'>
                <CheckCircle2Icon className='h-6 w-6 text-green-700' />
                {t('Cart.Added to cart')}
              </h3>
              <p className='text-sm'>
                <span className='font-bold'> {t('Cart.Color')}: </span>{' '}
                {item.color ?? '-'}
              </p>
              <p className='text-sm'>
                <span className='font-bold'> {t('Cart.Size')}: </span>{' '}
                {item.size ?? '-'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 h-full'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              <div className='flex justify-center items-center'>
                {itemsPrice < freeShippingMinPrice ? (
                  <div className='text-center '>
                    {t('Cart.Add')}{' '}
                    <span className='text-green-700'>
                      <ProductPrice
                        price={freeShippingMinPrice - itemsPrice}
                        plain
                      />
                    </span>{' '}
                    {t(
                      'Cart.of eligible items to your order to qualify for FREE Shipping'
                    )}
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <div>
                      <span className='text-green-700'>
                        Your order qualifies for FREE Shipping.
                      </span>{' '}
                      Choose this option at checkout.
                    </div>
                  </div>
                )}
              </div>
              <div className='lg:border-l lg:border-muted lg:pl-3 flex flex-col items-center gap-3  '>
                <div className='flex gap-3'>
                  <span className='text-lg font-bold'>Cart Subtotal:</span>
                  <ProductPrice className='text-2xl' price={itemsPrice} />
                </div>
                <Link
                  href='/checkout'
                  className={cn(buttonVariants(), 'rounded-full w-full')}
                >
                  Proceed to checkout (
                  {items.reduce((a, c) => a + c.quantity, 0)} items)
                </Link>
                <Link
                  href='/cart'
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'rounded-full w-full'
                  )}
                >
                  {t('Cart.Go to Cart')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <BrowsingHistoryList />
    </div>
  )
}
```

## create app/[locale]/(root)/cart/[itemId]/page.tsx

```ts
import CartAddItem from './cart-add-item'

export default async function CartAddItemPage(props: {
  params: Promise<{ itemId: string }>
}) {
  const { itemId } = await props.params

  return <CartAddItem itemId={itemId} />
}
```

## create app/[locale]/(root)/cart/page.tsx

```ts
'use client'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function CartPage() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()
  const router = useRouter()
  const {
    setting: {
      site,
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()

  const t = useTranslations()
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-4  md:gap-4'>
        {items.length === 0 ? (
          <Card className='col-span-4 rounded-none'>
            <CardHeader className='text-3xl  '>
              {t('Cart.Your Shopping Cart is empty')}
            </CardHeader>
            <CardContent>
              {t.rich('Cart.Continue shopping on', {
                name: site.name,
                home: (chunks) => <Link href='/'>{chunks}</Link>,
              })}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className='col-span-3'>
              <Card className='rounded-none'>
                <CardHeader className='text-3xl pb-0'>
                  {t('Cart.Shopping Cart')}
                </CardHeader>
                <CardContent className='p-4'>
                  <div className='flex justify-end border-b mb-4'>
                    {t('Cart.Price')}
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.clientId}
                      className='flex flex-col md:flex-row justify-between py-4 border-b gap-4'
                    >
                      <Link href={`/product/${item.slug}`}>
                        <div className='relative w-40 h-40'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes='20vw'
                            style={{
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                      </Link>

                      <div className='flex-1 space-y-4'>
                        <Link
                          href={`/product/${item.slug}`}
                          className='text-lg hover:no-underline  '
                        >
                          {item.name}
                        </Link>
                        <div>
                          <p className='text-sm'>
                            <span className='font-bold'>
                              {' '}
                              {t('Cart.Color')}:{' '}
                            </span>{' '}
                            {item.color}
                          </p>
                          <p className='text-sm'>
                            <span className='font-bold'>
                              {' '}
                              {t('Cart.Size')}:{' '}
                            </span>{' '}
                            {item.size}
                          </p>
                        </div>
                        <div className='flex gap-2 items-center'>
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={(value) =>
                              updateItem(item, Number(value))
                            }
                          >
                            <SelectTrigger className='w-auto'>
                              <SelectValue>
                                {t('Cart.Quantity')}: {item.quantity}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent position='popper'>
                              {Array.from({
                                length: item.countInStock,
                              }).map((_, i) => (
                                <SelectItem key={i + 1} value={`${i + 1}`}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant={'outline'}
                            onClick={() => removeItem(item)}
                          >
                            {t('Cart.Delete')}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className='text-right'>
                          {item.quantity > 1 && (
                            <>
                              {item.quantity} x
                              <ProductPrice price={item.price} plain />
                              <br />
                            </>
                          )}

                          <span className='font-bold text-lg'>
                            <ProductPrice
                              price={item.price * item.quantity}
                              plain
                            />
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className='flex justify-end text-lg my-2'>
                    {t('Cart.Subtotal')} (
                    {items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                    {t('Cart.Items')}):{' '}
                    <span className='font-bold ml-1'>
                      <ProductPrice price={itemsPrice} plain />
                    </span>{' '}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className='rounded-none'>
                <CardContent className='py-4 space-y-4'>
                  {itemsPrice < freeShippingMinPrice ? (
                    <div className='flex-1'>
                      {t('Cart.Add')}{' '}
                      <span className='text-green-700'>
                        <ProductPrice
                          price={freeShippingMinPrice - itemsPrice}
                          plain
                        />
                      </span>{' '}
                      {t(
                        'Cart.of eligible items to your order to qualify for FREE Shipping'
                      )}
                    </div>
                  ) : (
                    <div className='flex-1'>
                      <span className='text-green-700'>
                        {t('Cart.Your order qualifies for FREE Shipping')}
                      </span>{' '}
                      {t('Cart.Choose this option at checkout')}
                    </div>
                  )}
                  <div className='text-lg'>
                    {t('Cart.Subtotal')} (
                    {items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                    {t('Cart.items')}):{' '}
                    <span className='font-bold'>
                      <ProductPrice price={itemsPrice} plain />
                    </span>{' '}
                  </div>
                  <Button
                    onClick={() => router.push('/checkout')}
                    className='rounded-full w-full'
                  >
                    {t('Cart.Proceed to Checkout')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      <BrowsingHistoryList className='mt-10' />
    </div>
  )
}
```

## create app/[locale]/(root)/layout.tsx

```ts
import React from 'react'

import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 flex flex-col p-4'>{children}</main>
      <Footer />
    </div>
  )
}
```

## create app/[locale]/(root)/page/[slug]/page.tsx

```ts
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { getWebPageBySlug } from '@/lib/actions/web-page.actions'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  const { slug } = params

  const webPage = await getWebPageBySlug(slug)
  if (!webPage) {
    return { title: 'Web page not found' }
  }
  return {
    title: webPage.title,
  }
}

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const params = await props.params
  const { slug } = params
  const webPage = await getWebPageBySlug(slug)

  if (!webPage) notFound()

  return (
    <div className='p-4 max-w-3xl mx-auto'>
      <h1 className='h1-bold py-4'>{webPage.title}</h1>
      <section className='text-justify text-lg mb-20 web-page-content'>
        <ReactMarkdown>{webPage.content}</ReactMarkdown>
      </section>
    </div>
  )
}
```

## create app/[locale]/(root)/product/[slug]/page.tsx

```ts
import { auth } from '@/auth'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.actions'

import ReviewList from './review-list'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history'
import { Separator } from '@/components/ui/separator'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import RatingSummary from '@/components/shared/product/rating-summary'
import ProductSlider from '@/components/shared/product/product-slider'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const t = await getTranslations()
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return { title: t('Product.Product not found') }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams

  const { page, color, size } = searchParams

  const params = await props.params

  const { slug } = params

  const session = await auth()

  const product = await getProductBySlug(slug)

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id,
    page: Number(page || '1'),
  })

  const t = await getTranslations()
  return (
    <div>
      <AddToBrowsingHistory id={product._id} category={product.category} />
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5  '>
          <div className='col-span-2'>
            <ProductGallery images={product.images} />
          </div>

          <div className='flex w-full flex-col gap-2 md:p-5 col-span-2'>
            <div className='flex flex-col gap-3'>
              <p className='p-medium-16 rounded-full bg-grey-500/10   text-grey-500'>
                {t('Product.Brand')} {product.brand} {product.category}
              </p>
              <h1 className='font-bold text-lg lg:text-xl'>{product.name}</h1>

              <RatingSummary
                avgRating={product.avgRating}
                numReviews={product.numReviews}
                asPopover
                ratingDistribution={product.ratingDistribution}
              />
              <Separator />
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <ProductPrice
                    price={product.price}
                    listPrice={product.listPrice}
                    isDeal={product.tags.includes('todays-deal')}
                    forListing={false}
                  />
                </div>
              </div>
            </div>
            <div>
              <SelectVariant
                product={product}
                size={size || product.sizes[0]}
                color={color || product.colors[0]}
              />
            </div>
            <Separator className='my-2' />
            <div className='flex flex-col gap-2'>
              <p className='p-bold-20 text-grey-600'>
                {t('Product.Description')}:
              </p>
              <p className='p-medium-16 lg:p-regular-18'>
                {product.description}
              </p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className='p-4 flex flex-col  gap-4'>
                <ProductPrice price={product.price} />

                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <div className='text-destructive font-bold'>
                    {t('Product.Only X left in stock - order soon', {
                      count: product.countInStock,
                    })}
                  </div>
                )}
                {product.countInStock !== 0 ? (
                  <div className='text-green-700 text-xl'>
                    {t('Product.In Stock')}
                  </div>
                ) : (
                  <div className='text-destructive text-xl'>
                    {t('Product.Out of Stock')}
                  </div>
                )}

                {product.countInStock !== 0 && (
                  <div className='flex justify-center items-center'>
                    <AddToCart
                      item={{
                        clientId: generateId(),
                        product: product._id,
                        countInStock: product.countInStock,
                        name: product.name,
                        slug: product.slug,
                        category: product.category,
                        price: round2(product.price),
                        quantity: 1,
                        image: product.images[0],
                        size: size || product.sizes[0],
                        color: color || product.colors[0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <h2 className='h2-bold mb-2' id='reviews'>
          {t('Product.Customer Reviews')}
        </h2>
        <ReviewList product={product} userId={session?.user.id} />
      </section>
      <section className='mt-10'>
        <ProductSlider
          products={relatedProducts.data}
          title={t('Product.Best Sellers in', { name: product.category })}
        />
      </section>
      <section>
        <BrowsingHistoryList className='mt-10' />
      </section>
    </div>
  )
}
```

## create app/[locale]/(root)/product/[slug]/review-list.tsx

```ts
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Check, StarIcon, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

import Rating from '@/components/shared/product/rating'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  createUpdateReview,
  getReviewByProductId,
  getReviews,
} from '@/lib/actions/review.actions'
import { ReviewInputSchema } from '@/lib/validator'
import RatingSummary from '@/components/shared/product/rating-summary'
import { IProduct } from '@/lib/db/models/product.model'
import { Separator } from '@/components/ui/separator'
import { IReviewDetails } from '@/types'

const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
}

export default function ReviewList({
  userId,
  product,
}: {
  userId: string | undefined
  product: IProduct
}) {
  const t = useTranslations('Product')
  const [page, setPage] = useState(2)
  const [totalPages, setTotalPages] = useState(0)
  const [reviews, setReviews] = useState<IReviewDetails[]>([])
  const { ref, inView } = useInView({ triggerOnce: true })
  const reload = async () => {
    try {
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        variant: 'destructive',
        description: t('Error in fetching reviews'),
      })
    }
  }

  const loadMoreReviews = async () => {
    if (totalPages !== 0 && page > totalPages) return
    setLoadingReviews(true)
    const res = await getReviews({ productId: product._id, page })
    setLoadingReviews(false)
    setReviews([...reviews, ...res.data])
    setTotalPages(res.totalPages)
    setPage(page + 1)
  }

  const [loadingReviews, setLoadingReviews] = useState(false)
  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true)
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      setLoadingReviews(false)
    }

    if (inView) {
      loadReviews()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  type CustomerReview = z.infer<typeof ReviewInputSchema>
  const form = useForm<CustomerReview>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: reviewFormDefaultValues,
  })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
    const res = await createUpdateReview({
      data: { ...values, product: product._id },
      path: `/product/${product.slug}`,
    })
    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      })
    setOpen(false)
    reload()
    toast({
      description: res.message,
    })
  }

  const handleOpenForm = async () => {
    form.setValue('product', product._id)
    form.setValue('user', userId!)
    form.setValue('isVerifiedPurchase', true)
    const review = await getReviewByProductId({ productId: product._id })
    if (review) {
      form.setValue('title', review.title)
      form.setValue('comment', review.comment)
      form.setValue('rating', review.rating)
    }
    setOpen(true)
  }
  return (
    <div className='space-y-2'>
      {reviews.length === 0 && <div>{t('No reviews yet')}</div>}

      <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
        <div className='flex flex-col gap-2'>
          {reviews.length !== 0 && (
            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              ratingDistribution={product.ratingDistribution}
            />
          )}
          <Separator className='my-3' />
          <div className='space-y-3'>
            <h3 className='font-bold text-lg lg:text-xl'>
              {t('Review this product')}
            </h3>
            <p className='text-sm'>
              {t('Share your thoughts with other customers')}
            </p>
            {userId ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  onClick={handleOpenForm}
                  variant='outline'
                  className=' rounded-full w-full'
                >
                  {t('Write a customer review')}
                </Button>

                <DialogContent className='sm:max-w-[425px]'>
                  <Form {...form}>
                    <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>
                          {t('Write a customer review')}
                        </DialogTitle>
                        <DialogDescription>
                          {t('Share your thoughts with other customers')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='flex flex-col gap-5  '>
                          <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Title')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('Enter title')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='comment'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Comment')}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={t('Enter comment')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name='rating'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('Rating')}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t('Select a rating')}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 5 }).map(
                                      (_, index) => (
                                        <SelectItem
                                          key={index}
                                          value={(index + 1).toString()}
                                        >
                                          <div className='flex items-center gap-1'>
                                            {index + 1}{' '}
                                            <StarIcon className='h-4 w-4' />
                                          </div>
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type='submit'
                          size='lg'
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting
                            ? t('Submitting...')
                            : t('Submit')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <div>
                {t('Please')}{' '}
                <Link
                  href={`/sign-in?callbackUrl=/product/${product.slug}`}
                  className='highlight-link'
                >
                  {t('sign in')}
                </Link>{' '}
                {t('to write a review')}
              </div>
            )}
          </div>
        </div>
        <div className='md:col-span-3 flex flex-col gap-3'>
          {reviews.map((review: IReviewDetails) => (
            <Card key={review._id}>
              <CardHeader>
                <div className='flex-between'>
                  <CardTitle>{review.title}</CardTitle>
                  <div className='italic text-sm flex'>
                    <Check className='h-4 w-4' /> {t('Verified Purchase')}
                  </div>
                </div>
                <CardDescription>{review.comment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex space-x-4 text-sm text-muted-foreground'>
                  <Rating rating={review.rating} />
                  <div className='flex items-center'>
                    <User className='mr-1 h-3 w-3' />
                    {review.user ? review.user.name : t('Deleted User')}
                  </div>
                  <div className='flex items-center'>
                    <Calendar className='mr-1 h-3 w-3' />
                    {review.createdAt.toString().substring(0, 10)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={ref}>
            {page <= totalPages && (
              <Button variant={'link'} onClick={loadMoreReviews}>
                {t('See more reviews')}
              </Button>
            )}

            {page < totalPages && loadingReviews && t('Loading')}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## create app/[locale]/(root)/search/page.tsx

```ts
import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import {
  getAllCategories,
  getAllProducts,
  getAllTags,
} from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import ProductSortSelector from '@/components/shared/product/product-sort-selector'
import { getFilterUrl, toSlug } from '@/lib/utils'
import Rating from '@/components/shared/product/rating'

import CollapsibleOnMobile from '@/components/shared/collapsible-on-mobile'
import { getTranslations } from 'next-intl/server'

const sortOrders = [
  { value: 'price-low-to-high', name: 'Price: Low to high' },
  { value: 'price-high-to-low', name: 'Price: High to low' },
  { value: 'newest-arrivals', name: 'Newest arrivals' },
  { value: 'avg-customer-review', name: 'Avg. customer review' },
  { value: 'best-selling', name: 'Best selling' },
]

const prices = [
  {
    name: '$1 to $20',
    value: '1-20',
  },
  {
    name: '$21 to $50',
    value: '21-50',
  },
  {
    name: '$51 to $1000',
    value: '51-1000',
  },
]

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}) {
  const searchParams = await props.searchParams
  const t = await getTranslations()
  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
  } = searchParams

  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `${t('Search.Search')} ${q !== 'all' ? q : ''}
          ${category !== 'all' ? ` : ${t('Search.Category')} ${category}` : ''}
          ${tag !== 'all' ? ` : ${t('Search.Tag')} ${tag}` : ''}
          ${price !== 'all' ? ` : ${t('Search.Price')} ${price}` : ''}
          ${rating !== 'all' ? ` : ${t('Search.Rating')} ${rating}` : ''}`,
    }
  } else {
    return {
      title: t('Search.Search Products'),
    }
  }
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}) {
  const searchParams = await props.searchParams

  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
    sort = 'best-selling',
    page = '1',
  } = searchParams

  const params = { q, category, tag, price, rating, sort, page }

  const categories = await getAllCategories()
  const tags = await getAllTags()
  const data = await getAllProducts({
    category,
    tag,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  })
  const t = await getTranslations()
  return (
    <div>
      <div className='my-2 bg-card md:border-b  flex-between flex-col md:flex-row '>
        <div className='flex items-center'>
          {data.totalProducts === 0
            ? t('Search.No')
            : `${data.from}-${data.to} ${t('Search.of')} ${
                data.totalProducts
              }`}{' '}
          {t('Search.results')}
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all'
            ? ` ${t('Search.for')} `
            : null}
          {q !== 'all' && q !== '' && '"' + q + '"'}
          {category !== 'all' &&
            category !== '' &&
            `   ${t('Search.Category')}: ` + category}
          {tag !== 'all' && tag !== '' && `   ${t('Search.Tag')}: ` + tag}
          {price !== 'all' && `    ${t('Search.Price')}: ` + price}
          {rating !== 'all' &&
            `    ${t('Search.Rating')}: ` + rating + ` & ${t('Search.up')}`}
          &nbsp;
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all' ? (
            <Button variant={'link'} asChild>
              <Link href='/search'>{t('Search.Clear')}</Link>
            </Button>
          ) : null}
        </div>
        <div>
          <ProductSortSelector
            sortOrders={sortOrders}
            sort={sort}
            params={params}
          />
        </div>
      </div>
      <div className='bg-card grid md:grid-cols-5 md:gap-4'>
        <CollapsibleOnMobile title={t('Search.Filters')}>
          <div className='space-y-4'>
            <div>
              <div className='font-bold'>{t('Search.Department')}</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === category || '' === category) && 'text-primary'
                    }`}
                    href={getFilterUrl({ category: 'all', params })}
                  >
                    {t('Search.All')}
                  </Link>
                </li>
                {categories.map((c: string) => (
                  <li key={c}>
                    <Link
                      className={`${c === category && 'text-primary'}`}
                      href={getFilterUrl({ category: c, params })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className='font-bold'>{t('Search.Price')}</div>
              <ul>
                <li>
                  <Link
                    className={`${'all' === price && 'text-primary'}`}
                    href={getFilterUrl({ price: 'all', params })}
                  >
                    {t('Search.All')}
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      href={getFilterUrl({ price: p.value, params })}
                      className={`${p.value === price && 'text-primary'}`}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className='font-bold'>{t('Search.Customer Review')}</div>
              <ul>
                <li>
                  <Link
                    href={getFilterUrl({ rating: 'all', params })}
                    className={`${'all' === rating && 'text-primary'}`}
                  >
                    {t('Search.All')}
                  </Link>
                </li>

                <li>
                  <Link
                    href={getFilterUrl({ rating: '4', params })}
                    className={`${'4' === rating && 'text-primary'}`}
                  >
                    <div className='flex'>
                      <Rating size={4} rating={4} /> {t('Search.& Up')}
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className='font-bold'>{t('Search.Tag')}</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === tag || '' === tag) && 'text-primary'
                    }`}
                    href={getFilterUrl({ tag: 'all', params })}
                  >
                    {t('Search.All')}
                  </Link>
                </li>
                {tags.map((t: string) => (
                  <li key={t}>
                    <Link
                      className={`${toSlug(t) === tag && 'text-primary'}`}
                      href={getFilterUrl({ tag: t, params })}
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleOnMobile>

        <div className='md:col-span-4 space-y-4'>
          <div>
            <div className='font-bold text-xl'>{t('Search.Results')}</div>
            <div>
              {t('Search.Check each product page for other buying options')}
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3  '>
            {data.products.length === 0 && (
              <div>{t('Search.No product found')}</div>
            )}
            {data.products.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}
```

## create app/[locale]/admin/admin-nav.tsx

```ts
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

const links = [
  {
    title: 'Overview',
    href: '/admin/overview',
  },
  {
    title: 'Products',
    href: '/admin/products',
  },
  {
    title: 'Orders',
    href: '/admin/orders',
  },
  {
    title: 'Users',
    href: '/admin/users',
  },
  {
    title: 'Pages',
    href: '/admin/web-pages',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
  },
]
export function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const t = useTranslations('Admin')
  return (
    <nav
      className={cn(
        'flex items-center flex-wrap overflow-hidden gap-2 md:gap-4',
        className
      )}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            '',
            pathname.includes(item.href) ? '' : 'text-muted-foreground'
          )}
        >
          {t(item.title)}
        </Link>
      ))}
    </nav>
  )
}
```

## create app/[locale]/admin/layout.tsx

```ts
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from '@/components/shared/header/menu'
import { AdminNav } from './admin-nav'
import { getSetting } from '@/lib/actions/setting.actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { site } = await getSetting()
  return (
    <>
      <div className='flex flex-col'>
        <div className='bg-black text-white'>
          <div className='flex h-16 items-center px-2'>
            <Link href='/'>
              <Image
                src='/icons/logo.svg'
                width={48}
                height={48}
                alt={`${site.name} logo`}
              />
            </Link>
            <AdminNav className='mx-6 hidden md:flex' />
            <div className='ml-auto flex items-center space-x-4'>
              <Menu forAdmin />
            </div>
          </div>
          <div>
            <AdminNav className='flex md:hidden px-4 pb-2' />
          </div>
        </div>
        <div className='flex-1 p-4'>{children}</div>
      </div>
    </>
  )
}
```

## create app/[locale]/admin/orders/[id]/page.tsx

```ts
import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import Link from 'next/link'

export const metadata = {
  title: 'Order Details',
}

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/orders'>Orders</Link> <span className='mx-1'>›</span>
        <Link href={`/admin/orders/${order._id}`}>{order._id}</Link>
      </div>
      <OrderDetailsForm
        order={order}
        isAdmin={session?.user?.role === 'Admin' || false}
      />
    </main>
  )
}

export default OrderDetailsPage
```

## create app/[locale]/admin/orders/page.tsx

```ts
import { Metadata } from 'next'
import Link from 'next/link'

import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions'
import { formatDateTime, formatId } from '@/lib/utils'
import { IOrderList } from '@/types'
import ProductPrice from '@/components/shared/product/product-price'

export const metadata: Metadata = {
  title: 'Admin Orders',
}
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams

  const { page = '1' } = searchParams

  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  const orders = await getAllOrders({
    page: Number(page),
  })
  return (
    <div className='space-y-2'>
      <h1 className='h1-bold'>Orders</h1>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order: IOrderList) => (
              <TableRow key={order._id}>
                <TableCell>{formatId(order._id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell>
                  {order.user ? order.user.name : 'Deleted User'}
                </TableCell>
                <TableCell>
                  {' '}
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'No'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'No'}
                </TableCell>
                <TableCell className='flex gap-1'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/orders/${order._id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order._id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages!} />
        )}
      </div>
    </div>
  )
}
```

## create app/[locale]/admin/overview/date-range-picker.tsx

```ts
'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn, formatDateTime } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { PopoverClose } from '@radix-ui/react-popover'

export function CalendarDateRangePicker({
  defaultDate,
  setDate,
  className,
}: {
  defaultDate?: DateRange
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  className?: string
}) {
  const [calendarDate, setCalendarDate] = React.useState<DateRange | undefined>(
    defaultDate
  )

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal',
              !calendarDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-0 h-4 w-4' />
            {calendarDate?.from ? (
              calendarDate.to ? (
                <>
                  {formatDateTime(calendarDate.from).dateOnly} -{' '}
                  {formatDateTime(calendarDate.to).dateOnly}
                </>
              ) : (
                formatDateTime(calendarDate.from).dateOnly
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onCloseAutoFocus={() => setCalendarDate(defaultDate)}
          className='w-auto p-0'
          align='end'
        >
          <Calendar
            mode='range'
            defaultMonth={defaultDate?.from}
            selected={calendarDate}
            onSelect={setCalendarDate}
            numberOfMonths={2}
          />
          <div className='flex gap-4 p-4 pt-0'>
            <PopoverClose asChild>
              <Button onClick={() => setDate(calendarDate)}>Apply</Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
```

## create app/[locale]/admin/overview/overview-report.tsx

```ts
'use client'
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { calculatePastDate, formatDateTime, formatNumber } from '@/lib/utils'

import SalesCategoryPieChart from './sales-category-pie-chart'

import React, { useEffect, useState, useTransition } from 'react'
import { DateRange } from 'react-day-picker'
import { getOrderSummary } from '@/lib/actions/order.actions'
import SalesAreaChart from './sales-area-chart'
import { CalendarDateRangePicker } from './date-range-picker'
import { IOrderList } from '@/types'
import ProductPrice from '@/components/shared/product/product-price'
import { Skeleton } from '@/components/ui/skeleton'
import TableChart from './table-chart'

export default function OverviewReport() {
  const t = useTranslations('Admin')
  const [date, setDate] = useState<DateRange | undefined>({
    from: calculatePastDate(30),
    to: new Date(),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<{ [key: string]: any }>()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    if (date) {
      startTransition(async () => {
        setData(await getOrderSummary(date))
      })
    }
  }, [date])

  if (!data)
    return (
      <div className='space-y-4'>
        <div>
          <h1 className='h1-bold'>Dashboard</h1>
        </div>
        {/* First Row */}
        <div className='flex gap-4'>
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className='h-36 w-full' />
          ))}
        </div>

        {/* Second Row */}
        <div>
          <Skeleton className='h-[30rem] w-full' />
        </div>

        {/* Third Row */}
        <div className='flex gap-4'>
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className='h-60 w-full' />
          ))}
        </div>

        {/* Fourth Row */}
        <div className='flex gap-4'>
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className='h-60 w-full' />
          ))}
        </div>
      </div>
    )
  return (
    <div>
      <div className='flex items-center justify-between mb-2'>
        <h1 className='h1-bold'>{t('Dashboard')}</h1>
        <CalendarDateRangePicker defaultDate={date} setDate={setDate} />
      </div>
      <div className='space-y-4'>
        <div className='grid gap-4  grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('Total Revenue')}
              </CardTitle>
              <BadgeDollarSign />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>
                <ProductPrice price={data.totalSales} plain />
              </div>
              <div>
                <Link className='text-xs' href='/admin/orders'>
                  {t('View revenue')}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('Sales')}
              </CardTitle>
              <CreditCard />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>
                {formatNumber(data.ordersCount)}
              </div>
              <div>
                <Link className='text-xs' href='/admin/orders'>
                  {t('View orders')}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('Customers')}
              </CardTitle>
              <Users />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>{data.usersCount}</div>
              <div>
                <Link className='text-xs' href='/admin/users'>
                  {t('View customers')}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('Products')}
              </CardTitle>
              <Barcode />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>{data.productsCount}</div>
              <div>
                <Link className='text-xs' href='/admin/products'>
                  {t('View products')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('Sales Overview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesAreaChart data={data.salesChartData} />
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>{t('How much you’re earning')}</CardTitle>
              <CardDescription>
                {t('Estimated')} · {t('Last 6 months')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableChart data={data.monthlySales} labelType='month' />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('Product Performance')}</CardTitle>
              <CardDescription>
                {formatDateTime(date!.from!).dateOnly} to{' '}
                {formatDateTime(date!.to!).dateOnly}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableChart data={data.topSalesProducts} labelType='product' />
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>{t('Best-Selling Categories')}</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesCategoryPieChart data={data.topSalesCategories} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('Recent Sales')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('Buyer')}</TableHead>
                    <TableHead>{t('Date')}</TableHead>
                    <TableHead>{t('Total')}</TableHead>
                    <TableHead>{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.latestOrders.map((order: IOrderList) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        {order.user ? order.user.name : t('Deleted User')}
                      </TableCell>

                      <TableCell>
                        {formatDateTime(order.createdAt).dateOnly}
                      </TableCell>
                      <TableCell>
                        <ProductPrice price={order.totalPrice} plain />
                      </TableCell>

                      <TableCell>
                        <Link href={`/admin/orders/${order._id}`}>
                          <span className='px-2'>{t('Details')}</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

## create app/[locale]/admin/overview/page.tsx

```ts
import { Metadata } from 'next'

import OverviewReport from './overview-report'
import { auth } from '@/auth'
export const metadata: Metadata = {
  title: 'Admin Dashboard',
}
const DashboardPage = async () => {
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  return <OverviewReport />
}

export default DashboardPage
```

## create app/[locale]/admin/overview/sales-area-chart.tsx

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { Card, CardContent } from '@/components/ui/card'
import useColorStore from '@/hooks/use-color-store'
import { formatDateTime } from '@/lib/utils'
import { useTheme } from 'next-themes'
import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className='p-2'>
          <p>{label && formatDateTime(new Date(label)).dateOnly}</p>
          <p className='text-primary text-xl'>
            <ProductPrice price={payload[0].value} plain />
          </p>
        </CardContent>
      </Card>
    )
  }
  return null
}

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <text x={x} y={y + 10} textAnchor='left' fill='#666' className='text-xs'>
      {formatDateTime(new Date(payload.value)).dateOnly}
      {/* {`${payload.value.split('/')[1]}/${payload.value.split('/')[2]}`} */}
    </text>
  )
}
const STROKE_COLORS: { [key: string]: { [key: string]: string } } = {
  Red: { light: '#980404', dark: '#ff3333' },
  Green: { light: '#015001', dark: '#06dc06' },
  Gold: { light: '#ac9103', dark: '#f1d541' },
}

export default function SalesAreaChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { cssColors, color } = useColorStore(theme)

  return (
    <ResponsiveContainer width='100%' height={400}>
      <AreaChart data={data}>
        <CartesianGrid horizontal={true} vertical={false} stroke='' />
        <XAxis dataKey='date' tick={<CustomXAxisTick />} interval={3} />
        <YAxis fontSize={12} tickFormatter={(value: number) => `$${value}`} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type='monotone'
          dataKey='totalSales'
          stroke={STROKE_COLORS[color.name][theme || 'light']}
          strokeWidth={2}
          fill={`hsl(${cssColors['--primary']})`}
          fillOpacity={0.8}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

## create app/[locale]/admin/overview/sales-category-pie-chart.tsx

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import useColorStore from '@/hooks/use-color-store'
import { useTheme } from 'next-themes'
import React from 'react'
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts'

export default function SalesCategoryPieChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { cssColors } = useColorStore(theme)

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <>
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
          className='text-xs'
        >
          {`${data[index]._id} ${data[index].totalSales} sales`}
        </text>
      </>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={400}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey='totalSales'
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`hsl(${cssColors['--primary']})`}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
```

## create app/[locale]/admin/overview/table-chart.tsx

```ts
'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { getMonthName } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type TableChartProps = {
  labelType: 'month' | 'product'
  data: {
    label: string
    image?: string
    value: number
    id?: string
  }[]
}

import React from 'react'

interface ProgressBarProps {
  value: number // Accepts a number between 0 and 100
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  // Ensure value stays within 0-100 range
  const boundedValue = Math.min(100, Math.max(0, value))

  return (
    <div className='relative w-full h-4 overflow-hidden'>
      <div
        className='bg-primary h-full transition-all duration-300 rounded-lg'
        style={{
          width: `${boundedValue}%`,
          float: 'right', // Aligns the bar to start from the right
        }}
      />
    </div>
  )
}

export default function TableChart({
  labelType = 'month',
  data = [],
}: TableChartProps) {
  const max = Math.max(...data.map((item) => item.value))
  const dataWithPercentage = data.map((x) => ({
    ...x,
    label: labelType === 'month' ? getMonthName(x.label) : x.label,
    percentage: Math.round((x.value / max) * 100),
  }))
  return (
    <div className='space-y-3'>
      {dataWithPercentage.map(({ label, id, value, image, percentage }) => (
        <div
          key={label}
          className='grid grid-cols-[100px_1fr_80px] md:grid-cols-[250px_1fr_80px] gap-2 space-y-4  '
        >
          {image ? (
            <Link className='flex items-end' href={`/admin/products/${id}`}>
              <Image
                className='rounded border  aspect-square object-scale-down max-w-full h-auto mx-auto mr-1'
                src={image!}
                alt={label}
                width={36}
                height={36}
              />
              <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                {label}
              </p>
            </Link>
          ) : (
            <div className='flex items-end text-sm'>{label}</div>
          )}

          <ProgressBar value={percentage} />

          <div className='text-sm text-right flex items-center'>
            <ProductPrice price={value} plain />
          </div>
        </div>
      ))}
    </div>
  )
}
```

## create app/[locale]/admin/products/[id]/page.tsx

```ts
import { notFound } from 'next/navigation'

import { getProductById } from '@/lib/actions/product.actions'
import Link from 'next/link'
import ProductForm from '../product-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Product',
}

type UpdateProductProps = {
  params: Promise<{
    id: string
  }>
}

const UpdateProduct = async (props: UpdateProductProps) => {
  const params = await props.params

  const { id } = params

  const product = await getProductById(id)
  if (!product) notFound()
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link>
        <span className='mx-1'>›</span>
        <Link href={`/admin/products/${product._id}`}>{product._id}</Link>
      </div>

      <div className='my-8'>
        <ProductForm type='Update' product={product} productId={product._id} />
      </div>
    </main>
  )
}

export default UpdateProduct
```

## create app/[locale]/admin/products/create/page.tsx

```ts
import Link from 'next/link'
import ProductForm from '../product-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Product',
}

const CreateProductPage = () => {
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link>
        <span className='mx-1'>›</span>
        <Link href='/admin/products/create'>Create</Link>
      </div>

      <div className='my-8'>
        <ProductForm type='Create' />
      </div>
    </main>
  )
}

export default CreateProductPage
```

## create app/[locale]/admin/products/page.tsx

```ts
import { Metadata } from 'next'
import ProductList from './product-list'

export const metadata: Metadata = {
  title: 'Admin Products',
}

export default async function AdminProduct() {
  return <ProductList />
}
```

## create app/[locale]/admin/products/product-form.tsx

```ts
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import { UploadButton } from '@/lib/uploadthing'
import { ProductInputSchema, ProductUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { IProductInput } from '@/types'

const productDefaultValues: IProductInput =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Sample Product',
        slug: 'sample-product',
        category: 'Sample Category',
        images: ['/images/p11-1.jpg'],
        brand: 'Sample Brand',
        description: 'This is a sample description of the product.',
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: '',
        slug: '',
        category: '',
        images: [],
        brand: '',
        description: '',
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
}) => {
  const router = useRouter()

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  const { toast } = useToast()
  async function onSubmit(values: IProductInput) {
    if (type === 'Create') {
      const res = await createProduct(values)
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/admin/products`)
      }
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      const res = await updateProduct({ ...values, _id: productId })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        router.push(`/admin/products`)
      }
    }
  }
  const images = form.watch('images')

  console.log(form.formState.errors)
  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Enter product slug'
                      className='pl-8'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => {
                        form.setValue('slug', toSlug(form.getValues('name')))
                      }}
                      className='absolute right-2 top-2.5'
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product brand' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='listPrice'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>List Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product list price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Net Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='countInStock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Count In Stock</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter product count in stock'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex justify-start items-center space-x-2'>
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt='product image'
                          className='w-20 h-20 object-cover object-center rounded-sm'
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url])
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            })
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Tell us a little bit about yourself'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Published?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product `}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
```

## create app/[locale]/admin/products/product-list.tsx

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Link from 'next/link'

import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  deleteProduct,
  getAllProductsForAdmin,
} from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'

import React, { useEffect, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { formatDateTime, formatId } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ProductListDataProps = {
  products: IProduct[]
  totalPages: number
  totalProducts: number
  to: number
  from: number
}
const ProductList = () => {
  const [page, setPage] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string>('')
  const [data, setData] = useState<ProductListDataProps>()
  const [isPending, startTransition] = useTransition()

  const handlePageChange = (changeType: 'next' | 'prev') => {
    const newPage = changeType === 'next' ? page + 1 : page - 1
    if (changeType === 'next') {
      setPage(newPage)
    } else {
      setPage(newPage)
    }
    startTransition(async () => {
      const data = await getAllProductsForAdmin({
        query: inputValue,
        page: newPage,
      })
      setData(data)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (value) {
      clearTimeout((window as any).debounce)
      ;(window as any).debounce = setTimeout(() => {
        startTransition(async () => {
          const data = await getAllProductsForAdmin({ query: value, page: 1 })
          setData(data)
        })
      }, 500)
    } else {
      startTransition(async () => {
        const data = await getAllProductsForAdmin({ query: '', page })
        setData(data)
      })
    }
  }
  useEffect(() => {
    startTransition(async () => {
      const data = await getAllProductsForAdmin({ query: '' })
      setData(data)
    })
  }, [])

  return (
    <div>
      <div className='space-y-2'>
        <div className='flex-between flex-wrap gap-2'>
          <div className='flex flex-wrap items-center gap-2 '>
            <h1 className='font-bold text-lg'>Products</h1>
            <div className='flex flex-wrap items-center  gap-2 '>
              <Input
                className='w-auto'
                type='text '
                value={inputValue}
                onChange={handleInputChange}
                placeholder='Filter name...'
              />

              {isPending ? (
                <p>Loading...</p>
              ) : (
                <p>
                  {data?.totalProducts === 0
                    ? 'No'
                    : `${data?.from}-${data?.to} of ${data?.totalProducts}`}
                  {' results'}
                </p>
              )}
            </div>
          </div>

          <Button asChild variant='default'>
            <Link href='/admin/products/create'>Create Product</Link>
          </Button>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className='text-right'>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products.map((product: IProduct) => (
                <TableRow key={product._id}>
                  <TableCell>{formatId(product._id)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/products/${product._id}`}>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className='text-right'>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>{product.avgRating}</TableCell>
                  <TableCell>{product.isPublished ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {formatDateTime(product.updatedAt).dateTime}
                  </TableCell>
                  <TableCell className='flex gap-1'>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/admin/products/${product._id}`}>Edit</Link>
                    </Button>
                    <Button asChild variant='outline' size='sm'>
                      <Link target='_blank' href={`/product/${product.slug}`}>
                        View
                      </Link>
                    </Button>
                    <DeleteDialog
                      id={product._id}
                      action={deleteProduct}
                      callbackAction={() => {
                        startTransition(async () => {
                          const data = await getAllProductsForAdmin({
                            query: inputValue,
                          })
                          setData(data)
                        })
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(data?.totalPages ?? 0) > 1 && (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => handlePageChange('prev')}
                disabled={Number(page) <= 1}
                className='w-24'
              >
                <ChevronLeft /> Previous
              </Button>
              Page {page} of {data?.totalPages}
              <Button
                variant='outline'
                onClick={() => handlePageChange('next')}
                disabled={Number(page) >= (data?.totalPages ?? 0)}
                className='w-24'
              >
                Next <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
```

## create app/[locale]/admin/users/[id]/page.tsx

```ts
import { notFound } from 'next/navigation'

import { getUserById } from '@/lib/actions/user.actions'

import UserEditForm from './user-edit-form'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit User',
}

export default async function UserEditPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const user = await getUserById(id)
  if (!user) notFound()
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/users'>Users</Link>
        <span className='mx-1'>›</span>
        <Link href={`/admin/users/${user._id}`}>{user._id}</Link>
      </div>

      <div className='my-8'>
        <UserEditForm user={user} />
      </div>
    </main>
  )
}
```

## create app/[locale]/admin/users/[id]/user-edit-form.tsx

```ts
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/lib/actions/user.actions'
import { USER_ROLES } from '@/lib/constants'
import { IUser } from '@/lib/db/models/user.model'
import { UserUpdateSchema } from '@/lib/validator'

const UserEditForm = ({ user }: { user: IUser }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof UserUpdateSchema>>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: user,
  })

  const { toast } = useToast()
  async function onSubmit(values: z.infer<typeof UserUpdateSchema>) {
    try {
      const res = await updateUser({
        ...values,
        _id: user._id,
      })
      if (!res.success)
        return toast({
          variant: 'destructive',
          description: res.message,
        })

      toast({
        description: res.message,
      })
      form.reset()
      router.push(`/admin/users`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message,
      })
    }
  }

  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter user name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter user email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a role' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex-between'>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : `Update User `}
          </Button>
          <Button
            variant='outline'
            type='button'
            onClick={() => router.push(`/admin/users`)}
          >
            Back
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UserEditForm
```

## create app/[locale]/admin/users/page.tsx

```ts
import { Metadata } from 'next'
import Link from 'next/link'

import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions'
import { IUser } from '@/lib/db/models/user.model'
import { formatId } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Admin Users',
}

export default async function AdminUser(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')
  const page = Number(searchParams.page) || 1
  const users = await getAllUsers({
    page,
  })
  return (
    <div className='space-y-2'>
      <h1 className='h1-bold'>Users</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.map((user: IUser) => (
              <TableRow key={user._id}>
                <TableCell>{formatId(user._id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className='flex gap-1'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/users/${user._id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user._id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.totalPages > 1 && (
          <Pagination page={page} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  )
}
```

## create app/[locale]/admin/web-pages/[id]/page.tsx

```ts
import { notFound } from 'next/navigation'

import { getWebPageById } from '@/lib/actions/web-page.actions'
import Link from 'next/link'
import WebPageForm from '../web-page-form'

type UpdateWebPageProps = {
  params: Promise<{
    id: string
  }>
}

const UpdateWebPage = async (props: UpdateWebPageProps) => {
  const params = await props.params

  const { id } = params

  const webPage = await getWebPageById(id)
  if (!webPage) notFound()
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/web-pages'>Web Pages</Link>
        <span className='mx-1'>›</span>
        <Link href={`/admin/web-pages/${webPage._id}`}>{webPage._id}</Link>
      </div>

      <div className='my-8'>
        <WebPageForm type='Update' webPage={webPage} webPageId={webPage._id} />
      </div>
    </main>
  )
}

export default UpdateWebPage
```

## create app/[locale]/admin/web-pages/create/page.tsx

```ts
import { Metadata } from 'next'
import WebPageForm from '../web-page-form'

export const metadata: Metadata = {
  title: 'Create WebPage',
}

export default function CreateWebPagePage() {
  return (
    <>
      <h1 className='h1-bold'>Create WebPage</h1>

      <div className='my-8'>
        <WebPageForm type='Create' />
      </div>
    </>
  )
}
```

## create app/[locale]/admin/web-pages/page.tsx

```ts
import Link from 'next/link'

import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatId } from '@/lib/utils'
import { Metadata } from 'next'
import { deleteWebPage, getAllWebPages } from '@/lib/actions/web-page.actions'
import { IWebPage } from '@/lib/db/models/web-page.model'

export const metadata: Metadata = {
  title: 'Admin Web Pages',
}

export default async function WebPageAdminPage() {
  const webPages = await getAllWebPages()
  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <h1 className='h1-bold'>Web Pages</h1>
        <Button asChild variant='default'>
          <Link href='/admin/web-pages/create'>Create WebPage</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>IsPublished</TableHead>
              <TableHead className='w-[100px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webPages.map((webPage: IWebPage) => (
              <TableRow key={webPage._id}>
                <TableCell>{formatId(webPage._id)}</TableCell>
                <TableCell>{webPage.title}</TableCell>
                <TableCell>{webPage.slug}</TableCell>
                <TableCell>{webPage.isPublished ? 'Yes' : 'No'}</TableCell>
                <TableCell className='flex gap-1'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/web-pages/${webPage._id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={webPage._id} action={deleteWebPage} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

## create app/[locale]/admin/web-pages/web-page-form.tsx

```ts
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { z } from 'zod'

import MdEditor from 'react-markdown-editor-lite'
import ReactMarkdown from 'react-markdown'
import 'react-markdown-editor-lite/lib/index.css'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createWebPage, updateWebPage } from '@/lib/actions/web-page.actions'
import { IWebPage } from '@/lib/db/models/web-page.model'
import { WebPageInputSchema, WebPageUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'

const webPageDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        title: 'Sample Page',
        slug: 'sample-page',
        content: 'Sample Content',
      }
    : {
        title: '',
        slug: '',
        content: '',
      }

const WebPageForm = ({
  type,
  webPage,
  webPageId,
}: {
  type: 'Create' | 'Update'
  webPage?: IWebPage
  webPageId?: string
}) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof WebPageInputSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(WebPageUpdateSchema)
        : zodResolver(WebPageInputSchema),
    defaultValues:
      webPage && type === 'Update' ? webPage : webPageDefaultValues,
  })

  const { toast } = useToast()
  async function onSubmit(values: z.infer<typeof WebPageInputSchema>) {
    if (type === 'Create') {
      const res = await createWebPage(values)
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/admin/web-pages`)
      }
    }
    if (type === 'Update') {
      if (!webPageId) {
        router.push(`/admin/web-pages`)
        return
      }
      const res = await updateWebPage({ ...values, _id: webPageId })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        router.push(`/admin/web-pages`)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter title' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Enter slug'
                      className='pl-8'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => {
                        form.setValue('slug', toSlug(form.getValues('title')))
                      }}
                      className='absolute right-2 top-2.5'
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <MdEditor
                    // value={markdown}
                    {...field}
                    style={{ height: '500px' }}
                    renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                    onChange={({ text }) => form.setValue('content', text)}
                  />

                  {/* <Textarea placeholder='Enter content' {...field} /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Published?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Page `}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default WebPageForm
```

## create app/[locale]/checkout/[id]/page.tsx

```ts
import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import PaymentForm from './payment-form'
import Stripe from 'stripe'

export const metadata = {
  title: 'Payment',
}

const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  let client_secret = null
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'USD',
      metadata: { orderId: order._id },
    })
    client_secret = paymentIntent.client_secret
  }
  return (
    <PaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      clientSecret={client_secret}
      isAdmin={session?.user?.role === 'Admin' || false}
    />
  )
}

export default CheckoutPaymentPage
```

## create app/[locale]/checkout/[id]/payment-form.tsx

```ts
'use client'

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  approvePayPalOrder,
  createPayPalOrder,
} from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'

import CheckoutFooter from '../checkout-footer'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import StripeForm from './stripe-form'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)
export default function OrderDetailsForm({
  order,
  paypalClientId,
  clientSecret,
}: {
  order: IOrder
  paypalClientId: string
  isAdmin: boolean
  clientSecret: string | null
}) {
  const router = useRouter()
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order
  const { toast } = useToast()

  if (isPaid) {
    redirect(`/account/orders/${order._id}`)
  }
  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    } else if (isRejected) {
      status = 'Error in loading PayPal.'
    }
    return status
  }
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order._id)
    if (!res.success)
      return toast({
        description: res.message,
        variant: 'destructive',
      })
    return res.data
  }
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order._id, data)
    toast({
      description: res.message,
      variant: res.success ? 'default' : 'destructive',
    })
  }

  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        <div>
          <div className='text-lg font-bold'>Order Summary</div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Items:</span>
              <span>
                {' '}
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span> Tax:</span>
              <span>
                {taxPrice === undefined ? (
                  '--'
                ) : (
                  <ProductPrice price={taxPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between  pt-1 font-bold text-lg'>
              <span> Order Total:</span>
              <span>
                {' '}
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>

            {!isPaid && paymentMethod === 'PayPal' && (
              <div>
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}
            {!isPaid && paymentMethod === 'Stripe' && clientSecret && (
              <Elements
                options={{
                  clientSecret,
                }}
                stripe={stripePromise}
              >
                <StripeForm
                  priceInCents={Math.round(order.totalPrice * 100)}
                  orderId={order._id}
                />
              </Elements>
            )}

            {!isPaid && paymentMethod === 'Cash On Delivery' && (
              <Button
                className='w-full rounded-full'
                onClick={() => router.push(`/account/orders/${order._id}`)}
              >
                View Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='max-w-6xl mx-auto'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* Shipping Address */}
          <div>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Shipping Address</span>
              </div>
              <div className='col-span-2'>
                <p>
                  {shippingAddress.fullName} <br />
                  {shippingAddress.street} <br />
                  {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                </p>
              </div>
            </div>
          </div>

          {/* payment method */}
          <div className='border-y'>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Payment Method</span>
              </div>
              <div className='col-span-2'>
                <p>{paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-3 my-3 pb-3'>
            <div className='flex text-lg font-bold'>
              <span>Items and shipping</span>
            </div>
            <div className='col-span-2'>
              <p>
                Delivery date:
                {formatDateTime(expectedDeliveryDate).dateOnly}
              </p>
              <ul>
                {items.map((item) => (
                  <li key={item.slug}>
                    {item.name} x {item.quantity} = {item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='block md:hidden'>
            <CheckoutSummary />
          </div>

          <CheckoutFooter />
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
```

## create app/[locale]/checkout/[id]/stripe-form.tsx

```ts
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import useSettingStore from '@/hooks/use-setting-store'

export default function StripeForm({
  priceInCents,
  orderId,
}: {
  priceInCents: number
  orderId: string
}) {
  const {
    setting: { site },
  } = useSettingStore()

  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (stripe == null || elements == null || email == null) return

    setIsLoading(true)
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${site.url}/checkout/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown error occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='text-xl'>Stripe Checkout</div>
      {errorMessage && <div className='text-destructive'>{errorMessage}</div>}
      <PaymentElement />
      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>
      <Button
        className='w-full'
        size='lg'
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading ? (
          'Purchasing...'
        ) : (
          <div>
            Purchase - <ProductPrice price={priceInCents / 100} plain />
          </div>
        )}
      </Button>
    </form>
  )
}
```

## create app/[locale]/checkout/[id]/stripe-payment-success/page.tsx

```ts
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'

import { Button } from '@/components/ui/button'
import { getOrderById } from '@/lib/actions/order.actions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function SuccessPage(props: {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ payment_intent: string }>
}) {
  const params = await props.params

  const { id } = params

  const searchParams = await props.searchParams
  const order = await getOrderById(id)
  if (!order) notFound()

  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  )
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order._id.toString()
  )
    return notFound()

  const isSuccess = paymentIntent.status === 'succeeded'
  if (!isSuccess) return redirect(`/checkout/${id}`)
  return (
    <div className='max-w-4xl w-full mx-auto space-y-8'>
      <div className='flex flex-col gap-6 items-center '>
        <h1 className='font-bold text-2xl lg:text-3xl'>
          Thanks for your purchase
        </h1>
        <div>We are now processing your order.</div>
        <Button asChild>
          <Link href={`/account/orders/${id}`}>View order</Link>
        </Button>
      </div>
    </div>
  )
}
```

## create app/[locale]/checkout/checkout-footer.tsx

```ts
import useSettingStore from '@/hooks/use-setting-store'
import Link from 'next/link'
import React from 'react'

export default function CheckoutFooter() {
  const {
    setting: { site },
  } = useSettingStore()
  return (
    <div className='border-t-2 space-y-2 my-4 py-4'>
      <p>
        Need help? Check our <Link href='/page/help'>Help Center</Link> or{' '}
        <Link href='/page/contact-us'>Contact Us</Link>{' '}
      </p>
      <p>
        For an item ordered from {site.name}: When you click the &apos;Place
        Your Order&apos; button, we will send you an e-mail acknowledging
        receipt of your order. Your contract to purchase an item will not be
        complete until we send you an e-mail notifying you that the item has
        been shipped to you. By placing your order, you agree to {site.name}
        &apos;s <Link href='/page/privacy-policy'>privacy notice</Link> and
        <Link href='/page/conditions-of-use'> conditions of use</Link>.
      </p>
      <p>
        Within 30 days of delivery, you may return new, unopened merchandise in
        its original condition. Exceptions and restrictions apply.{' '}
        <Link href='/page/returns-policy'>
          See {site.name}&apos;s Returns Policy.
        </Link>
      </p>
    </div>
  )
}
```

## create app/[locale]/checkout/checkout-form.tsx

```ts
'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/lib/actions/order.actions'
import {
  calculateFutureDate,
  formatDateTime,
  timeUntilMidnight,
} from '@/lib/utils'
import { ShippingAddressSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import CheckoutFooter from './checkout-footer'
import { ShippingAddress } from '@/types'
import useIsMounted from '@/hooks/use-is-mounted'
import Link from 'next/link'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import ProductPrice from '@/components/shared/product/product-price'

const shippingAddressDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'Basir',
        street: '1911, 65 Sherbrooke Est',
        city: 'Montreal',
        province: 'Quebec',
        phone: '4181234567',
        postalCode: 'H2X 1C4',
        country: 'Canada',
      }
    : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        phone: '',
        postalCode: '',
        country: '',
      }

const CheckoutForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const {
    setting: {
      site,
      availablePaymentMethods,
      defaultPaymentMethod,
      availableDeliveryDates,
    },
  } = useSettingStore()

  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = defaultPaymentMethod,
    },
    setShippingAddress,
    setPaymentMethod,
    updateItem,
    removeItem,
    clearCart,
    setDeliveryDateIndex,
  } = useCartStore()
  const isMounted = useIsMounted()

  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAddressDefaultValues,
  })
  const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = (values) => {
    setShippingAddress(values)
    setIsAddressSelected(true)
  }

  useEffect(() => {
    if (!isMounted || !shippingAddress) return
    shippingAddressForm.setValue('fullName', shippingAddress.fullName)
    shippingAddressForm.setValue('street', shippingAddress.street)
    shippingAddressForm.setValue('city', shippingAddress.city)
    shippingAddressForm.setValue('country', shippingAddress.country)
    shippingAddressForm.setValue('postalCode', shippingAddress.postalCode)
    shippingAddressForm.setValue('province', shippingAddress.province)
    shippingAddressForm.setValue('phone', shippingAddress.phone)
  }, [items, isMounted, router, shippingAddress, shippingAddressForm])

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] =
    useState<boolean>(false)
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] =
    useState<boolean>(false)

  const handlePlaceOrder = async () => {
    const res = await createOrder({
      items,
      shippingAddress,
      expectedDeliveryDate: calculateFutureDate(
        availableDeliveryDates[deliveryDateIndex!].daysToDeliver
      ),
      deliveryDateIndex,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })
    if (!res.success) {
      toast({
        description: res.message,
        variant: 'destructive',
      })
    } else {
      toast({
        description: res.message,
        variant: 'default',
      })
      clearCart()
      router.push(`/checkout/${res.data?.orderId}`)
    }
  }
  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true)
    setIsPaymentMethodSelected(true)
  }
  const handleSelectShippingAddress = () => {
    shippingAddressForm.handleSubmit(onSubmitShippingAddress)()
  }
  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        {!isAddressSelected && (
          <div className='border-b mb-4'>
            <Button
              className='rounded-full w-full'
              onClick={handleSelectShippingAddress}
            >
              Ship to this address
            </Button>
            <p className='text-xs text-center py-2'>
              Choose a shipping address and payment method in order to calculate
              shipping, handling, and tax.
            </p>
          </div>
        )}
        {isAddressSelected && !isPaymentMethodSelected && (
          <div className=' mb-4'>
            <Button
              className='rounded-full w-full'
              onClick={handleSelectPaymentMethod}
            >
              Use this payment method
            </Button>

            <p className='text-xs text-center py-2'>
              Choose a payment method to continue checking out. You&apos;ll
              still have a chance to review and edit your order before it&apos;s
              final.
            </p>
          </div>
        )}
        {isPaymentMethodSelected && isAddressSelected && (
          <div>
            <Button onClick={handlePlaceOrder} className='rounded-full w-full'>
              Place Your Order
            </Button>
            <p className='text-xs text-center py-2'>
              By placing your order, you agree to {site.name}&apos;s{' '}
              <Link href='/page/privacy-policy'>privacy notice</Link> and
              <Link href='/page/conditions-of-use'> conditions of use</Link>.
            </p>
          </div>
        )}

        <div>
          <div className='text-lg font-bold'>Order Summary</div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Items:</span>
              <span>
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span> Tax:</span>
              <span>
                {taxPrice === undefined ? (
                  '--'
                ) : (
                  <ProductPrice price={taxPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between  pt-4 font-bold text-lg'>
              <span> Order Total:</span>
              <span>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='max-w-6xl mx-auto highlight-link'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* shipping address */}
          <div>
            {isAddressSelected && shippingAddress ? (
              <div className='grid grid-cols-1 md:grid-cols-12    my-3  pb-3'>
                <div className='col-span-5 flex text-lg font-bold '>
                  <span className='w-8'>1 </span>
                  <span>Shipping address</span>
                </div>
                <div className='col-span-5 '>
                  <p>
                    {shippingAddress.fullName} <br />
                    {shippingAddress.street} <br />
                    {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                  </p>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsAddressSelected(false)
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className='flex text-primary text-lg font-bold my-2'>
                  <span className='w-8'>1 </span>
                  <span>Enter shipping address</span>
                </div>
                <Form {...shippingAddressForm}>
                  <form
                    method='post'
                    onSubmit={shippingAddressForm.handleSubmit(
                      onSubmitShippingAddress
                    )}
                    className='space-y-4'
                  >
                    <Card className='md:ml-8 my-4'>
                      <CardContent className='p-4 space-y-2'>
                        <div className='text-lg font-bold mb-2'>
                          Your address
                        </div>

                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='fullName'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter full name'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={shippingAddressForm.control}
                            name='street'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter address'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='city'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder='Enter city' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='province'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter province'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='country'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter country'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='postalCode'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter postal code'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='phone'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Phone number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter phone number'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className='  p-4'>
                        <Button
                          type='submit'
                          className='rounded-full font-bold'
                        >
                          Ship to this address
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </>
            )}
          </div>
          {/* payment method */}
          <div className='border-y'>
            {isPaymentMethodSelected && paymentMethod ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5'>
                  <span className='w-8'>2 </span>
                  <span>Payment Method</span>
                </div>
                <div className='col-span-5 '>
                  <p>{paymentMethod}</p>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsPaymentMethodSelected(false)
                      if (paymentMethod) setIsDeliveryDateSelected(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isAddressSelected ? (
              <>
                <div className='flex text-primary text-lg font-bold my-2'>
                  <span className='w-8'>2 </span>
                  <span>Choose a payment method</span>
                </div>
                <Card className='md:ml-8 my-4'>
                  <CardContent className='p-4'>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value)}
                    >
                      {availablePaymentMethods.map((pm) => (
                        <div key={pm.name} className='flex items-center py-1 '>
                          <RadioGroupItem
                            value={pm.name}
                            id={`payment-${pm.name}`}
                          />
                          <Label
                            className='font-bold pl-2 cursor-pointer'
                            htmlFor={`payment-${pm.name}`}
                          >
                            {pm.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className='p-4'>
                    <Button
                      onClick={handleSelectPaymentMethod}
                      className='rounded-full font-bold'
                    >
                      Use this payment method
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                <span className='w-8'>2 </span>
                <span>Choose a payment method</span>
              </div>
            )}
          </div>
          {/* items and delivery date */}
          <div>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5'>
                  <span className='w-8'>3 </span>
                  <span>Items and shipping</span>
                </div>
                <div className='col-span-5'>
                  <p>
                    Delivery date:{' '}
                    {
                      formatDateTime(
                        calculateFutureDate(
                          availableDeliveryDates[deliveryDateIndex]
                            .daysToDeliver
                        )
                      ).dateOnly
                    }
                  </p>
                  <ul>
                    {items.map((item, _index) => (
                      <li key={_index}>
                        {item.name} x {item.quantity} = {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(false)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isPaymentMethodSelected && isAddressSelected ? (
              <>
                <div className='flex text-primary  text-lg font-bold my-2'>
                  <span className='w-8'>3 </span>
                  <span>Review items and shipping</span>
                </div>
                <Card className='md:ml-8'>
                  <CardContent className='p-4'>
                    <p className='mb-2'>
                      <span className='text-lg font-bold text-green-700'>
                        Arriving{' '}
                        {
                          formatDateTime(
                            calculateFutureDate(
                              availableDeliveryDates[deliveryDateIndex!]
                                .daysToDeliver
                            )
                          ).dateOnly
                        }
                      </span>{' '}
                      If you order in the next {timeUntilMidnight().hours} hours
                      and {timeUntilMidnight().minutes} minutes.
                    </p>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div>
                        {items.map((item, _index) => (
                          <div key={_index} className='flex gap-4 py-2'>
                            <div className='relative w-16 h-16'>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes='20vw'
                                style={{
                                  objectFit: 'contain',
                                }}
                              />
                            </div>

                            <div className='flex-1'>
                              <p className='font-semibold'>
                                {item.name}, {item.color}, {item.size}
                              </p>
                              <p className='font-bold'>
                                <ProductPrice price={item.price} plain />
                              </p>

                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(value) => {
                                  if (value === '0') removeItem(item)
                                  else updateItem(item, Number(value))
                                }}
                              >
                                <SelectTrigger className='w-24'>
                                  <SelectValue>
                                    Qty: {item.quantity}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent position='popper'>
                                  {Array.from({
                                    length: item.countInStock,
                                  }).map((_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                  <SelectItem key='delete' value='0'>
                                    Delete
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className=' font-bold'>
                          <p className='mb-2'> Choose a shipping speed:</p>

                          <ul>
                            <RadioGroup
                              value={
                                availableDeliveryDates[deliveryDateIndex!].name
                              }
                              onValueChange={(value) =>
                                setDeliveryDateIndex(
                                  availableDeliveryDates.findIndex(
                                    (address) => address.name === value
                                  )!
                                )
                              }
                            >
                              {availableDeliveryDates.map((dd) => (
                                <div key={dd.name} className='flex'>
                                  <RadioGroupItem
                                    value={dd.name}
                                    id={`address-${dd.name}`}
                                  />
                                  <Label
                                    className='pl-2 space-y-2 cursor-pointer'
                                    htmlFor={`address-${dd.name}`}
                                  >
                                    <div className='text-green-700 font-semibold'>
                                      {
                                        formatDateTime(
                                          calculateFutureDate(dd.daysToDeliver)
                                        ).dateOnly
                                      }
                                    </div>
                                    <div>
                                      {(dd.freeShippingMinPrice > 0 &&
                                      itemsPrice >= dd.freeShippingMinPrice
                                        ? 0
                                        : dd.shippingPrice) === 0 ? (
                                        'FREE Shipping'
                                      ) : (
                                        <ProductPrice
                                          price={dd.shippingPrice}
                                          plain
                                        />
                                      )}
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                <span className='w-8'>3 </span>
                <span>Items and shipping</span>
              </div>
            )}
          </div>
          {isPaymentMethodSelected && isAddressSelected && (
            <div className='mt-6'>
              <div className='block md:hidden'>
                <CheckoutSummary />
              </div>

              <Card className='hidden md:block '>
                <CardContent className='p-4 flex flex-col md:flex-row justify-between items-center gap-3'>
                  <Button onClick={handlePlaceOrder} className='rounded-full'>
                    Place Your Order
                  </Button>
                  <div className='flex-1'>
                    <p className='font-bold text-lg'>
                      Order Total: <ProductPrice price={totalPrice} plain />
                    </p>
                    <p className='text-xs'>
                      {' '}
                      By placing your order, you agree to {
                        site.name
                      }&apos;s{' '}
                      <Link href='/page/privacy-policy'>privacy notice</Link>{' '}
                      and
                      <Link href='/page/conditions-of-use'>
                        {' '}
                        conditions of use
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <CheckoutFooter />
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
export default CheckoutForm
```

## create app/[locale]/checkout/layout.tsx

```ts
import { HelpCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='p-4'>
      <header className='bg-card mb-4 border-b'>
        <div className='max-w-6xl mx-auto flex justify-between items-center'>
          <Link href='/'>
            <Image
              src='/icons/logo.svg'
              alt='logo'
              width={70}
              height={70}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Link>
          <div>
            <h1 className='text-3xl'>Checkout</h1>
          </div>
          <div>
            <Link href='/page/help'>
              <HelpCircle className='w-6 h-6' />
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
```

## create app/[locale]/checkout/page.tsx

```ts
import { Metadata } from 'next'
import CheckoutForm from './checkout-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/checkout')
  }
  return <CheckoutForm />
}
```

## create app/[locale]/error.tsx

```ts
'use client'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const t = useTranslations()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        <h1 className='text-3xl font-bold mb-4'>{t('Error.Error')}</h1>
        <p className='text-destructive'>{error.message}</p>
        <Button variant='outline' className='mt-4' onClick={() => reset()}>
          {t('Error.Try again')}
        </Button>
        <Button
          variant='outline'
          className='mt-4 ml-2'
          onClick={() => (window.location.href = '/')}
        >
          {t('Error.Back To Home')}
        </Button>
      </div>
    </div>
  )
}
```

## create app/[locale]/layout.tsx

```ts
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import ClientProviders from '@/components/shared/client-providers'
import { getDirection } from '@/i18n-config'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getSetting } from '@/lib/actions/setting.actions'
import { cookies } from 'next/headers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url },
  } = await getSetting()
  return {
    title: {
      template: `%s | ${name}`,
      default: `${name}. ${slogan}`,
    },
    description: description,
    metadataBase: new URL(url),
  }
}

export default async function AppLayout({
  params,
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  const setting = await getSetting()
  const currencyCookie = (await cookies()).get('currency')
  const currency = currencyCookie ? currencyCookie.value : 'USD'

  const { locale } = await params
  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={getDirection(locale) === 'rtl' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body
        className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

## create app/[locale]/loading.tsx

```ts
import { getTranslations } from 'next-intl/server'

export default async function LoadingPage() {
  const t = await getTranslations()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        {t('Loading.Loading')}
      </div>
    </div>
  )
}
```
