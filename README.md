# Lag på Lag

A website for a konditori on Amagerbrogade in Copenhagen that does not exist. It only bakes celebration cakes, for the person ordering a cake for someone else who wants to get it right. The name is Danish for "layer on layer". It is a design sample by Ice's Stack, and the first build with an owner-editable CMS.

## What it is

One page:

- **Hero.** "See the cake before you order it." set huge on cake-box kraft, with a hand-drawn box tied in red-and-white baker's twine.
- **Byg kagen**, the signature moment. Scroll builds Sofie's birthday cake from the plate up. Sponge, raspberry jam, vanilla cream, a second sponge, the marzipan drape, raspberries and pistachio, two paper flags, and "Tillykke Sofie" piped along the front. Each layer lands with its line on a receipt, and the total adds up to 550 kr. before "Order this cake" appears.
- **The cakes**, with sizes and prices.
- **Order.** A working order form. It knows the 3 days' notice, checks the phone number or email, and fills itself in from the cake you picked. It sends nothing and says so.
- **Visit**, with opening hours.

With reduced motion or without JavaScript, the page shows the finished cake and the full receipt, and nothing is pinned.

## Stack

- **Astro** with TypeScript, static output. The page ships no framework JavaScript.
- **The drawings are generated at build time** in `src/lib/hand.ts`. Shapes are sampled into points, moved by seeded smooth noise so the line wanders like a pen, and joined with Catmull-Rom curves. The same seed gives the same drawing on every build.
- **GSAP 3.12.5** with **ScrollTrigger** from a CDN, for the one scrubbed timeline.
- **Caprasimo** (display) and **Figtree** (text), self-hosted in `public/fonts`.
- **Sanity** for the owner's content. The Studio lives in `studio/` and is hosted at lag-paa-lag.sanity.studio. The owner can change the hero line, a promo banner, opening hours, the cakes and their prices, and every layer's name and price in Byg kagen. The site reads Sanity once at build time, so visitors never wait on it.
- **Netlify**, rebuilt by a Sanity webhook when the owner presses Publish.

## Run it

```sh
npm install
npm run dev        # the site, on localhost:4321
cd studio && npm install && npm run dev   # the Studio, on localhost:3333
```

Lag på Lag, Sofie and the cakes are invented. No cakes are sold here.
