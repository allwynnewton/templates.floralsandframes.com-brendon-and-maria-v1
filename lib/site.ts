// Single source of truth for all wedding content.
// Edit here to re-brand the entire experience.

export const couple = {
  groom: 'Brendon',
  bride: 'Maria',
  initials: 'B + M',
};

export const wedding = {
  // ISO string used for the live countdown
  dateISO: '2026-12-28T16:00:00+05:30',
  dateLabel: '28 · DECEMBER · 2026',
  dateShort: '28 · 12 · 2026',
  day: 'SATURDAY',
  time: '4:00 PM',
  city: 'Goa, India',
  ceremony: {
    title: 'The Sacrament of Holy Matrimony',
    venue: 'Our Lady of Grace Church',
    time: '4:00 PM',
    place: 'Goa, India',
    mapUrl: 'https://maps.google.com/?q=Our+Lady+of+Grace+Church+Goa',
  },
  reception: {
    venue: 'The Grand Ballroom',
    resort: 'The Heritage Resort',
    time: '7:30 PM onwards',
    note: 'Dinner · Music · Dancing',
  },
};

export const scriptures = {
  love: {
    lines: [
      'And now these three remain:',
      'faith, hope and love.',
      'But the greatest of these is love.',
    ],
    ref: '1 Corinthians 13:13',
  },
  ruth: {
    line: 'Where you go, I will go.',
    ref: 'Ruth 1:16',
  },
  covenant: {
    line: 'Therefore what God has joined together,\nlet no one separate.',
    ref: 'Mark 10:9',
  },
  psalm: {
    line: 'The Lord has done great things for us,\nand we are filled with joy.',
    ref: 'Psalm 126:3',
  },
};

export const story = {
  intro: [
    'We met in the most ordinary way,',
    'but somewhere between conversations, laughter and prayer,',
    'something extraordinary began.',
  ],
  milestones: [
    { year: '2019', title: 'The first hello', tone: 'ivory' },
    { year: '2021', title: 'A friendship became something more', tone: 'cream' },
    { year: '2024', title: 'The question', tone: 'champagne' },
    { year: '2026', title: 'Forever begins', tone: 'wine' },
  ],
};

export const parallaxMoments = [
  { caption: 'Every love story is beautiful.', tone: 'forest' },
  { caption: 'But this one is ours.', tone: 'wine' },
  { caption: 'Our favourite chapter begins here.', tone: 'champagne' },
];

export const proposal = {
  captions: [
    'Under a sky full of promises…',
    '…we made one of our own.',
  ],
};

export const details = [
  {
    title: 'Ceremony',
    lines: ['Our Lady of Grace Church', '28 December 2026 · 4:00 PM', 'Goa, India'],
  },
  {
    title: 'Reception',
    lines: ['The Grand Ballroom, Heritage Resort', '7:30 PM onwards', 'Dinner · Music · Dancing'],
  },
  {
    title: 'Dress Code',
    lines: ['Formal / Indian Formal', 'Warm ivory & earthen tones encouraged'],
  },
  {
    title: 'Accommodation',
    lines: ['The Heritage Resort', 'Preferred rates for guests', 'Mention "Brendon & Maria"'],
  },
  {
    title: 'Transportation',
    lines: ['Shuttle from resort to church', 'Departs 3:15 PM', 'Return after reception'],
  },
  {
    title: 'Contact',
    lines: ['For any assistance', 'weddings@brendonandsarah.love', '+91 00000 00000'],
  },
];

export const dressSwatches = ['#F6F0E7', '#E8DDCE', '#C7A76A', '#5A2634', '#17231D'];

// Background soundtrack. `src` is served from /public.
// Fill in `track`/`artist` to show an optional credit in the footer (leave blank to hide).
// NOTE: ensure you hold the rights to use this recording if the site is published.
export const music = {
  src: '/audio/wedding-theme.mp3',
  track: "You're Still The One",
  artist: 'Boyce Avenue ft. Connie Talbot (acoustic cover)',
  baseVolume: 0.4,
};

// Real photography. Multi-photo sections cycle through their array (repeating
// if you provide fewer than the slots). To enrich a section, just add more
// files and list them here — e.g. story: ['/images/2.jpg','/images/2b.jpg', …].
export const photos = {
  hero: '/images/1.jpg', // opening hero — the couple
  story: ['/images/2a.jpg', '/images/2b.jpg', '/images/2c.jpg', '/images/2.jpg'], // "God Wrote Our Story" milestones (4 slots, now all unique)
  parallax: ['/images/3.jpg', '/images/3-backup.jpg'], // full-screen parallax (3 slots)
  proposal: ['/images/4.jpg'], // proposal sequence (3 slots)
  bride: '/images/5-bride.jpg',
  groom: '/images/5-groom.jpg',
  // memory collage (5 slots) — filled with a varied mix so it looks full;
  // swap in dedicated memory-*.jpg files whenever you have them.
  memory: [
    '/images/6.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/7.jpg',
  ],
  reception: '/images/7.jpg',
  farewell: '/images/8.jpg', // final blessing
};

// Creator / business identity for the WhatsApp enquiry CTA.
// Single source of truth — change the name here and it updates everywhere.
export const creator = {
  brand: 'Florals and Frames',
  logo: '/images/companylogo.png',
  whatsappNumber: '917020727961', // digits only, for wa.me
  whatsappDisplay: '+91 7020727961',
  location: 'Goa, India',
  tagline: 'Cinematic wedding websites, made personal.',
};

// Builds the click-to-chat link with a pre-filled enquiry, using the couple's
// actual names from config above.
export function whatsappEnquiryUrl(): string {
  const message = `Hi ${creator.brand}! I just viewed the ${couple.groom} & ${couple.bride} wedding website and absolutely loved the experience. I'm interested in creating something similar for my wedding. Could you please share the pricing and process?`;
  return `https://wa.me/${creator.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
