import * as yup from 'yup'

const nameLikeRegex = /^[\p{L}][\p{L}\p{M}\s.'-]*$/u
const cityLikeRegex = /^[\p{L}][\p{L}\p{M}\s.'-]*$/u
const postCodeRegex = /^[A-Za-z0-9][A-Za-z0-9\s-]{1,18}[A-Za-z0-9]$/
const phoneAllowedCharsRegex = /^[0-9+\s().-]+$/

const selectRequired = (message: string) =>
  yup
    .mixed<string | number>()
    .test('required', message, (value) => value !== '' && value !== null && value !== undefined)

export const baseAddressSchema = {
  first_name: yup
    .string()
    .trim()
    .min(2, 'First Name must be at least 2 characters')
    .max(50, 'First Name must be at most 50 characters')
    .matches(nameLikeRegex, 'First Name contains invalid characters')
    .required('First Name is required'),
  last_name: yup
    .string()
    .trim()
    .min(2, 'Last Name must be at least 2 characters')
    .max(50, 'Last Name must be at most 50 characters')
    .matches(nameLikeRegex, 'Last Name contains invalid characters')
    .required('Last Name is required'),
  company_name: yup
    .string()
    .trim()
    .max(80, 'Company Name must be at most 80 characters')
    .default('')
    .optional(),
  country: selectRequired('Country is required'),
  street_address: yup
    .string()
    .trim()
    .min(5, 'Street Address must be at least 5 characters')
    .max(120, 'Street Address must be at most 120 characters')
    .required('Street Address is required'),
  post_code: yup
    .string()
    .trim()
    .min(3, 'Postcode / ZIP must be at least 3 characters')
    .max(20, 'Postcode / ZIP must be at most 20 characters')
    .matches(postCodeRegex, 'Postcode / ZIP has invalid format')
    .required('Postcode / ZIP is required'),
  city: yup
    .string()
    .trim()
    .min(2, 'Town / City must be at least 2 characters')
    .max(60, 'Town / City must be at most 60 characters')
    .matches(cityLikeRegex, 'Town / City contains invalid characters')
    .required('Town / City is required'),
  phone: yup
    .string()
    .trim()
    .matches(phoneAllowedCharsRegex, 'Phone contains invalid characters')
    .test('min-digits', 'Phone must contain at least 10 digits', (value) => {
      const digits = String(value ?? '').replace(/\D/g, '')
      return digits.length >= 10
    })
    .max(25, 'Phone must be at most 25 characters')
    .required('Phone is required'),
  email: yup.string().trim().email('Email must be valid').required('Email is required'),
}

export const checkoutAddressSchema = yup.object({
  ...baseAddressSchema,
  order_notes: yup
    .string()
    .trim()
    .max(500, 'Order Notes must be at most 500 characters')
    .default('')
    .optional(),
})

export const profileAddressSchema = yup.object({
  ...baseAddressSchema,
})
