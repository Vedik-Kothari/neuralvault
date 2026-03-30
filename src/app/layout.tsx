import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuralVault — AI Command Center",
  description: "RBAC-Secured Enterprise Knowledge Base",
  icons: {
    icon:    "/favicon.svg",
    apple:   "/favicon.svg",
    shortcut:"/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>"
        />
      </head>
      <body className="bg-bg text-white overflow-hidden h-screen w-screen">
        <div className="bg-mesh" />
        <div className="scan-line" />
        {children}
      </body>
    </html>
  );
}