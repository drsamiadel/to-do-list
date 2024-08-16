import type { Metadata } from "next";
import "./globals.css";
import { sansFont } from "@/config/fonts";
import getServerUser from '@/lib/auth/getServerUser';
import siteConfig from '@/config/siteConfig';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: { default: siteConfig.title, template: `%s | ${siteConfig.title}` },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerUser();
  return (
    <html lang="en">
      <body className={`${sansFont.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
