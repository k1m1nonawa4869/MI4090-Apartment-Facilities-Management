import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientSidebar } from "@/components/layout/ClientSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Apartment Manager",
  description: "Premium facility management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen overflow-hidden bg-background`}
      >
        <ClientSidebar />
        <main className="flex-1 overflow-y-auto bg-background/50 p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-500">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
