import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'

export default function RQProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({})
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
