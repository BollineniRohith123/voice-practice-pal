import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Tezhire Interview Bot",
  description: "AI Agent from Tezhire to take interviews in Effective way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#6558F5" />
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        {/* <!-- / Fathom --> */}
      </head>
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 antialiased overflow-x-hidden">
        <div className="relative w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
