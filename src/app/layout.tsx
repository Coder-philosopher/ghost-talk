import "~/styles/globals.css";
import { Bricolage_Grotesque } from "next/font/google"; 
import { type Metadata } from "next";

// Wrappers
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TRPCReactProvider } from "~/trpc/react";

// Components
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";
import { Toaster } from "~/components/ui/toaster";
import { ScrollToTop } from "~/components/scroll-to-top";
import { WelcomeBanner } from "~/components/welcome-banner";


const grotesk = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GhostTalk",
  description:
    "Share your thoughts and experiences anonymously with GhostTalk — the safest way to express yourself freely.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={grotesk.variable}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#18181b" />
        <meta name="theme-color" content="#18181b" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TRPCReactProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={["light", "dark", "purple", "green", "blue", "rose"]}
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
              <ScrollToTop />
              <WelcomeBanner />
            </div>
          </NextThemesProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
