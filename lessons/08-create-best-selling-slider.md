# 08-create-best-selling-slider

1. app/(home)/page.tsx

   ```tsx
   const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })
   return (
     <Card className='w-full rounded-none'>
       <CardContent className='p-4 items-center gap-3'>
         <ProductSlider
           title='Best Selling Products'
           products={bestSellingProducts}
           hideDetails
         />
       </CardContent>
     </Card>
   )
   ```

2. commit changes and push to GitHub
3. go to https://nextjs-amazona.vercel.app
