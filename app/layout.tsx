import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirundi Translator",
  description: "Generated by AU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href={"/assets/burundi.png"} />
      <body className="font-primary">{children}</body>
    </html>
  );
}
