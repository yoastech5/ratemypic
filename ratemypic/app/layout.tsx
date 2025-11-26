import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RateMyPic - Rate Photos",
  description: "Rate and discover amazing photos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
