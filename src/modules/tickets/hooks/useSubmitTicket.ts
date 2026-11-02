'use client';

import { useMutation } from '@tanstack/react-query';
import { submitTicket } from '../services/tickets.client';

export const useSubmitTicket = () => useMutation({ mutationFn: submitTicket });
