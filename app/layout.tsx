import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "LinkBox - 스마트 북마크 관리",
  description: "좋아하는 웹사이트를 쉽게 저장하고 관리하세요. 카테고리별 정리, 태그, 검색 기능으로 북마크를 효율적으로 관리할 수 있습니다.",
  keywords: ["북마크", "북마크 관리", "링크 저장", "웹사이트 관리", "bookmark manager", "linkbox"],
  authors: [{ name: "LinkBox" }],
  verification: {
    google: "9y39AkpsySCrQRaxRmv2EvTBv7OJJi6KvaZDUOSygck",
  },
  openGraph: {
    title: "LinkBox - 스마트 북마크 관리",
    description: "좋아하는 웹사이트를 쉽게 저장하고 관리하세요",
    url: "https://linkbox-puce.vercel.app",
    siteName: "LinkBox",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkBox - 스마트 북마크 관리",
    description: "좋아하는 웹사이트를 쉽게 저장하고 관리하세요",
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  metadataBase: new URL('https://linkbox-puce.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
