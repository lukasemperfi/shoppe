export const PRODUCT_BASE_SELECT = `
  *,
  product_images(*),
  product_colors(*),
  product_categories!inner(
    category_id,
    categories(*)
  )
`

export const PRODUCT_DETAILS_SELECT = `${PRODUCT_BASE_SELECT}, reviews(*)`
