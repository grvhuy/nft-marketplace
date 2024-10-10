import localFont from "next/font/local";
import "./globals.css";
import { NFTMarketplaceProvider } from "../../Context/NFTMarketplaceContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "NFT Marketplace",
  description: "Discover, buy, and sell NFTs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
          <NFTMarketplaceProvider>
            {children}
          </NFTMarketplaceProvider> 
        </body>
      </html>
  );
}
