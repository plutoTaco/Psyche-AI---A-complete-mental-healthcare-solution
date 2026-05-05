import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer } from "./components";

export const metadata: Metadata = {
  title: "Psyche AI — Human-Centered AI Therapy",
  description:
    "Your personal AI-driven mental health care assistant hub. 24/7 access to empathetic AI therapists, daily mood tracking, doctor connect, and peer community forums.",
  keywords: ["mental health", "AI therapy", "chatbot", "mood tracker", "psychiatrist", "wellness"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
