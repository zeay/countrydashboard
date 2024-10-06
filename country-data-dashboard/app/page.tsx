// app/page.tsx

"use client"; // Add this line at the top

import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import CountryList from './CountryList'; // Assuming your list component is here

const queryClient = new QueryClient();

export default function HomePage() {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <CountryList />
    </QueryClientProvider>
  );
}
