import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.scss";
import '@mantine/core/styles.css';
import { Session } from "next-auth";
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import Providers from "./Providers";
import SessionWatcher from "@devmate/components/SessionWatcher/SessionWatcher";
import PageLayout from "./PageLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const raleway = Raleway({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-raleway',
});


export const metadata: Metadata = {
  title: "DevMate",
  description: "AI-Assisted Collaborative Code Space",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ session: Session | null }>;
}>) {
  const resolvedParams = await params;
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} antialiased`}
      >
        <Providers session={resolvedParams?.session || null}>
          <SessionWatcher />
          <PageLayout>{children}</PageLayout>
        </Providers>
      </body>
    </html>
  );
}
