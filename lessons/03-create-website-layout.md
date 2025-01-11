# 03-create-website-layout

1. create .env.local

   ```env
    NEXT_PUBLIC_APP_NAME=NxtAmzn
    NEXT_PUBLIC_APP_SLOGAN=Spend less, enjoy more.
    NEXT_PUBLIC_APP_DESCRIPTION=An Amazon clone built with Next.js and MongoDB
   ```

2. lib/constants.ts

   ```ts
   export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NxtAmzn'
   export const APP_SLOGAN =
     process.env.NEXT_PUBLIC_APP_SLOGAN || 'Spend less, enjoy more.'
   export const APP_DESCRIPTION =
     process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
     'An Amazon clone built with Next.js and MongoDB'
   ```

3. create logo.svg and save in /public/icons folder
4. app/globals.css

   ```css
   @layer utilities {
     .header-button {
       @apply cursor-pointer p-1 border border-transparent hover:border-white rounded-[2px];
     }
     .h1-bold {
       @apply font-bold text-2xl lg:text-3xl;
     }
   }
   ```

5. components/shared/header/menu.tsx

   ```tsx
   import { ShoppingCartIcon, UserIcon } from 'lucide-react'
   import Link from 'next/link'

   export default function Menu() {
     return (
       <div className='flex justify-end'>
         <nav className='flex gap-3 w-full'>
           <Link href='/cart' className='header-button'>
             <UserIcon className='h-8 w-8' />
             <span className='font-bold'>Sign in</span>
           </Link>

           <Link href='/cart' className='header-button'>
             <ShoppingCartIcon className='h-8 w-8' />
             <span className='font-bold'>Cart</span>
           </Link>
         </nav>
       </div>
     )
   }
   ```

6. npx shadcn@latest add select input
7. components/shared/header/search.tsx

   ```tsx
   import { SearchIcon } from 'lucide-react'
   import { Input } from '@/components/ui/input'

   import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
   } from '@/components/ui/select'
   import { APP_NAME } from '@/lib/constants'
   const categories = ['men', 'women', 'kids', 'accessories']
   export default async function Search() {
     return (
       <form
         action='/search'
         method='GET'
         className='flex  items-stretch h-10 '
       >
         <Select name='category'>
           <SelectTrigger className='w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r  rounded-r-none rounded-l-md'>
             <SelectValue placeholder='All' />
           </SelectTrigger>
           <SelectContent position='popper'>
             <SelectItem value='all'>All</SelectItem>
             {categories.map((category) => (
               <SelectItem key={category} value={category}>
                 {category}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
         <Input
           className='flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full'
           placeholder={`Search Site ${APP_NAME}`}
           name='q'
           type='search'
         />
         <button
           type='submit'
           className='bg-primary text-primary-foreground text-black rounded-s-none rounded-e-md h-full px-3 py-2 '
         >
           <SearchIcon className='w-6 h-6' />
         </button>
       </form>
     )
   }
   ```

8. lib/data.ts

   ```ts
   const data = {
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
   }

   export default data
   ```

9. components/shared/header/index.tsx

   ```tsx
   import { APP_NAME } from '@/lib/constants'
   import Image from 'next/image'
   import Link from 'next/link'
   import Menu from './menu'
   import { Button } from '@/components/ui/button'
   import { MenuIcon } from 'lucide-react'
   import data from '@/lib/data'
   import Search from './search'

   export default function Header() {
     return (
       <header className='bg-black  text-white'>
         <div className='px-2'>
           <div className='flex items-center justify-between'>
             <div className='flex items-center'>
               <Link
                 href='/'
                 className='flex items-center header-button font-extrabold text-2xl m-1 '
               >
                 <Image
                   src='/icons/logo.svg'
                   width={40}
                   height={40}
                   alt={`${APP_NAME} logo`}
                 />
                 {APP_NAME}
               </Link>
             </div>
             <div className='hidden md:block flex-1 max-w-xl'>
               <Search />
             </div>
             <Menu />
           </div>
           <div className='md:hidden block py-2'>
             <Search />
           </div>
         </div>
         <div className='flex items-center px-3 mb-[1px]  bg-gray-800'>
           <Button
             variant='ghost'
             className='header-button flex items-center gap-1 text-base [&_svg]:size-6'
           >
             <MenuIcon />
             All
           </Button>
           <div className='flex items-center flex-wrap gap-3 overflow-hidden   max-h-[42px]'>
             {data.headerMenus.map((menu) => (
               <Link
                 href={menu.href}
                 key={menu.href}
                 className='header-button !p-2'
               >
                 {menu.name}
               </Link>
             ))}
           </div>
         </div>
       </header>
     )
   }
   ```

10. components/shared/footer.tsx

    ```tsx
    'use client'

    import { ChevronUp } from 'lucide-react'
    import { Button } from '../ui/button'
    import Link from 'next/link'
    import { APP_NAME } from '@/lib/constants'

    export default function Footer() {
      return (
        <footer className='bg-black  text-white underline-link'>
          <div className='w-full'>
            <Button
              variant='ghost'
              className='bg-gray-800 w-full  rounded-none '
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ChevronUp className='mr-2 h-4 w-4' />
              Back to top
            </Button>
          </div>
          <div className='p-4'>
            <div className='flex justify-center  gap-3 text-sm'>
              <Link href='/page/conditions-of-use'>Conditions of Use</Link>
              <Link href='/page/privacy-policy'> Privacy Notice</Link>
              <Link href='/page/help'>Help</Link>
            </div>
            <div className='flex justify-center text-sm'>
              <p> © 2000-2024, {APP_NAME}, Inc. or its affiliates</p>
            </div>
            <div className='mt-8 flex justify-center text-sm text-gray-400'>
              123, Main Street, Anytown, CA, Zip 12345 | +1 (123) 456-7890
            </div>
          </div>
        </footer>
      )
    }
    ```

11. app/(home)/layout.tsx

    ```tsx
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

12. app/(home)/page.tsx

    ```tsx
    export default async function Page() {
      return (
        <div>
          <h1 className='h1-bold text-center p-10'>Home Page Content</h1>
        </div>
      )
    }
    ```

13. app/layout.tsx

    ```tsx
    import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from '@/lib/constants'
    export const metadata: Metadata = {
      title: {
        template: `%s | ${APP_NAME}`,
        default: `${APP_NAME}. ${APP_SLOGAN}`,
      },
      description: APP_DESCRIPTION,
    }
    ```

14. copy .env.local content and paste in Vercel Environment
15. commit changes and push to GitHub
16. go to https://nextjs-amazona.vercel.app
