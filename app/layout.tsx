import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TPN Scanner",
  description:
    "A mobile-first proof of concept for extracting ingredient information from TPN labels using OCR and structured AI parsing.",
  applicationName: "TPN Scanner",
  keywords: [
    "TPN",
    "OCR",
    "label scanner",
    "Next.js",
    "React",
    "TypeScript",
    "PaddleOCR",
  ],
  openGraph: {
    title: "TPN Scanner",
    description:
      "Scan TPN labels with a phone camera and extract ingredient information using OCR and structured AI parsing.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TPN Scanner",
    description:
      "Scan TPN labels with a phone camera and extract ingredient information using OCR and structured AI parsing.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-sky-800 text-white">
          <div className="mx-auto max-w-3xl px-4 py-3">
            <h1 className="text-center text-lg font-semibold">TPN Scanner</h1>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
