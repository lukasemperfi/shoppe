import * as yup from 'yup'

export const contactsSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(60, 'First name must be at most 60 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(60, 'Last name must be at most 60 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .trim()
    .email('Email must be valid')
    .required('Email is required'),
  selectedOption: yup
    .string()
    .trim()
    .required('Please select an option'),
  message: yup
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be at most 1000 characters')
    .required('Message is required'),
})

export type ContactsFormValues = yup.InferType<typeof contactsSchema>

