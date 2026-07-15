import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import { SWRegister } from "@/components/sw-register";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "No Pain No Gain ft. Sofi",
    template: "%s · No Pain No Gain",
  },
  description:
    "App personal para registrar entrenamientos, asistencia al gym e hidratación.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "No Pain No Gain",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${poppins.variable} ${inter.variable} dark`}>
      <body className="min-h-screen antialiased">
        {children}
        <SWRegister />
      </body>
    </html>
  );
}
