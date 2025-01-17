'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LanguageProvider } from './context/LanguageContext';



export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,    // 5 minutes
        onError: (error) => {
          toast.error(error.message);
        },
      },
    },
  }));

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-center" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </LanguageProvider>
  );
}