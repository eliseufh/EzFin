import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EzFin",
  description: "Gestão financeira para quem tem preguiça",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#10b981", // green-500
          colorBackground: "#0f172a", // slate-900
          colorInputBackground: "#1e293b", // slate-800
          colorInputText: "#f1f5f9", // slate-100
          colorText: "#f1f5f9", // slate-100
          colorTextSecondary: "#cbd5e1", // slate-300
          colorDanger: "#ef4444", // red-500
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist-sans)",
        },
        elements: {
          rootBox: "mx-auto",
          card: "bg-slate-900 border-2 border-slate-700 shadow-2xl shadow-green-500/20",
          headerTitle: "!text-white text-2xl font-bold",
          headerSubtitle: "!text-slate-300",
          socialButtonsBlockButton:
            "!bg-slate-800 border-2 !border-slate-600 hover:!bg-slate-700 hover:!border-green-500 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-500/30",
          socialButtonsBlockButtonText: "!text-white font-semibold text-base",
          socialButtonsBlockButtonArrow: "!text-white",
          socialButtonsProviderIcon: "!brightness-200",
          formButtonPrimary:
            "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 !text-white font-semibold shadow-lg shadow-green-500/25 transition-all",
          formFieldInput:
            "!bg-slate-800 !border-slate-600 !text-white placeholder:!text-slate-400 focus:!border-green-500 focus:ring-2 focus:ring-green-500/20",
          formFieldLabel: "!text-slate-200 font-medium",
          footerActionLink: "!text-green-400 hover:!text-green-300 font-medium",
          identityPreviewText: "!text-slate-200",
          identityPreviewEditButton: "!text-green-400 hover:!text-green-300",
          formHeaderTitle: "!text-white text-xl font-semibold",
          formHeaderSubtitle: "!text-slate-300",
          dividerLine: "!bg-slate-700",
          dividerText: "!text-slate-300",
          logoBox: "h-10 w-10",
          logoImage: "brightness-110",
          formFieldInputShowPasswordButton: "!text-slate-300 hover:!text-white",
          formFieldAction: "!text-green-400 hover:!text-green-300",
          footerActionText: "!text-slate-300",
          otpCodeFieldInput: "!bg-slate-800 !border-slate-600 !text-white",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
