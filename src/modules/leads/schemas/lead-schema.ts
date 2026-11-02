import { z } from 'zod';

// Shared by the form (UX) and the route handler (the real check).
export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100),
  email: z.string().trim().email('Enter a valid email').max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().min(5, 'Tell us a little more').max(2000),
});

export type BookingValues = z.infer<typeof bookingSchema>;
