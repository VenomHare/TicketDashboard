import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Tickets Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://res.cloudinary.com/dzgbkv34a/image/upload/v1734801645/favicon_zzlvlt.ico" />
        <meta property="og:image" content="https://res.cloudinary.com/dzgbkv34a/image/upload/v1734802064/Frame_30_dq3hxb.png"/>
        <meta property="og:site_name" content="Ticket Dashboard"/>
        <meta property="og:title" content="VenomHare's Ticket Dashboard"/>
        <meta property="og:description" content="Tickets Dashboard"/>
        <meta property="og:url" content="https://lgimodz.vercel.app"/>
        <meta property="og:type" content="website"/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/>
        
        <meta property="twitter:card" content="summary"/>
        <meta property="twitter:image" content="https://res.cloudinary.com/dzgbkv34a/image/upload/v1734802064/Frame_30_dq3hxb.png"/>
        <meta property="twitter:title" content="VenomHare's Ticket Dashboard"/>
        <meta property="twitter:description" content="Tickets Dashboard"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
