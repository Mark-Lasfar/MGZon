# 00. Promo Video Script (Improved for Narration)

## Intro

Hello, everyone!  
In this video, we’re going to build a fully-functional e-commerce website, just like Amazon, complete with an admin dashboard. We’ll use Next.js, MongoDB, and free AI tools to make it happen.

---

## Home Page

Let’s start with the home page.

At the **header**, we have:

- A brand logo and name.
- A search box with a category filter.
- A language and currency switcher. If you switch to Arabic, the layout changes to right-to-left. Let’s switch back to English. You can add new languages and currencies from the admin dashboard.
- Next, there’s a theme switcher where you can toggle between light and dark mode or change the theme color to gold, green, or red. Admins can add new colors too.
- Then we have the account menu, where users can sign in or create an account.
- And finally, the shopping cart icon.

Below the header, there’s a **navigation menu**. The first item, **"All"**, opens a sidebar where you can browse by department, access your account, or visit the customer service page.

Now, moving down, there’s a **beautiful slider** that changes every 5 seconds.

Scrolling further, we see sections for categories, new arrivals, best sellers, and featured products.

The next section displays **Today’s Deals**, which you can scroll through horizontally.

Further down, we see the **Best Selling Products**. If you hover over a product card for a second, the image changes.

At the bottom of the page, there are personalized sections like **“Related to items you’ve viewed”** and **“Your browsing history,”** similar to what you see on Amazon.

At the very end, there’s the **website footer**, which includes useful links, the site logo, and copyright information.

---

## Search Page

Let’s search for a product by typing **“men”** and hitting Enter.

Here’s the search results page. These products come directly from the MongoDB database.  
At the bottom, we have **pagination buttons** to navigate between pages.

We can filter items by **category**, **price range**, **rating**, or **tags**.  
Additionally, we can sort the results by **price**, **newest arrivals**, **customer reviews**, or **best-selling**.

---

## Product Page

When you click on a product, the details page opens.

At the top, we have the **product images**, where you can select any image to preview.

On the right, there’s the **product title**, **rating**, and **options** to choose color and size. Clicking on the rating shows the distribution of reviews.

Scrolling down, customer reviews load automatically. On the left, you see the average rating and its breakdown, while the latest reviews are on the right. You can read reviews or write your own if you’ve purchased the product. Reviews are paginated, so you can load more if needed.

At the bottom, there’s a section for **best-selling products in this category** and your **browsing history**.

Let’s scroll up, select the quantity, and click **Add to Cart**. If you want to buy just this product, select **“Buy Now”** to go directly to the checkout page.

---

## Add to Cart Page

After adding an item, you’ll be redirected to the **add-to-cart page**.

Here, the added item appears, and the shopping cart icon in the header updates with the number of items.

---

## Cart Page

Let’s add another item to the cart and then go to the **cart page**.

Here, you can update the quantity or remove items. If your subtotal doesn’t meet the free shipping threshold, a notification will appear.

---

## Checkout Page

Clicking **“Proceed to Checkout”** takes us to the **sign-in page**, unless the user is already logged in.

You can log in using your email and password or sign in with Google. Let’s create a new account.

After entering your information, you’ll be redirected to the checkout page.

The checkout process has three steps:

1. Add your **address** and select "Ship to this address."
2. Choose a **payment method**, such as PayPal, Stripe, or Cash on Delivery. Let’s go with PayPal.
3. Review your order, adjust quantities if needed, and select a shipping speed. Finally, place the order.

---

## Checkout Payment Page

Once the order is placed, you’ll be redirected to PayPal to complete your payment. After confirming, you’ll return to the website to see the order details and receive a receipt via email.

---

## Order Details Page

On the **order details page**, you can check the order status and see the items purchased.

To access this page, click on the account menu, select **Your Orders**, and choose the order you want to view.

From the account menu, you can also update your profile. For example, under **Login & Security**, you can edit your name and save changes. The updated name will reflect across the site.

---

### Mobile Friendly

This e-commerce website is fully responsive and mobile-friendly. Let’s switch to the mobile view and create a new order. As you can see, all pages and elements are accessible and functional on mobile devices.

### Admin Dashboard

Let’s log out as a customer and log in as an admin. Then, select "Admin" from the header menu to open the admin dashboard.  
On this page, we have stat boxes displaying total revenue, sales, customers, and products. You can adjust the report range to, for example, two months ago. The sales overview chart will update to reflect the new date range.

Scroll down to view the "Earnings Report" for the last six months. On the left card, we have the "Product Performance Report," which shows the top-selling products within the selected date range.  
At the bottom of the page, you’ll find the "Best-Selling Categories" as a pie chart and a list of recent sales.

### Manage Products

Let’s navigate to the "Products" section in the admin panel. Here, we have a list of all products to manage. Let’s filter the products by the keyword “running” and edit one of them.  
You can update the product information, upload images, or archive the product.

### Manage Orders

Next, let’s go to the "Orders" section. Here, we have a list of all orders to manage. Let’s check the details of one order and mark it as delivered.

### Manage Users

Now, let’s move to the "Users" section. On this page, you can manage users. For example, let’s edit a user and change their role to admin.

### Manage Pages

This e-commerce website includes a small CMS where you can add new pages and content in Markdown format. In the "Pages" section, you’ll see a list of all pages. Let’s edit one, add some content in Markdown, and save it.

### Manage Carousels

On this page, you can add, remove, or update carousel images displayed on the homepage.

### Settings Page

The final admin section is the "Settings" page. Here, you can fill in your site information, including the brand name, logo, slogan, and other details about your e-commerce website.

The next section is "Common Settings," where you can set the number of items per page, as well as the default theme and color.

After that, you’ll find "Currencies and Languages," where you can add multiple languages and currencies, and set the default ones.

Next is "Payment Methods," where you can define the acceptable payment options and set the default method.

Finally, there’s the "Delivery Dates" section. Here, you can add delivery dates based on your courier options and set a default date.

---

## Tech Stack

This project uses:

| Feature          | Technology                       |
| ---------------- | -------------------------------- |
| **Language**     | TypeScript                       |
| **Frameworks**   | Next.js 15, Tailwind, Shadcn     |
| **Database**     | MongoDB, Mongoose                |
| **Payment**      | PayPal, Stripe, COD              |
| **Deployment**   | Vercel, GitHub, VPS              |
| **Auth**         | Auth.js, Google Auth, Magic Link |
| **Email**        | Resend                           |
| **Validation**   | Zod, React Hook Form             |
| **File Upload**  | Uploadthing                      |
| **Multilingual** | next-intl                        |

---

## About Me

I’m Basir, a senior web developer with experience working for international companies and teaching over 50,000 students worldwide. I’ll guide you through building this project step by step.

---

## What You’ll Learn

By the end of this course, you’ll know how to:

- Build a modern e-commerce site with Next.js 15 and server actions.
- Design professional UI components with Tailwind and Shadcn.
- Work with MongoDB and Mongoose for database management.
- Validate forms with Zod and React Hook Form.
- Manage state with Zustand and implement authentication using Next-Auth.
- Create customer and admin dashboards.
- Integrate PayPal and Stripe for online payments.

This course is perfect for developers and entrepreneurs looking to enhance their skills or launch their own e-commerce platforms. Basic React and Next.js knowledge is all you need.

---

Let’s get started and create our Next.js app in the next lesson!
