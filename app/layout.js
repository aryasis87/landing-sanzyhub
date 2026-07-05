import { Figtree, Inter } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata = {
  title: "SanzyHub — Template Website Premium Siap Pakai",
  description: "SanzyHub: marketplace template website premium untuk bisnis, portofolio, dan toko online — siap pakai dan mudah dikustom.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${figtree.variable} ${inter.variable} antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
