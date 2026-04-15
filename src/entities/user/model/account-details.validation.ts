import * as yup from 'yup'

const nameLikeRegex = /^[\p{L}][\p{L}\p{M}\s.'-]*$/u

export const accountDetailsSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .matches(nameLikeRegex, 'First name contains invalid characters')
    .required('First name is required'),
  last_name: yup
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .matches(nameLikeRegex, 'Last name contains invalid characters')
    .required('Last name is required'),
  display_name: yup
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(60, 'Display name must be at most 60 characters')
    .required('Display name is required'),
  email: yup.string().trim().email('Email must be valid').required('Email is required'),
  current_password: yup.string().trim().default('').optional(),
  new_password: yup
    .string()
    .trim()
    .test('min-if-present', 'New password must be at least 6 characters', (value) => {
      const v = String(value ?? '').trim()
      if (!v) return true
      return v.length >= 6
    })
    .default('')
    .optional(),
  confirm_new_password: yup
    .string()
    .trim()
    .test('match-if-present', 'Passwords must match', function (value) {
      const next = String(this.parent?.new_password ?? '').trim()
      const confirm = String(value ?? '').trim()
      if (!next && !confirm) return true
      return confirm === next
    })
    .default('')
    .optional(),
})

export const accountDetailsSchemaWithRules = accountDetailsSchema.test(
  'current-required-when-changing',
  'Current password is required to change your password',
  function (values) {
    const current = String(values?.current_password ?? '').trim()
    const next = String(values?.new_password ?? '').trim()
    if (!next) return true
    return current.length > 0
  },
)

