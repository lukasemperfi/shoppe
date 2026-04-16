import{t as e}from"./client-DmvOI3fs.js";var t=`
  *,
  product_images(*),
  product_colors(*),
  product_categories!inner(
    category_id,
    categories(*)
  )
`,n=`${t}, reviews(*)`,r=new class{getProducts=async(n={})=>{let{searchName:r,minPrice:i,maxPrice:a,categoryId:o,hasDiscount:s,isSoldOut:c,sortBy:l=`newest`,page:u=1,limit:d=10}=n,f=(u-1)*d,p=f+d-1,m=e.from(`products`).select(t,{count:`exact`});r&&(m=m.ilike(`name`,`%${r}%`)),i&&(m=m.gte(`price`,i)),a&&(m=m.lte(`price`,a)),o&&(m=m.eq(`product_categories.category_id`,o)),s===!1?m=m.is(`discount`,null):s===!0&&(m=m.not(`discount`,`is`,null)),typeof c==`boolean`&&(m=m.eq(`is_sold_out`,c)),m=l===`oldest`?m.order(`created_at`,{ascending:!0}):l===`price_low_to_high`?m.order(`price`,{ascending:!0}):l===`price_high_to_low`?m.order(`price`,{ascending:!1}):m.order(`created_at`,{ascending:!1}),m=m.range(f,p);let{data:h,error:g,count:_}=await m;return g?(console.error(`Error fetching products:`,g),null):{items:h,totalCount:_||0,page:u,limit:d}};getProductById=async(t,r=null)=>{let{data:i,error:a}=await e.from(`products`).select(n).eq(`id`,t).order(`created_at`,{referencedTable:`reviews`,ascending:!1}).single();if(a)return console.error(`Error fetching product by id:`,a),null;let o=!1;if(r){let{data:n,error:i}=await e.from(`wishlist`).select(`id`).eq(`user_id`,r).eq(`product_id`,t).maybeSingle();!i&&n&&(o=!0)}return{...i,isInWishlist:o}};getProductsByIds=async n=>{let r=[...new Set(n)].filter(Boolean);if(!r.length)return[];let{data:i,error:a}=await e.from(`products`).select(t).in(`id`,r);return a?(console.error(`Error fetching products by ids:`,a),[]):i??[]};addReview=async t=>{let{data:n,error:r}=await e.from(`reviews`).insert([t]).select().single();if(r)throw console.error(`Error adding review:`,r),r;return n};getProductReviews=async t=>{let{data:n,error:r}=await e.from(`reviews`).select(`*`).eq(`product_id`,t).order(`created_at`,{ascending:!1});return r?(console.error(`Ошибка при загрузке отзывов:`,r.message),[]):n};getWishlistProducts=async t=>{if(!t)throw Error(`User ID is required to get wishlist products`);let{data:n,error:r}=await e.from(`wishlist`).select(`
      product:products (
        *,
        product_images (*),
        product_colors (*),
        product_categories (
          category_id,
          categories (*)
        )
      )
    `).eq(`user_id`,t);if(r)throw console.error(`Error fetching wishlist products:`,r.message),r;return n.map(e=>({...e.product,isInWishlist:!0}))};async addToWishlist(t,n){let{data:r,error:i}=await e.from(`wishlist`).insert([{user_id:t,product_id:n}]).select().single();if(i)throw i;return r}async removeFromWishlist(t,n){let{error:r}=await e.from(`wishlist`).delete().eq(`user_id`,t).eq(`product_id`,n);if(r)throw r;return!0}};export{r as t};