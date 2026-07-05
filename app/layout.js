import { Figtree, Inter } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const __jsonld = {"@context":"https://schema.org","@type":"Organization","name":"SanzyHub","description":"Marketplace template website premium","url":"https://sanzyhub.pintuweb.com"};

export const metadata = {
  metadataBase: new URL("https://sanzyhub.pintuweb.com"),
  title: "SanzyHub — Template Website Premium Siap Pakai",
  description: "SanzyHub: marketplace template website premium untuk bisnis, portofolio, dan toko online — siap pakai dan mudah dikustomisasi.",
  applicationName: "SanzyHub",
  keywords: ["template website", "jual template", "website premium", "template bisnis", "web template"],
  authors: [{ name: "SanzyHub" }],
  creator: "SanzyHub",
  publisher: "SanzyHub",
  alternates: { canonical: "https://sanzyhub.pintuweb.com" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sanzyhub.pintuweb.com",
    siteName: "SanzyHub",
    title: "SanzyHub — Template Website Premium Siap Pakai",
    description: "SanzyHub: marketplace template website premium untuk bisnis, portofolio, dan toko online — siap pakai dan mudah dikustomisasi.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "SanzyHub — Template Website Premium Siap Pakai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SanzyHub — Template Website Premium Siap Pakai",
    description: "SanzyHub: marketplace template website premium untuk bisnis, portofolio, dan toko online — siap pakai dan mudah dikustomisasi.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${figtree.variable} ${inter.variable} antialiased`}>
        <main>{children}</main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        </body>
    </html>
  );
}
