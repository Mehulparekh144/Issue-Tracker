import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers/Providers";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import CustomToaster from "@/components/CustomToaster";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Protrackr",
  description: "Issue Tracker System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body
        className={cn(`min-h-screen font-sans antialiased`, inter.className)}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <Providers>
            <NextTopLoader showSpinner={false} color="#21b357" zIndex={1600} />
            <Navbar session={session} />
            {children}
            <CustomToaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
