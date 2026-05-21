import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AWSConsole",
  description: "Custom AWS Management Console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen flex`}>
        <Sidebar />
        <main className="flex-1 overflow-x-hidden min-h-screen pl-64">
          {children}
        </main>
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}
