# MikArt front page

## Current direction

A full-width, server-first Minecraft page. Typography, authentic server photography, and clear actions carry the design. The Essential reference informs the confidence and simplicity of the layout, not its branding or a literal copy of its typeface.

The owner's latest direction supersedes the initial pixel-font and voxel-art explorations. Use clean Inter typography throughout, following the latest Modrinth-inspired typography update. The hero must fill the first screen on large monitors. Its supplied forest photograph sits flush against the complete bottom-right corner, fading toward the text. It is not an image card or visible rectangular panel.

## Non-negotiables from review

- No numbered labels such as “01 / A FIRST LOOK”.
- No promotional eyebrow badges such as “SAME MIKART. NEW CHAPTER. / SEASON 02”.
- No decorative coordinates, plus marks, indices, or small slogans to fill space.
- No vague taglines such as “A little world, a lot of possibility”.
- No cross or other invented logo before `mikart`. The owner will supply a logo later. Until then, use a plain text wordmark.
- No novelty Minecraft font. The owner reviewed it and prefers the clean direction now implemented.
- No generated voxel island or other substitute illustration. Use the owner's actual server images.
- No unrelated stock video, fake play controls, fabricated statistics, dynamic player counts, invented mechanics, or launch dates.
- No boxed desktop hero or fixed maximum height that leaves it short of a large monitor's first screen.
- Mobile must be checked for intrinsic-width overflow, clipped controls, usable navigation, and readable text. Hiding overflow is not a responsive fix.

## Typography

**Inter**, self-hosted through Next.js, is the home-page typeface. Bold, sentence-case hero text creates impact; lighter paragraphs and functional labels provide contrast. There is no additional pixel or monospace font system.

The hero scales from roughly 43px on narrow phones to 190px on very large screens. Its desktop line height is 1.04 with -.055em tracking; mobile loosens tracking and line height slightly. Secondary headings are smaller and lighter. Copy, captions, and navigation use normal sentence case where possible. Text is flat: no gradient fills, glows, extrusion, or ornamental shadows.

## Color and material

| Role              | Value     | Purpose                                        |
| ----------------- | --------- | ---------------------------------------------- |
| Canvas            | `#080f1b` | Near black, subtly related to the forest       |
| Primary text      | `#e8eef7` | Headings and important text                    |
| Supporting text   | `#9eafc5` | Paragraphs and helper copy                     |
| Accent            | `#9bd0ff` | Primary actions and selective heading emphasis |
| Rules             | `#203047` | Functional section divisions                   |
| Secondary surface | `#0f1e31` | Join section                                   |
| Footer surface    | `#0b1626` | Quiet closing area                             |

