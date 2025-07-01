import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Image from "next/image";
import logo from "@/public/logo.png";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Kumpool Clone",
  description: "A clone of Kumpool, a platform for sharing and discovering pools.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <div className="sm:hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen max-w-screen">
              <nav className="w-full fixed h-[7vh] bg-[#1eb0e6] flex flex-col items-center justify-center">
                <div className="w-full max-w-5xl flex justify-center items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center justify-center font-semibold">
                    <Image src={logo} alt="Logo" width={55} height={55}/>
                  </div>
                </div>
              </nav>
              <div className="pt-[7vh] h-[100vh]">
                {children}
              </div>
            </main>
          </ThemeProvider>
        </div>
        <div className="hidden sm:flex items-center justify-center min-h-screen text-center text-lg text-gray-600">
          Only support mobile view
        </div>
      </body>
    </html>
  );
}