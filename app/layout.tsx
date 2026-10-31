import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PolarisBI — Insurance Analytics that Thinks",
  description: "AI-augmented data analyst cockpit for Indonesian insurance industry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: next-themes sets the theme class on <html>
    // before React hydrates.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* defaultTheme: "dark" = tampilan awal bila belum pernah memilih.
            Ganti ke "light" bila day mode ingin jadi tampilan awal. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          storageKey="polarisbi-theme"
          disableTransitionOnChange
        >
          <I18nProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