Ice blue is the single interface accent. The latest direction uses a deep ocean-blue canvas (#080f1b) with navy surfaces and cool blue text. Other colors come from the server screenshots. Controls have subtle 10px rounding, surfaces are opaque, and the page has no floating cards, glassmorphism, arbitrary shadows, blurred shapes, or ambient animations.

## Full-screen hero and image treatment

The header is 80px high on desktop and 68px on mobile. The hero uses `min-height: calc(100svh - header-height)` with no desktop width or height cap. This keeps header plus hero at least one screen tall, including 1920px and 2560px displays. It can grow where short-screen accessibility or content height requires it.

Horizontal gutters scale with the viewport: `clamp(24px, 4.2vw, 112px)`. They do not grow into enormous centered side margins. The title, plain Season 2 sentence, address button, and version form one clear left-aligned group.

The forest image is positioned at `right: 0; bottom: 0` inside the hero. It is cropped with `object-fit: cover`. Two intersected linear alpha masks fade its top and left boundaries into the canvas, leaving the bottom-right area visible. These masks remove the rectangular edge and protect text contrast; they are not decorative gradient backgrounds. The photo has no frame, radius, border, floating treatment, or separate caption.

On mobile, text and controls remain near the top. The forest sits behind the lower portion of the hero, with additional bottom space so it does not crowd the address. All text and controls size against the available content width. The hero does not stack an enormous separate illustration below the action.

## Reading order

1. **Header:** plain `mikart`, server and Discord links, a small project shortcut, and join action. On mobile, the project shortcut and join action remain visible; community links are also available in the hero and footer.
2. **Hero:** large Minecraft headline, factual Season 2 return copy, copyable `play.mikart.eu`, and Minecraft `26.2`. Authentic forest image at the bottom-right. No badge above the headline.
3. **Trailer:** immediately after the hero. The supplied hall screenshot is the reserved poster. “Season 2 trailer” and “Coming soon” state the current status directly. A film icon identifies the medium without pretending playback is available.
4. **World preview:** supplied ruins screenshot, uncropped, with a short relaunch update and Discord link. Its alpha watermark stays intact. An asymmetric image-and-text layout avoids repetitive feature cards.
5. **Join section:** repeats the address and explains Minecraft → Multiplayer → Add Server. Launch updates remain linked. No claim that Season 2 has already launched.
6. **Projects:** actual documented projects — AnimVanish, GroupSecurity, Panoptic, and Tava — shown as full-width linked rows with useful descriptions.
7. **Footer:** oversized plain wordmark, address, two usable navigation columns, back-to-top link, and legal details. No artificial stepped landscape or slogan. Minecraft identity comes from the real imagery above and the server content, not more decorative block graphics.

## Footer and mobile

The footer is a structured four-column composition on desktop: brand, server links, MikArt links, and back to top. At intermediate widths the last item moves onto its own row. On phones the brand spans the width, followed by two navigation columns; policy details stack beneath a thin rule. Footer links provide 44px touch targets on mobile.

The rest of the page switches from split compositions to single-column layouts below 760px. The project directory retains all project links and type descriptions; longer descriptions are omitted only on narrow screens. The trailer becomes taller so its caption remains readable. Copy buttons use an explicit wrapper width constrained by `max-width: 100%`; grid columns use `minmax(0, 1fr)` where needed to avoid intrinsic-width overflow.

## Asset provenance

- `public/assets/server/season-2-forest.png`: owner's latest forest screenshot. Used only as cropped hero imagery. This is intentionally replaceable with later official art.
- `public/assets/server/season-2-hall.png`: owner's wide in-game screenshot. Used as the trailer poster and social preview. Native dimensions: 3258 × 1358.
- `public/assets/server/season-2-ruins.png`: owner's alpha screenshot. Shown uncropped. Native dimensions: 947 × 637.
- The Essential screenshot is a reference only and is not published as content.

The rejected voxel illustration, generator, and downloaded display fonts have been removed. Do not restore them during future revisions.

## Trailer handoff

Replace the `trailer-frame` figure in `app/(site)/page.tsx` when the real server trailer arrives. Preserve its position directly after the full-screen hero. Use the actual video's poster, visible accessible controls, captions when appropriate, and click-to-play. Remove “Coming soon” only once playback works. Do not autoplay audio or use unrelated stock footage.

## Implementation and accessibility

`app/(site)/page.tsx` remains a Server Component. `components/home/copy-address.tsx` is the small client boundary. It copies the exact address, announces success or failure through a status region, and clears timers on repeated clicks and unmount. Clipboard failure displays the address for manual copying.

Native section anchors work without JavaScript. The page includes a skip link, semantic headings and sections, meaningful screenshot alt text, and visible focus states. Decorative hero art is hidden from assistive technology. Color transitions are disabled for reduced motion. There are no parallax effects or entrance animations.

Styles are scoped to the homepage. Existing authentication, other layouts, documentation, and theme behavior remain unchanged. Historical version guidance in the Minecraft documentation requires a separate content review.

## Next inputs

Official logo, final hero artwork, actual trailer, confirmed server mechanics, and launch timing. Preserve the hierarchy when adding them. Update visible launch copy and metadata together. Do not reintroduce rejected badges, slogan labels, pixel fonts, invented logos, or generic illustrations.

## Blog reading and discussion

The blog uses Inter with a deep ocean-blue canvas and cool blue local theme tokens, including portalled discussion menus and dialogs. Navigation and sharing are transparent text actions, with visible focus outlines and no resting button backgrounds. Article content uses a 736px reading width, 16px body copy at 1.75 line height, 16px paragraph gaps, and 32px before subsequent headings. The first content block has no top margin. Discussion follows a compact heading, inline sign-in invitation, and separated comment rows. Edited metadata is upright and unparenthesized. Avoid the global orange primary color, dashed sign-in panels, duplicate empty states, and stacked renderer/page heading margins.
