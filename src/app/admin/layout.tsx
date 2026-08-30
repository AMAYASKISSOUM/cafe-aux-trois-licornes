import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/admin-auth";
import "../globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Administration" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <html lang="fr" className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-parchment font-sans text-ink">
        {isClerkConfigured() ? (
          <ClerkProvider afterSignOutUrl="/admin/sign-in">{children}</ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
  return content;
}
