import { z } from 'zod';

const isValidDateTime = (value: string) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters')
});

export const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: 'Token is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Invalid email'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    password_confirmation: z.string()
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'Passwords don\'t match',
    path: ['password_confirmation']
  });

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Invalid email'),
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters' }),
    phone: z.string().min(3, { message: 'Invalid phone number' }),
    role: z.string(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    profile_image: z
      .instanceof(File)
      .optional()
      .refine(
        file =>
          !file ||
          (file.size <= 5 * 1024 * 1024 &&
            ['image/jpeg', 'image/png'].includes(file.type)),
        {
          message: 'Profile image must be a JPEG or PNG file under 5MB'
        }
      ),
    password_confirmation: z.string()
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'Passwords don\'t match',
    path: ['password_confirmation']
  });

export const userSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' }),
  phone: z.string().min(3, { message: 'Invalid phone number' }),
  role: z.string()
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email')
});

export const verifyEmailSchema = z.object({
  token: z.string()
});

export const oauthSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  redirect: z.string().url('Invalid redirect URL'),
  vendor_id: z.string(),
  vendor_name: z.string().min(1, 'Vendor name is required'),
  client_app: z.string().min(1, 'Client app is required')
});

export const blockedIpSchema = z.object({
  ip_address: z.string().ip('Invalid IP address'),
  reason: z.string().min(1, 'Reason is required'),
  blocked_until: z.string().refine(isValidDateTime, {
    message: 'Invalid date-time format. Expected format: YYYY-MM-DDTHH:mm:ss'
  })
});

export const showSecretSchema = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters')
});

export const disable2faSchema = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters')
});

export const verify2faSchema = z.object({
  one_time_password: z.string().min(6, {
    message: 'Your one-time password must be at least 6 characters.',
  }),
  user_id: z.string(),
  is_setup: z.boolean().optional(),
});


export const changePasswordSchema = z.object({
  current_password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  password_confirmation: z.string()
})
  .refine(data => data.password === data.password_confirmation, {
    message: 'Passwords don\'t match',
    path: ['password_confirmation']
  });

export const bankAccountSchema = z.object({
    account_number: z.string().min(1, 'Account number is required'),
    account_type: z.string().min(1, 'Account type is required'),
    balance: z.string().min(1, 'Balance is required'),
    is_primary: z.boolean().default(false),
    bank_id: z.string().min(1, 'Bank is required'),
    currency_id: z.string().min(1, 'Currency is required'),
})

export const depositSchema = z.object({
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    payment_method_id: z.string().min(1, 'Payment method is required'),
    bank_account_id: z.string().min(1, 'Bank account is required'),
    description: z.string().optional()
})

export const withdrawSchema = z.object({
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    payment_method_id: z.string().min(1, 'Payment method is required'),
    bank_account_id: z.string().min(1, 'Bank account is required'),
    reference_code: z.string().optional(),
    description: z.string().optional()
})

export const verifyDepositSchema = z.object({
    reference: z.string().min(1, 'Reference is required')
})