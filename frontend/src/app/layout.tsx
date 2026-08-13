import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@cloudscape-design/global-styles/index.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AWS Route53 Clone",
  description: "A production-quality clone of AWS Route53",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
