/**
 * Gallery images — single source of truth for both the homepage preview
 * (first 9) and the full /gallery page.
 *
 * `title` and `caption` render as the tile overlay. `caption` may be empty.
 *
 * NOTE: the 9 entries marked `featured: true` carry captions carried over
 * verbatim from the original homepage markup. The rest were added from the
 * files in public/assets/gallery/ and have TITLES DERIVED FROM FILENAMES —
 * they need real captions from Priyanshu before they read well. They are
 * deliberately not invented here.
 */

export type GalleryItem = {
  /** filename under /assets/gallery/ */
  src: string;
  title: string;
  caption: string;
  /** shown in the 3x3 homepage preview */
  featured?: boolean;
  /** true when title/caption still need real copy */
  needsCaption?: boolean;
};

export const GALLERY: GalleryItem[] = [
  // --- Featured 9 (captions verified, previously on the homepage) ---
  {
    src: 'kishore-lulla.jpeg',
    title: 'Kishore Lulla',
    caption: 'Bollywood’s biggest producer',
    featured: true,
  },
  {
    src: 'house-of-lords.jpeg',
    title: 'House of Lords',
    caption: 'Afternoon tea with Sophie Newbound',
    featured: true,
  },
  {
    src: 'gfois-dubai.jpeg',
    title: 'GFOIS Dubai',
    caption: 'VIP delegate, Global Family Office Summit',
    featured: true,
  },
  {
    src: 'lord-rami-ranger.jpeg',
    title: 'Lord Rami Ranger',
    caption: 'Gifts me his autobiography',
    featured: true,
  },
  {
    src: 'gala-dinner-dubai.jpeg',
    title: 'Gala Dinner',
    caption: 'Dubai',
    featured: true,
  },
  {
    src: 'ciros-pomodoro.jpeg',
    title: 'Ciro Orsini',
    caption: 'At Ciro’s Pomodoro, Knightsbridge',
    featured: true,
  },
  {
    src: 'zebu-live.jpeg',
    title: 'Lord Kulveer Singh Ranger',
    caption: 'Attending his talk at Zebu Live 2025',
    featured: true,
  },
  {
    src: 'oliver-rothschild.jpeg',
    title: 'Oliver Rothschild',
    caption: 'City of London',
    featured: true,
  },
  {
    src: 'gen-ai-london.jpeg',
    title: 'Gen AI London',
    caption: 'With some new friends',
    featured: true,
  },

  // --- Remaining 18: titles derived from filenames, captions TODO ---
  { src: 'arina-marina.jpeg', title: 'Arina Marina', caption: '', needsCaption: true },
  { src: 'balbir-promo.jpeg', title: 'Balbir', caption: '', needsCaption: true },
  { src: 'bishopsgate-angels.jpeg', title: 'Bishopsgate Angels', caption: '', needsCaption: true },
  { src: 'dilhan-aras.jpeg', title: 'Dilhan Aras', caption: '', needsCaption: true },
  { src: 'florian-balbir.jpeg', title: 'Florian & Balbir', caption: '', needsCaption: true },
  { src: 'home-house.jpeg', title: 'Home House', caption: '', needsCaption: true },
  { src: 'london-bridge.jpeg', title: 'London Bridge', caption: '', needsCaption: true },
  { src: 'mayfair-networking.jpeg', title: 'Mayfair', caption: '', needsCaption: true },
  { src: 'mercato-commercial.jpeg', title: 'Mercato', caption: '', needsCaption: true },
  { src: 'phillip-robl.jpeg', title: 'Phillip Robl', caption: '', needsCaption: true },
  { src: 'prince-kamari.jpeg', title: 'Prince Kamari', caption: '', needsCaption: true },
  { src: 'private-art.jpeg', title: 'Private Art', caption: '', needsCaption: true },
  { src: 'real-estate.jpeg', title: 'Real Estate', caption: '', needsCaption: true },
  { src: 'roozy-penrose.jpeg', title: 'Roozy Penrose', caption: '', needsCaption: true },
  { src: 'simmons-bar.jpeg', title: 'Simmons Bar', caption: '', needsCaption: true },
  { src: 'victoria-beale.jpeg', title: 'Victoria Beale', caption: '', needsCaption: true },
  { src: 'xchg-london.jpeg', title: 'XCHG London', caption: '', needsCaption: true },
  { src: 'zeeshan-mallick.jpeg', title: 'Zeeshan Mallick', caption: '', needsCaption: true },
];

export const FEATURED = GALLERY.filter((g) => g.featured);

/** Descriptive alt text, falling back to the title when no caption exists. */
export const altFor = (g: GalleryItem) =>
  g.caption ? `${g.title} — ${g.caption}` : g.title;
