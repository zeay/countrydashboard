"use client";

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode, useState } from 'react';
import './globals.css'; // Include your global CSS styles or any CSS file you are using

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          {/* Include meta tags, favicons, etc. here */}
        </head>
        <body>
          {/* Render children with styles */}
          {children}
        </body>
      </html>
    </QueryClientProvider>
  );
}
