import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://denameagricultural.com"),
  title: {
    default: "Dename Agricultural Supplier | Ethiopia's Premier Agricultural Supplier",
    template: "%s | Dename Agricultural Supplier",
  },
  description:
    "Dename Agricultural Supplier — Hosaena, Ethiopia. We supply exporters and bulk buyers with premium Ethiopian agricultural products: ginger, coffee, rosemary, turmeric, garlic, cardamom, black pepper, and honey for bulk buyers and exporters.",
  keywords: [
    "Ethiopian agricultural supplier",
    "Ethiopian Agricultural Supplier",
    "Ethiopian coffee supplier",
    "Ethiopian rosemary supplier",
    "Ethiopian turmeric supplier",
    "Ethiopian garlic supplier",
    "Ethiopian cardamom supplier",
    "Ethiopian black pepper supplier",
    "Ethiopian honey supplier",
    "bulk agricultural export Ethiopia",
    "Hadiya Zone agricultural products",
    "Hosaena agricultural supplier",
    "Ethiopian agricultural supplier",
    "Dename Agricultural",
    "agricultural exporter Ethiopia",
    "export quality Ethiopian products",
  ],
  authors: [{ name: "Dename Agricultural Supplier" }],
  creator: "Dename Agricultural Supplier",
  publisher: "Dename Agricultural Supplier",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://denameagricultural.com",
    siteName: "Dename Agricultural Supplier",
    title: "Dename Agricultural Supplier | Ethiopia's Premier Agricultural Supplier",
    description:
      "Dename Agricultural Supplier — Hosaena, Ethiopia. Premium Ethiopian agricultural products for bulk buyers and exporters.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dename Agricultural Supplier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dename Agricultural Supplier | Ethiopia's Premier agricultural supply",
    description: "Premium export-quality Ethiopian agricultural products supplier.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className={`font-[family-name:var(--font-poppins)] antialiased`} suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
