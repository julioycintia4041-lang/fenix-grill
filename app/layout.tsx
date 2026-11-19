import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FÉNIX GRILL BAR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="bg-[#050505] text-white antialiased">{children}</body>
    </html>
  );
}
