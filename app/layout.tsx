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
    <html lang="en">
      <head>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        {/* <!-- / Fathom --> */}
      </head>
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
