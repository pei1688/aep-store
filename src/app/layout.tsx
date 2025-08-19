import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "sonner";

import Footer from "@/components/layout/footer";
import ReactQueryProvider from "@/providers/react-query-provider";

export const metadata: Metadata = {
  title: "茄蘋帝國",
  description: "代購，電商，海外代購",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="flex min-h-screen flex-col antialiased">
        <ReactQueryProvider>
          <Toaster position="bottom-right" richColors />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
