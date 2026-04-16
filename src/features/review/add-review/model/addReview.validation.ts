import * as yup from 'yup'

export const addReviewSchema = yup.object({
  comment: yup
    .string()
    .trim()
    .min(3, 'Review must be at least 3 characters')
    .max(2000, 'Review must be at most 2000 characters')
    .required('Review is required'),
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters')
    .required('Name is required'),
  email: yup.string().trim().email('Email must be valid').required('Email is required'),
  remember: yup.boolean().default(false).optional(),
  rating: yup
    .number()
    .integer('Rating must be a whole number')
    .min(1, 'Please select a rating')
    .max(5, 'Rating must be at most 5')
    .required('Please select a rating'),
})

export type AddReviewFormValues = yup.InferType<typeof addReviewSchema>
