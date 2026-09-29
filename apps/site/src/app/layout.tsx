import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hondo — Think first. Organize later.",
  description:
    "An AI notepad and workspace for messy capture, automatic organization, source-backed memory, PDF annotation, and connected thinking across desktop and mobile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // the script below may set data-theme before React hydrates
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* apply a saved theme choice (ThemeToggle) before first paint, so a
            visitor who picked the other theme never sees a flash of the device one */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
