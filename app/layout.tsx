'use client';

import { Inter } from 'next/font/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Flip, ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="darktrading" className="h-full">
      <body className={`${inter.className} h-full bg-base-100 text-base-content flex flex-col`}>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <ToastContainer
            draggable={true}
            hideProgressBar
            newestOnTop={true}
            pauseOnHover
            position="top-center"
            rtl={false}
            theme="light"
            transition={Flip}
          />
          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>

          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}