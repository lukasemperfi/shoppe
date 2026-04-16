import * as yup from 'yup'

export const addCommentSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters')
    .required('Name is required'),
  email: yup.string().trim().email('Email must be valid').required('Email is required'),
  website: yup
    .string()
    .trim()
    .url('Website must be a valid URL')
    .max(200, 'Website must be at most 200 characters')
    .default('')
    .optional(),
  remember: yup.boolean().default(false).optional(),
  comment: yup
    .string()
    .trim()
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must be at most 1000 characters')
    .required('Comment is required'),
})

export type AddCommentFormValues = yup.InferType<typeof addCommentSchema>
