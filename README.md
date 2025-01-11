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

[![Next.js MongoDB Amazona](/public/images/app.png)](https://next-mongo-ecommerce-final.vercel.app/)

## Watch Video Tutorial

[![Next.js MongoDB Amazona](https://i9.ytimg.com/vi/WLHCPwqHzzQ/mqdefault.jpg?v=676eca94&sqp=CIzAv7sG&rs=AOn4CLDrL8ebdZ8YJyJp96oMMKBTyAD1Dw)](https://youtu.be/WLHCPwqHzzQ)

## View Demo Website

https://next-mongo-ecommerce-final.vercel.app/

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
    $ git clone git@github.com:basir/nextjs-amazona.git
    $ cd nextjs-amazona
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

6. Admin Login

   - Open http://localhost:3000
   - Click Sign In button
   - Enter admin email "admin@example.com" and password "123456" and click Sign In

## Lessons

- [00-introduction](./lessons/00-introduction.md)
- [01-install-ai-tools-and-vscode-extensions](./lessons/01-install-ai-tools-and-vscode-extensions.md)
- [02-create-next-app](./lessons/02-create-next-app.md)
- [03-create-website-layout](./lessons/03-create-website-layout.md)
- [04-create-home-page-carousel](./lessons/04-create-home-page-carousel.md)
- [05-connect-to-mongodb-and-seed-products](./lessons/05-connect-to-mongodb-and-seed-products.md)
- [06-create-home-cards](./lessons/06-create-home-cards.md)
- [07-create-todays-deals-slider](./lessons/07-create-todays-deals-slider.md)
- [08-create-best-selling-slider](./lessons/08-create-best-selling-slider.md)
- [09-create-product-details-page](./lessons/09-create-product-details-page.md)
- [10-create-browsing-history](./lessons/10-create-browsing-history.md)
- [11-implement-add-to-cart](./lessons/11-implement-add-to-cart.md)
- [12-create-cart-page](./lessons/12-create-cart-page.md)
- [13-create-cart-sidebar](./lessons/13-create-cart-sidebar.md)
- [14-signin-user](./lessons/14-signin-user.md)
- [15-register-user](./lessons/15-register-user.md)
- [16-signin-with-google](./lessons/16-signin-with-google.md)
- [17-create-checkout-page](./lessons/17-create-checkout-page.md)
- [18-place-order](./lessons/18-place-order.md)
- [19-pay-order-by-paypal](./lessons/19-pay-order-by-paypal.md)
- [20-pay-order-by-stripe](./lessons/20-pay-order-by-stripe.md)
- [21-rate-review-products](./lessons/21-rate-review-products.md)
- [22-create-order-history-page](./lessons/22-create-order-history-page.md)
- [23-update-user-name](./lessons/23-update-user-name.md)
- [24-create-category-sidebar](./lessons/24-create-category-sidebar.md)
- [25-create-search-page](./lessons/25-create-search-page.md)
- [26-add-theme-color](./lessons/26-add-theme-color.md)
- [27-create-admin-dashboard](./lessons/27-create-admin-dashboard.md)
- [28-admin-products](./lessons/28-admin-products.md)
- [29-create-update-products](./lessons/29-create-update-products.md)
- [30-admin-orders](./lessons/30-admin-orders.md)
- [31-mark-orders-as-paid-delivered](./lessons/31-mark-orders-as-paid-delivered.md)
- [32-admin-users](./lessons/32-admin-users.md)
- [33-edit-user](./lessons/33-edit-user.md)
- [34-admin-web-pages](./lessons/34-admin-web-pages.md)
- [35-create-update-web-pages](./lessons/35-create-update-web-pages.md)
- [36-create-settings-page](./lessons/36-create-settings-page.md)
- [37-make-website-multilingual](./lessons/37-make-website-multilingual.md)

## Contact Developer

Email: basir.jafarzadeh@gmail.com
