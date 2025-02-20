# Build Full-ECommerce Website By Next.js 15 & MongoDB

|                |                                  |
| -------------- | -------------------------------- |
| Frmework       | Next.js 15, React 19             |
| UI             | Tailwind, Shadcn, Recharts       |
| Database       | MongoDB, Mongoose                |
| Payment        | PayPal, Stripe                   |
| Deployment     | Github, Vercel                   |
| Authentication | Auth.js, Google Auth, Magic Link |
| Others         | uploadthing, resend, zod, etc    |

[![Next.js MongoDB Amazona](/public/images/app.png)](https://mg-zon.vercel.app/)


## View Demo Website

https://mg-zon.vercel.app/

## What you will learn

- creating e-commerce website pages by next.js server components
- designing header, footer, sidebar, menu and search box by shadcn and tailwind
- quick view products in modals using nextjs parallel routes with intercepting routes
- create database models by Mongoose and MongoDB database
- handling form inputs by react-hook-forms and zod data validator
- updating data by server actions without using any api
- managing shopping cart using http cookies on server side
- handling authentication and authorization by next-auth
- creating customer dashboard to update profile and track orders
- and implement a fully-functional admin dashboard with beautiful charts and handling products, orders and users

## Run Locally

1. Clone repo

   ```shell
    $ git clone https://github.com/Mark-Lasfar/MGZon.git
    $ cd MGZon
   ```

2. Create Env File

   - duplicate .example-env and rename it to .env.local

3. Setup MongoDB

   - Cloud MongoDB
     - Create database at https://mongodb.com/
     - In .env.local file update MONGODB_URI to db url
   - OR Local MongoDB
     - Install it from https://www.MongoDB.org/download
     - In .env.local file update MONGODB_URI to db url

4. Seed Data

   ```shell
     npm run seed
   ```

5. Install and Run

   ```shell
     npm install --legacy-peer-deps
     npm run dev
   ```


## Contact Developer

Email: marklasfar@gmail.com
