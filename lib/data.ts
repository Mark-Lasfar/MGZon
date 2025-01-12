import { Data, IProductInput, IUserInput } from '@/types'
import { toSlug } from './utils'
import bcrypt from 'bcryptjs'
import { i18n } from '@/i18n-config'

const users: IUserInput[] = [
  {
    name: 'Mark',
    email: 'mark@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'Admin',
    address: {
      fullName: 'John Doe',
      street: '111 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '+20 1212444617',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jane Harris',
      street: '222 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1002',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Jack',
    email: 'jack@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jack Ryan',
      street: '333 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1003',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Sarah',
    email: 'sarah@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Sarah Smith',
      street: '444 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1005',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Michael',
    email: 'michael@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'John Alexander',
      street: '555 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1006',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Emily',
    email: 'emily@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Emily Johnson',
      street: '666 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Alice Cooper',
      street: '777 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10007',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Tom',
    email: 'tom@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Tom Hanks',
      street: '888 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10008',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Linda',
    email: 'linda@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Linda Holmes',
      street: '999 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10009',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'George',
    email: 'george@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'George Smith',
      street: '101 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10010',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Jessica',
    email: 'jessica@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jessica Brown',
      street: '102 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10011',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Chris',
    email: 'chris@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Chris Evans',
      street: '103 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10012',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Samantha',
    email: 'samantha@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Samantha Wilson',
      street: '104 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10013',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'David',
    email: 'david@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'David Lee',
      street: '105 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10014',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Anna',
    email: 'anna@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Anna Smith',
      street: '106 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10015',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
]

const products: IProductInput[] = [
  {
    name: 'Nike Mens Slim-fit Long-Sleeve T-Shirt',
    slug: toSlug('Nike Mens Slim-fit Long-Sleeve T-Shirt'),
    category: 'T-Shirts',
    images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 21.8,
    listPrice: 0,
    brand: 'Nike',
    avgRating: 4.71,
    numReviews: 7,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    numSales: 9,
    countInStock: 11,
    description:
      'Made with chemicals safer for human health and the environment',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Green', 'Red', 'Black'],

    reviews: [],
  },
  {
    name: 'Jerzees Long-Sleeve Heavyweight Blend T-Shirt',
    slug: toSlug('Jerzees Long-Sleeve Heavyweight Blend T-Shirt'),
    category: 'T-Shirts',
    images: [
      '/images/p12-1.jpg',
      '/images/p12-2.jpg',
      '/images/p12-3.jpg',
      '/images/p12-4.jpg',
    ],
    tags: ['featured'],
    isPublished: true,
    price: 23.78,
    listPrice: 0,
    brand: 'Jerzees',
    avgRating: 4.2,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    numSales: 29,
    countInStock: 12,
    description:
      'Made with sustainably sourced USA grown cotton; Shoulder-to-shoulder tape; double-needle coverstitched front neck; Set-in sleeves; Rib cuffs with concealed seams; Seamless body for a wide printing area',

    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Yellow', 'Red', 'Black'],

    reviews: [],
  },
  {
    name: "Jerzees Men's Long-Sleeve T-Shirt",
    slug: toSlug('Jerzees Men Long-Sleeve T-Shirt'),
    category: 'T-Shirts',
    brand: 'Jerzees',
    images: ['/images/p13-1.jpg', '/images/p13-2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 13.86,
    listPrice: 16.03,
    avgRating: 4,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    numSales: 55,
    countInStock: 13,
    description:
      'The Jerzees long sleeve t-shirt is made with dri-power technology that wicks away moisture to keep you cool and dry throughout your day. We also included a rib collar and cuffs for added durability, and a lay-flat collar for comfort. If you are looking for a versatile shirt that you can wear throughout the transitioning seasons, then look no further.',
    sizes: ['XL', 'XXL'],
    colors: ['Green', 'White'],

    reviews: [],
  },
  {
    name: 'Decrum Mens Plain Long Sleeve T-Shirt - Comfortable Soft Fashion V Neck Full Sleeves Jersey Shirts',
    slug: toSlug(
      'Decrum Mens Plain Long Sleeve T-Shirt - Comfortable Soft Fashion V Neck Full Sleeves Jersey Shirts'
    ),
    category: 'T-Shirts',
    brand: 'Jerzees',
    images: ['/images/p14-1.jpg', '/images/p14-2.jpg'],
    tags: ['todays-deal'],
    isPublished: true,
    price: 26.95,
    listPrice: 46.03,
    avgRating: 3.85,
    numReviews: 14,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    numSales: 54,
    countInStock: 14,
    description:
      'Elevate your outfit with this soft long sleeve t shirt men. This full sleeves tee is the ultimate upgrade from your regular cotton t-shirt. ',
    sizes: ['XL', 'XXL'],
    colors: ['Yellow', 'White'],

    reviews: [],
  },
  {
    name: "Muscle Cmdr Men's Slim Fit Henley Shirt Long&Short Business Sleeve Casual 3 Metal Buton Placket Casual Stylish T-Shirt",
    slug: toSlug(
      "Muscle Cmdr Men's Slim Fit Henley Shirt Long&Short Business Sleeve Casual 3 Metal Buton Placket Casual Stylish T-Shirt"
    ),
    category: 'T-Shirts',
    brand: ' Muscle Cmdr',
    images: ['/images/p15-1.jpg', '/images/p15-2.jpg'],
    tags: ['new-arrival', 'featured'],
    isPublished: true,
    price: 29.99,
    listPrice: 35.99,
    avgRating: 3.66,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    numSales: 54,
    countInStock: 15,
    description:
      "Slim Fit Design:Men's Muscle Slim Fit Button Henley Shirts are designed to fit snugly against your body, accentuating your muscles and creating a sleek silhouette that's perfect for any occasion. ",
    sizes: ['XL', 'XXL'],
    colors: ['Green', 'Yellow'],

    reviews: [],
  },
  {
    name: 'Hanes Mens Long Sleeve Beefy Henley Shirt',
    slug: toSlug('Hanes Mens Long Sleeve Beefy Henley Shirt'),
    category: 'T-Shirts',
    brand: 'Jerzees',
    images: ['/images/p16-1.jpg', '/images/p16-2.jpg'],
    tags: ['best-seller', 'todays-deal'],
    isPublished: true,
    price: 25.3,
    listPrice: 32.99,
    avgRating: 3.46,
    numReviews: 13,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 3 },
    ],
    countInStock: 16,
    numSales: 56,
    description:
      'Heavyweight cotton (Heathers are 60% cotton/40% polyester; Pebblestone is 75% cotton/25% polyester)',
    sizes: ['XL', 'XXL'],
    colors: ['Grey', 'White'],

    reviews: [],
  },
  // Jeans
  {
    name: 'Silver Jeans Co. Mens Jace Slim Fit Bootcut Jeans',
    slug: toSlug('Silver Jeans Co. Mens Jace Slim Fit Bootcut Jeans'),
    category: 'Jeans',
    brand: 'Silver Jeans Co',
    images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 95.34,
    listPrice: 0,
    avgRating: 4.71,
    numReviews: 7,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    countInStock: 54,
    numSales: 21,
    description:
      'Silver Jeans Co. Jace Slim Fit Bootcut Jeans - Consider Jace a modern cowboy jean. It sits below the waist and features a slim fit through the hip and thigh. Finished with an 18” bootcut leg opening that complements the slimmer silhouette while still fitting over boots',
    sizes: ['30Wx30L', '34Wx30L', '36Wx30L'],
    colors: ['Blue', 'Grey'],

    reviews: [],
  },
  {
    name: "Levi's mens 505 Regular Fit Jeans (Also Available in Big & Tall)",
    slug: toSlug(
      "Levi's mens 505 Regular Fit Jeans (Also Available in Big & Tall)"
    ),
    category: 'Jeans',
    brand: "Levi's",
    images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 59.99,
    listPrice: 69.99,
    avgRating: 4.2,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 22,
    numSales: 54,
    description:
      'A veritable classic, this 505 is made to have a comfortable look and style.',
    sizes: ['30Wx30L', '34Wx30L', '36Wx30L'],
    colors: ['Blue', 'Grey'],

    reviews: [],
  },
  {
    name: 'Essentials Mens Straight-Fit Stretch Jean',
    slug: toSlug('Essentials Mens Straight-Fit Stretch Jean'),
    category: 'Jeans',
    brand: 'Essentials',
    images: ['/images/p23-1.jpg', '/images/p23-2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 38.9,
    listPrice: 45,
    avgRating: 4,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 23,
    numSales: 54,
    description:
      'These classic 5-pocket straight-fit jeans are crafted with a bit of stretch for additional comfort and to help maintain their shape',
    sizes: ['30Wx30L', '34Wx30L', '36Wx30L'],
    colors: ['Grey', 'Blue'],

    reviews: [],
  },
  {
    name: "Buffalo David Bitton Mens Men's Driven Relaxed Denim JeansJeans",
    slug: toSlug(
      "Buffalo David Bitton Mens Men's Driven Relaxed Denim JeansJeans"
    ),
    category: 'Jeans',
    brand: 'Buffalo David Bitton',
    images: ['/images/p24-1.jpg', '/images/p24-2.jpg'],
    tags: ['todays-deal'],
    isPublished: true,
    price: 69.99,
    listPrice: 100,
    avgRating: 3.85,
    numReviews: 14,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 24,
    numSales: 53,
    description:
      'Stretch recycled denim jeans in an authentic and sanded wash blue. Features a comfortable low-rise waist with a relaxed fit at the leg. The distressed look gives these jeans an effortlessly worn-in feel. The eco-friendly logo patch in tan and red is at the back waistband. The signature maple leaf graphic is debossed at the zip-fly.',
    sizes: ['30Wx30L', '34Wx30L', '36Wx30L'],
    colors: ['Blue', 'Grey'],

    reviews: [],
  },
  {
    name: 'Dickies Mens Relaxed Fit Carpenter Jean',
    slug: toSlug('Dickies Mens Relaxed Fit Carpenter Jean'),
    category: 'Jeans',
    brand: 'Dickies',
    images: ['/images/p25-1.jpg', '/images/p25-2.jpg'],
    tags: ['new-arrival', 'featured'],
    isPublished: true,
    price: 95.34,
    listPrice: 0,
    avgRating: 3.66,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 25,
    numSales: 48,
    description:
      'Relaxed work jean with traditional carpenter-style pockets and logo patch at back pockets',
    sizes: ['30Wx30L', '34Wx30L', '36Wx30L'],
    colors: ['Blue', 'Grey'],

    reviews: [],
  },
  {
    name: 'Wrangler mens Premium Performance Cowboy Cut Slim Fit Jean',
    slug: toSlug('Wrangler mens Premium Performance Cowboy Cut Slim Fit Jean'),
    category: 'Jeans',
    brand: 'Wrangler',
    images: ['/images/p26-1.jpg', '/images/p26-2.jpg'],
    tags: ['best-seller', 'todays-deal'],
    isPublished: true,
    price: 81.78,
    listPrice: 149.99,
    avgRating: 3.46,
    numReviews: 13,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 3 },
    ],
    countInStock: 26,
    numSales: 48,
    description:
      'Designed with a functional fit in mind, these jeans are made to stack over your favorite pair of boots. Constructed with a slim fit in the waist, seat, and thigh, this jean is made for both function and comfort for long days in the saddle.',
    sizes: ['30Wx30L', '34Wx30L', '36Wx30L'],
    colors: ['Blue', 'Grey'],

    reviews: [],
  },
  // Watches
  {
    name: "Seiko Men's Analogue Watch with Black Dial",
    slug: toSlug("Seiko Men's Analogue Watch with Black Dial"),
    category: 'Wrist Watches',
    brand: 'Seiko',
    images: ['/images/p31-1.jpg', '/images/p31-2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 530.0,
    listPrice: 0,
    avgRating: 4.71,
    numReviews: 7,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    countInStock: 31,
    numSales: 48,
    description:
      'Casing: Case made of stainless steel Case shape: round Case colour: silver Glass: Hardlex Clasp type: Fold over clasp with safety',
    sizes: [],
    colors: [],

    reviews: [],
  },
  {
    name: 'SEIKO 5 Sport SRPJ83 Beige Dial Nylon Automatic Watch, Beige, Automatic Watch',
    slug: toSlug(
      'SEIKO 5 Sport SRPJ83 Beige Dial Nylon Automatic Watch, Beige, Automatic Watch'
    ),
    category: 'Wrist Watches',
    brand: 'Seiko',
    images: ['/images/p32-1.jpg', '/images/p32-2.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 375.83,
    listPrice: 400,
    avgRating: 4.2,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 32,
    numSales: 48,
    description:
      'Seiko 5 Sports Collection Inspired by vintage field/aviator style: Automatic with manual winding capability',
    sizes: [],
    colors: [],

    reviews: [],
  },
  {
    name: "Casio Men's Heavy Duty Analog Quartz Stainless Steel Strap, Silver, 42 Casual Watch ",
    slug: toSlug(
      "Casio Men's Heavy Duty Analog Quartz Stainless Steel Strap, Silver, 42 Casual Watch"
    ),
    category: 'Wrist Watches',
    brand: 'Casio',
    images: ['/images/p33-1.jpg', '/images/p33-2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 60.78,
    listPrice: 0,
    avgRating: 4,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 33,
    numSales: 48,
    description:
      'The Casio range is growing with this model  MWA-100H-1AVEF. Sporting a stainless steel case with a brushed finish, it will easily withstand all the shocks of everyday life.',
    sizes: [],
    colors: [],

    reviews: [],
  },
  {
    name: 'Casio Classic Silver-Tone Stainless Steel Band Date Indicator Watch',
    slug: toSlug(
      'Casio Classic Silver-Tone Stainless Steel Band Date Indicator Watch'
    ),
    category: 'Wrist Watches',
    brand: 'Casio',
    images: ['/images/p34-1.jpg', '/images/p34-2.jpg'],
    tags: ['todays-deal'],
    isPublished: true,
    price: 34.22,
    listPrice: 54.99,
    avgRating: 3.85,
    numReviews: 14,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 34,
    numSales: 48,
    description:
      'The new MTPVD01D-7EV is a classic 50 meter water resistant stainless steel watch now updated with a white dial. This elegant 3 hand, date display timepiece is perfect for any setting.',
    sizes: [],
    colors: [],

    reviews: [],
  },
  {
    name: "Fossil Men's Grant Stainless Steel Quartz Chronograph Watch",
    slug: toSlug("Fossil Men's Grant Stainless Steel Quartz Chronograph Watch"),
    category: 'Wrist Watches',
    brand: 'Fossil',
    images: ['/images/p35-1.jpg', '/images/p35-2.jpg'],
    tags: ['new-arrival', 'featured'],
    isPublished: true,
    price: 171.22,
    listPrice: 225,
    avgRating: 3.66,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 35,
    numSales: 48,
    description:
      'Chronograph watch featuring silver- and blue-tone case, blue sunray dial, and silver-tone Roman numeral indices',
    sizes: [],
    colors: ['Blue', 'Black', 'Sliver'],

    reviews: [],
  },
  {
    name: "Fossil Men's Machine Stainless Steel Quartz Watch",
    slug: toSlug("Fossil Men's Machine Stainless Steel Quartz Watch"),
    category: 'Wrist Watches',
    brand: 'Fossil',
    images: ['/images/p36-1.jpg', '/images/p36-2.jpg'],
    tags: ['best-seller', 'todays-deal'],
    isPublished: true,
    price: 158.21,
    listPrice: 229.0,
    avgRating: 3.46,
    numReviews: 13,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 3 },
    ],
    countInStock: 36,
    numSales: 49,
    description:
      'In masculine black-on-black, our industrial-inspired Machine watch will add a fresh, modern touch to your casual look. This Machine watch also features a three hand movement on a stainless steel bracelet.',
    sizes: [],
    colors: ['Brown', 'Sliver', 'Black'],

    reviews: [],
  },
  // Sneakers
  {
    name: 'adidas Mens Grand Court 2.0 Training Shoes Training Shoes',
    slug: toSlug('adidas Mens Grand Court 2.0 Training Shoes Training Shoes'),
    category: 'Shoes',
    brand: 'adidas',
    images: ['/images/p41-1.jpg', '/images/p41-2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 81.99,
    listPrice: 0,
    avgRating: 4.71,
    numReviews: 7,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    countInStock: 41,
    numSales: 48,
    description:
      'Cloudfoam Comfort sockliner is ultra-soft and plush, with two layers of cushioning topped with soft, breathable mesh',
    sizes: ['8', '9', '10'],
    colors: ['White', 'Black', 'Grey'],

    reviews: [],
  },
  {
    name: "ziitop Men's Running Walking Shoes Fashion Sneakers Mesh Dress Shoes Business Oxfords Shoes Lightweight Casual Breathable Work Formal Shoes",
    slug: toSlug(
      "ziitop Men's Running Walking Shoes Fashion Sneakers Mesh Dress Shoes Business Oxfords Shoes Lightweight Casual Breathable Work Formal Shoes"
    ),
    category: 'Shoes',
    brand: 'ziitop',
    images: ['/images/p42-1.jpg', '/images/p42-2.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 39.97,
    listPrice: 49.96,
    avgRating: 4.2,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 42,
    numSales: 50,
    description:
      'Cloudfoam Comfort sockliner is ultra-soft and plush, with two layers of cushioning topped with soft, breathable mesh',
    sizes: ['8', '9', '10'],
    colors: ['Beige', 'Black', 'Grey'],

    reviews: [],
  },
  {
    name: 'Skechers mens Summits High Range Hands Free Slip-in Shoes Work shoe',
    slug: toSlug(
      'Skechers mens Summits High Range Hands Free Slip-in Shoes Work shoe'
    ),
    category: 'Shoes',
    brand: 'Skechers',
    images: ['/images/p43-1.jpg', '/images/p43-2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 99.99,
    listPrice: 0,
    avgRating: 4,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 43,
    numSales: 72,
    description:
      'Step into easy-wearing comfort with Skechers Hands Free Slip-ins™: Summits - High Range. Along with our Exclusive Heel Pillow™ holds your foot securely in place, this vegan style features a unique pop-up Skechers Slip-ins™ molded heel panel, a mesh upper with fixed laces',
    sizes: ['8', '9', '10'],
    colors: ['Navy', 'Black', 'Grey'],

    reviews: [],
  },
  {
    name: 'DLWKIPV Mens Running Shoes Tennis Cross Training Sneakers Fashion Non Slip Outdoor Walking Jogging Shoes Mesh Light Flexible Comfortable Breathable Shoes',
    slug: toSlug(
      'DLWKIPV Mens Running Shoes Tennis Cross Training Sneakers Fashion Non Slip Outdoor Walking Jogging Shoes Mesh Light Flexible Comfortable Breathable Shoes'
    ),
    category: 'Shoes',
    brand: 'DLWKIPV',
    images: ['/images/p44-1.jpg', '/images/p44-2.jpg'],
    tags: ['todays-deal'],
    isPublished: true,
    price: 36.99,
    listPrice: 56.9,
    avgRating: 3.85,
    numReviews: 14,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 44,
    numSales: 72,
    description:
      'Design: Mesh vamp, ventilation. Sole anti-slip groove design, shock absorption and anti-slip. The inside of the shoe is wide and soft, bringing you a good comfortable experience',
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['Brown', 'Black', 'Grey'],

    reviews: [],
  },
  {
    name: "ASICS Men's GT-2000 13 Running Shoes",
    slug: toSlug("ASICS Men's GT-2000 13 Running Shoes"),
    category: 'Shoes',
    brand: 'ASICS',
    images: ['/images/p45-1.jpg', '/images/p45-2.jpg'],
    tags: ['new-arrival', 'featured'],
    isPublished: true,
    price: 179.95,
    listPrice: 200,
    avgRating: 3.66,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    countInStock: 45,
    numSales: 64,
    description:
      "At least 50% of the shoe's main upper material is made with recycled content to reduce waste and carbon emissions",
    sizes: ['8', '9', '10', '11'],
    colors: ['Blue', 'Black', 'Grey'],

    reviews: [],
  },
  {
    name: "Mens Wearbreeze Shoes, Urban - Ultra Comfortable Shoes, Breeze Shoes for Men, Men's Mesh Dress Sneakers Business Shoes",
    slug: toSlug(
      "Mens Wearbreeze Shoes, Urban - Ultra Comfortable Shoes, Breeze Shoes for Men, Men's Mesh Dress Sneakers Business Shoes"
    ),
    category: 'Shoes',
    brand: 'Generic',
    images: ['/images/p46-1.jpg', '/images/p46-2.jpg'],
    tags: ['best-seller', 'todays-deal'],
    isPublished: true,
    price: 32.99,
    listPrice: 80,
    avgRating: 3.46,
    numReviews: 13,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 4 },
      { rating: 5, count: 3 },
    ],
    countInStock: 46,
    numSales: 48,
    description:
      'Cloudfoam Comfort sockliner is ultra-soft and plush, with two layers of cushioning topped with soft, breathable mesh',
      sizes: ['8', '9', '10', '11'],
      colors: ['Green', 'Black', 'Grey'],
      
      reviews: [],
    },
    {
      name: "Mens Wearbreeze Shoes, Urban - Ultra Comfortable Shoes, Breeze Shoes for Men, Men's Mesh Dress Sneakers Business Shoes",
      slug: toSlug(
        "Mens Wearbreeze Shoes, Urban - Ultra Comfortable Shoes, Breeze Shoes for Men, Men's Mesh Dress Sneakers Business Shoes"
      ),
      category: 'Computers',
      brand: 'HUANUO Computers',
      images: ['/1000.jpg', '10000.jpg'],
      tags: ['best-seller', 'todays-deal'],
      isPublished: true,
      price: 32.99,
      listPrice: 80,
      avgRating: 3.46,
      numReviews: 13,
      ratingDistribution: [
        { rating: 1, count: 1 },
        { rating: 2, count: 2 },
        { rating: 3, count: 3 },
        { rating: 4, count: 4 },
        { rating: 5, count: 3 },
      ],
      countInStock: 46,
      numSales: 48,
      description:
        'Cloudfoam Comfort sockliner is ultra-soft and plush, with two layers of cushioning topped with soft, breathable mesh',
      sizes: ['15', '17', '22', '25'],
      colors: ['Green', 'Black', 'Grey'],
    
      reviews: [],
    },
]
// const reviews = [
//   {
//     rating: 1,
//     title: 'Poor quality',
//     comment:
//       'Very disappointed. The item broke after just a few uses. Not worth the money.',
//   },
//   {
//     rating: 2,
//     title: 'Disappointed',
//     comment:
//       "Not as expected. The material feels cheap, and it didn't fit well. Wouldn't buy again.",
//   },



// ]
const reviews = [
  {
    rating: 1,
    title: 'Poor quality',
    comment:
      'Very disappointed. The item broke after just a few uses. Not worth the money.',
  },
  {
    rating: 2,
    title: 'Disappointed',
    comment:
      "Not as expected. The material feels cheap, and it didn't fit well. Wouldn't buy again.",
  },




  {
    rating: 2,
    title: 'Needs improvement',
    comment:
      "It looks nice but doesn't perform as expected. Wouldn't recommend without upgrades.",
  },
  {
    rating: 3,
    title: 'not bad',
    comment:
      'This product is decent, the quality is good but it could use some improvements in the details.',
  },
  {
    rating: 3,
    title: 'Okay, not great',
    comment:
      'It works, but not as well as I hoped. Quality is average and lacks some finishing.',
  },
  {
    rating: 3,
    title: 'Good product',
    comment:
      'This product is amazing, I love it! The quality is top notch, the material is comfortable and breathable.',
  },
  {
    rating: 4,
    title: 'Pretty good',
    comment:
      "Solid product! Great value for the price, but there's room for minor improvements.",
  },
  {
    rating: 4,
    title: 'Very satisfied',
    comment:
      'Good product! High quality and worth the price. Would consider buying again.',
  },
  {
    rating: 4,
    title: 'Absolutely love it!',
    comment:
      'Perfect in every way! The quality, design, and comfort exceeded all my expectations.',
  },
  {
    rating: 4,
    title: 'Exceeded expectations!',
    comment:
      'Fantastic product! High quality, feels durable, and performs well. Highly recommend!',
  },
  {
    rating: 5,
    title: 'Perfect purchase!',
    comment:
      "Couldn't be happier with this product. The quality is excellent, and it works flawlessly!",
  },
  {
    rating: 5,
    title: 'Highly recommend',
    comment:
      "Amazing product! Worth every penny, great design, and feels premium. I'm very satisfied.",
  },
  {
    rating: 5,
    title: 'Just what I needed',
    comment:
      'Exactly as described! Quality exceeded my expectations, and it arrived quickly.',
  },
  {
    rating: 5,
    title: 'Excellent choice!',
    comment:
      'This product is outstanding! Everything about it feels top-notch, from material to functionality.',
  },
  {
    rating: 5,
    title: "Couldn't ask for more!",
    comment:
      "Love this product! It's durable, stylish, and works great. Would buy again without hesitation.",
  },
]

const data: Data = {
  users,
  products,
  reviews,
  webPages: [
    {
      title: 'About Us',
      slug: 'about-us',
      content: `Welcome to [Your Store Name], your trusted destination for quality products and exceptional service. Our journey began with a mission to bring you the best shopping experience by offering a wide range of products at competitive prices, all in one convenient platform.

At [Your Store Name], we prioritize customer satisfaction and innovation. Our team works tirelessly to curate a diverse selection of items, from everyday essentials to exclusive deals, ensuring there's something for everyone. We also strive to make your shopping experience seamless with fast shipping, secure payments, and excellent customer support.

As we continue to grow, our commitment to quality and service remains unwavering. Thank you for choosing [Your Store Name]—we look forward to being a part of your journey and delivering value every step of the way.`,
      isPublished: true,
    },
    {
      title: 'Contact Us',
      slug: 'contact-us',
      content: `We’re here to help! If you have any questions, concerns, or feedback, please don’t hesitate to reach out to us. Our team is ready to assist you and ensure you have the best shopping experience.

**Customer Support**
For inquiries about orders, products, or account-related issues, contact our customer support team:
- **Email:** marklasfar@gmail.com
- **Phone:** +20 1212444617

**Head Office**
For corporate or business-related inquiries, reach out to our headquarters:
- **Address:** 1234 E-Commerce St, Suite 567, Business City, BC 12345
- **Phone:** +20 1212444617

We look forward to assisting you! Your satisfaction is our priority.
`,
      isPublished: true,
    },
    {
      title: 'Help',
      slug: 'help',
      content: `Welcome to our Help Center! We're here to assist you with any questions or concerns you may have while shopping with us. Whether you need help with orders, account management, or product inquiries, this page provides all the information you need to navigate our platform with ease.

**Placing and Managing Orders**
Placing an order is simple and secure. Browse our product categories, add items to your cart, and proceed to checkout. Once your order is placed, you can track its status through your account under the "My Orders" section. If you need to modify or cancel your order, please contact us as soon as possible for assistance.

**Shipping and Returns**
We offer a variety of shipping options to suit your needs, including standard and express delivery. For detailed shipping costs and delivery timelines, visit our Shipping Policy page. If you're not satisfied with your purchase, our hassle-free return process allows you to initiate a return within the specified timeframe. Check our Returns Policy for more details.

**Account and Support**
Managing your account is easy. Log in to update your personal information, payment methods, and saved addresses. If you encounter any issues or need further assistance, our customer support team is available via email, live chat, or phone. Visit our Contact Us page for support hours and contact details.`,
      isPublished: true,
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: `We value your privacy and are committed to protecting your personal information. This Privacy Notice explains how we collect, use, and share your data when you interact with our services. By using our platform, you consent to the practices described herein.

We collect data such as your name, email address, and payment details to provide you with tailored services and improve your experience. This information may also be used for marketing purposes, but only with your consent. Additionally, we may share your data with trusted third-party providers to facilitate transactions or deliver products.

Your data is safeguarded through robust security measures to prevent unauthorized access. However, you have the right to access, correct, or delete your personal information at any time. For inquiries or concerns regarding your privacy, please contact our support team.`,
      isPublished: true,
    },
    {
      title: 'Conditions of Use',
      slug: 'conditions-of-use',
      content: `Welcome to [Ecommerce Website Name]. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of our platform, including browsing, purchasing products, and interacting with any content or services provided. You must be at least 18 years old or have the consent of a parent or guardian to use this website. Any breach of these terms may result in the termination of your access to our platform.

We strive to ensure all product descriptions, pricing, and availability information on our website are accurate. However, errors may occur, and we reserve the right to correct them without prior notice. All purchases are subject to our return and refund policy. By using our site, you acknowledge that your personal information will be processed according to our privacy policy, ensuring your data is handled securely and responsibly. Please review these terms carefully before proceeding with any transactions.
`,
      isPublished: true,
    },
    {
      title: 'Customer Service',
      slug: 'customer-service',
      content: `At [Your Store Name], our customer service team is here to ensure you have the best shopping experience. Whether you need assistance with orders, product details, or returns, we are committed to providing prompt and helpful support.

If you have questions or concerns, please reach out to us through our multiple contact options:
- **Email:** support@example.com
- **Phone:** +1 (123) 456-7890
- **Live Chat:** Available on our website for instant assistance

We also provide helpful resources such as order tracking, product guides, and FAQs to assist you with common inquiries. Your satisfaction is our priority, and we’re here to resolve any issues quickly and efficiently. Thank you for choosing us!`,
      isPublished: true,
    },
    {
      title: 'Returns Policy',
      slug: 'returns-policy',
      content: 'Returns Policy Content',
      isPublished: true,
    },
    {
      title: 'Careers',
      slug: 'careers',
      content: 'careers Content',
      isPublished: true,
    },
    {
      title: 'Blog',
      slug: 'blog',
      content: 'Blog Content',
      isPublished: true,
    },
    {
      title: 'Sell Products',
      slug: 'sell',
      content: `Sell Products Content`,
      isPublished: true,
    },
    {
      title: 'Become Affiliate',
      slug: 'become-affiliate',
      content: 'Become Affiliate Content',
      isPublished: true,
    },
    {
      title: 'Advertise Your Products',
      slug: 'advertise',
      content: 'Advertise Your Products',
      isPublished: true,
    },
    {
      title: 'Shipping Rates & Policies',
      slug: 'shipping',
      content: 'Shipping Rates & Policies',
      isPublished: true,
    },
  ],
  headerMenus: [
    {
      name: "Today's Deal",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrival',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
      href: '/page/help',
    },
  ],
  carousels: [
    {
      title: 'Most Popular Shoes For Sale',
      buttonCaption: 'Shop Now',
      image: '/images/banner3.jpg',
      url: '/search?category=Shoes',
      isPublished: true,
    },
    {
      title: 'Best Sellers in T-Shirts',
      buttonCaption: 'Shop Now',
      image: '/images/banner1.jpg',
      url: '/search?category=T-Shirts',
      isPublished: true,
    },
    {
      title: 'Best Deals on Wrist Watches',
      buttonCaption: 'See More',
      image: '/images/banner2.jpg',
      url: '/search?category=Wrist Watches',
      isPublished: true,
    },
  ],
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
}

export default data
