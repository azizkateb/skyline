import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { LenisSmoothScroll } from "@/components/lenis-smooth-scroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./globals.css";

if (typeof window !== "undefined") {
  ScrollTrigger.config({ ignoreMobileResize: false });
}

const ethero = localFont({
  src: "./fonts/ethero.regular.otf",
  variable: "--font-ethero",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skyline — Modern Trading Platform",
  description:
    "A modern foundation for ambitious products. Real-time data, risk analytics, and low-latency trading tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ethero.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="scroll-reset" strategy="beforeInteractive">
          {`try {
            if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          } catch (e) {}`}
        </Script>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-nav focus:text-gray-900 focus:shadow-lg focus:outline-none"
        >
          Skip to content
        </a>
        <LenisSmoothScroll>
          <Navbar />
          {children}
        </LenisSmoothScroll>
      </body>
    </html>
  );
}
