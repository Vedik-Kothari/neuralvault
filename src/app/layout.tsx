import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuralVault — AI Command Center",
  description: "RBAC-Secured Enterprise Knowledge Base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-white font-ui antialiased min-h-screen">
        <div className="bg-mesh" />
        <div className="scan-line" />
        <main className="relative z-10 w-full min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}