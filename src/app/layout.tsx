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
        title: "Geo Detective: Farcaster Quest",
        description: "Explore the world in Farcaster Geo Detective! Guess locations from panoramic views, share scores, and challenge friends. Join leaderboards in this immersive, educational game adventure.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_8c9f581d-b3c2-44d5-9bf9-34945c983f14-s7tb5RVmkZXEQ6inrUbBNVnvC9WHaf","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Geo Detective: Farcaster Quest","url":"https://adventure-cent-145.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
