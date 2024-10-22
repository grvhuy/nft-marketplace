import localFont from "next/font/local";
import "./globals.css";
import { NFTMarketplaceProvider } from "../../Context/NFTMarketplaceContext";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { Work_Sans } from "next/font/google";

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

const font = Work_Sans({ subsets: ["latin"] })

export const metadata = {
  title: "NFT Marketplace",
  description: "Discover, buy, and sell NFTs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body
          className={`${font.className} ${geistMono.variable} antialiased bg-[#2b2b2b]`}
          >
          <NFTMarketplaceProvider>
            <Header />
            {children}
            <Footer />
          </NFTMarketplaceProvider> 
        </body>
      </html>
  );
}
