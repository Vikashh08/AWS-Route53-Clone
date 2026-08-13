import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@cloudscape-design/global-styles/index.css";
import Providers from "./providers";
import AppTopNavigation from "../components/TopNavigation";
import Navigation from "../components/Navigation";
import AppLayoutClient from "../components/AppLayoutClient";

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
          <AppTopNavigation />
          <AppLayoutClient>
            {children}
          </AppLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
