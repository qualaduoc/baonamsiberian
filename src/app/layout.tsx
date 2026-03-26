import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { getSeoSettings } from '@/services/seoService';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    title: { default: seo.site_title, template: `%s | Bảo Nam` },
    description: seo.site_description,
    keywords: seo.site_keywords,
    robots: seo.robots,
    openGraph: {
      title: seo.site_title,
      description: seo.site_description,
      type: seo.og_type as any,
      siteName: "Bảo Nam Siberian",
      locale: "vi_VN",
      images: seo.og_image ? [{ url: seo.og_image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.site_title,
      description: seo.site_description,
      creator: seo.twitter_handle || undefined,
    },
    verification: seo.google_verification ? { google: seo.google_verification } : undefined,
    alternates: seo.canonical_base ? { canonical: seo.canonical_base } : undefined,
    icons: seo.favicon_url ? { icon: seo.favicon_url } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
