import "@workspace/ui/globals.css";

import { revalidatePath, revalidateTag } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { NavbarServer, NavbarSkeleton } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { SanityLive } from "@/lib/sanity/live";

import { Providers } from "../components/providers";
import LocaleSwitcher from "@/components/locale-switcher";
import { AudienceProvider } from "@/components/audience-provider";
import AudienceSelect from "@/components/audience-select";

const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontGeist.variable} ${fontMono.variable} font-geist antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AudienceProvider>
            <Providers>
              <Suspense fallback={<NavbarSkeleton />}>
                <NavbarServer />
              </Suspense>
              {(await draftMode()).isEnabled ? (
                <>
                  {children}
                  <VisualEditing
                    refresh={async (payload) => {
                      "use server";
                      if (payload.source === "manual") {
                        revalidatePath("/", "layout");
                        return;
                      }
                      const id = payload?.document?._id?.startsWith("drafts.")
                        ? payload?.document?._id.slice(7)
                        : payload?.document?._id;
                      const slug = payload?.document?.slug?.current;
                      const type = payload?.document?._type;
                      for (const tag of [slug, id, type]) {
                        if (tag) revalidateTag(tag);
                      }
                    }}
                  />
                  {/* <PreviewBar /> */}
                </>
              ) : (
                children
              )}
              <Suspense fallback={<FooterSkeleton />}>
                <FooterServer />
              </Suspense>
              <SanityLive />
            </Providers>
            <div className="sticky bottom-0 flex justify-center w-full bg-slate-300">
              <div className="w-1/2">
                <LocaleSwitcher />
              </div>
              <div className="w-1/2">
                <AudienceSelect />
              </div>
            </div>
          </AudienceProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
