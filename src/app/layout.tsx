import type { Metadata } from "next";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";
import { ReadyNotifier } from "@/components/ready-notifier";
import { Providers } from "./providers";
import FarcasterWrapper from "@/components/FarcasterWrapper";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = (await cookies()).get("x-request-id")?.value;

  return (
        <html lang="en">
          <head>
            {requestId && <meta name="x-request-id" content={requestId} />}
          </head>
          <body className={`antialiased`}>
            {/* Do not remove this component, we use it to notify the parent that the mini-app is ready */}
            <ReadyNotifier />
            <Providers>
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      </Providers>
            <ResponseLogger />
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "GeoGuesser",
        description: "Guess the location from street imagery. Play 5 rounds and climb the leaderboard.",
        other: { "fc:frame": JSON.stringify({
          version: "next",
          imageUrl: "https://geoguesser-lemon.vercel.app/frame-image.svg",
          button: { title: "Open with GeoGuesser", action: { type: "open", name: "GeoGuesser", url: "https://geoguesser-lemon.vercel.app/" } }
        }) }
    };
