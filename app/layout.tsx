import type { Metadata, Viewport } from "next";
import { Playfair_Display, Caveat, Lato } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});

const script = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-script",
  display: "swap"
});

const body = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Knoted Co. | Handmade Hair Accessories",
    template: "%s | Knoted Co."
  },
  description:
    "Handmade scrunchies, bows, and hair accessories by Knoted Co. — made with lots of love, one small batch at a time.",
  applicationName: "Knoted Co.",
  authors: [{ name: "Knoted Co." }],
  creator: "Knoted Co.",
  publisher: "Knoted Co.",
  keywords: [
    "handmade hair accessories",
    "scrunchies",
    "hair bows",
    "pigtail bow",
    "embroidered hair clip",
    "Knoted Co."
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Knoted Co.",
    title: "Knoted Co. | Handmade Hair Accessories",
    description: "Handmade scrunchies, bows, and hair accessories — made with lots of love."
  },
  twitter: {
    card: "summary_large_image",
    title: "Knoted Co. | Handmade Hair Accessories",
    description: "Handmade scrunchies, bows, and hair accessories — made with lots of love."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7C8A5C"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <html lang="en" className={`${heading.variable} ${script.variable} ${body.variable}`}>
      <head>
        {supabaseUrl && (
          <>
            <link rel="preconnect" href={supabaseUrl} />
            <link rel="dns-prefetch" href={supabaseUrl} />
          </>
        )}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only z-[200] rounded-full bg-brand-red px-4 py-2 font-black text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
