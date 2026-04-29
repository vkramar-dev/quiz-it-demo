import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import ClientProviders from "./ClientProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quiz-it.online"),
  title: {
    default: "Quiz-IT – Test Your Programming Skills",
    template: "%s | Quiz-IT"
  },
  description:
    "Practice quizzes for C#, SQL, JavaScript and more. Improve your skills and track your progress.",
  keywords: [
    "quiz",
    "test",
    "programming",
    "C#",
    "SQL",
    ".NET",
    "React",
    "JavaScript",
    "learning",
    "technical interview practice",
    "C/C++"
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://quiz-it.online",
    siteName: "Quiz-IT",
    title: "Quiz-IT – Test Your Programming Skills",
    description:
      "Practice quizzes for C#, SQL, JavaScript, React, and .NET. Improve your programming skills and track your progress.",
    locale: "en_US",
    images: [
      {
        url: "https://quiz-it.online/img.png",
        width: 1200,
        height: 630,
        alt: "Quiz-IT Programming Quizzes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz-IT – Test Your Programming Skills",
    description:
      "Practice quizzes for C#, SQL, JavaScript, React, and .NET.",
    images: ["https://quiz-it.online/img.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}