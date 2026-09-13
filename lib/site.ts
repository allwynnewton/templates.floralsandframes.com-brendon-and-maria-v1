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
  day: 'MONDAY',
  dateLong: '28 December 2026',
  rsvpDeadline: '1 December 2026',
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
    venue: 'Quinta de Valadares',
    resort: 'Goa, India',
    time: '7:30 PM onwards',
    note: 'Dinner · Music · Dancing',
    mapUrl: 'https://maps.app.goo.gl/krScyCQvPZeSNCfW9',
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
    lines: ['Quinta de Valadares, Goa', '7:30 PM onwards', 'Dinner · Music · Dancing'],
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
    lines: [
      `Questions about ${couple.groom} & ${couple.bride}’s celebration?`,
      'Guest contact details are not included in this demo.',
    ],
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
  hero: '/images/hero-villa.webp', // generated cover for this fictional demo
  floral: '/images/floral-corner.webp',
  storyIntro: '/images/story-watercolor.webp',
  milestone: ['/images/2a.jpg', '/images/2b.jpg', '/images/4b.jpg', '/images/2c.jpg'],
  ceremony: '/images/3.jpg', // illustrative interior, not verified venue photography
  scripture: '/images/church-aisle.webp', // optimized supplied image; venue not verified
  story: ['/images/2a.jpg', '/images/2b.jpg', '/images/2c.jpg', '/images/2.jpg'], // "God Wrote Our Story" milestones (4 slots, now all unique)
  parallax: ['/images/3.jpg', '/images/3-backup.jpg', '/images/3c.jpg'], // full-screen parallax (3 slots, now all unique)
  proposal: ['/images/4.jpg', '/images/4b.jpg'], // proposal sequence (2 cards, both unique)
  bride: '/images/5-bride.jpg',
  groom: '/images/5-groom.jpg',
  // memory collage (5 slots) — now fully dedicated (no photos borrowed from
  // other sections). Portrait tiles hold portrait shots; wide tiles hold landscape.
  memory: [
    '/images/memory-2.jpg', // temp8 — B&W at the altar (portrait feature)
    '/images/memory-1.jpg', // temp7 — joined hands at the ceremony (landscape)
    '/images/6.jpg',
    '/images/memory-3.jpg', // temp1 — B&W clasped hands, bridal gown (portrait)
    '/images/memory-4.jpg', // temp2 — gold rings on the Holy Bible (landscape)
  ],
  reception: '/images/7.jpg',
  farewell: '/images/8.jpg', // final blessing
};

// Creator / business identity for the WhatsApp enquiry CTA.
// Single source of truth — change the name here and it updates everywhere.
export const creator = {
  brand: 'Florals and Frames',
  website: 'https://floralsandframes.com',
  logo: '/images/companylogo.jpg',
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

// ---------------------------------------------------------------------------
// Add-to-calendar. One event spanning the day: starts at the ceremony, runs to
// late evening. Both venues + times sit in the description; the ceremony is the
// primary location (where the day begins).
// ---------------------------------------------------------------------------
function calendarEvent() {
  const start = new Date(wedding.dateISO);
  const end = new Date(start.getTime() + 7 * 60 * 60 * 1000); // ~ceremony → 11pm
  return {
    title: `${couple.groom} & ${couple.bride} — Wedding`,
    start,
    end,
    location: `${wedding.ceremony.venue}, ${wedding.city}`,
    details:
      `${wedding.ceremony.title} — ${wedding.ceremony.venue}, ${wedding.ceremony.time}. ` +
      `Reception to follow at ${wedding.reception.venue}, ${wedding.reception.time}.`,
  };
}

// Date → UTC basic format for calendars: YYYYMMDDTHHMMSSZ
function toCalDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function googleCalendarUrl(): string {
  const e = calendarEvent();
  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(e.title)}` +
    `&dates=${toCalDate(e.start)}/${toCalDate(e.end)}` +
    `&details=${encodeURIComponent(e.details)}` +
    `&location=${encodeURIComponent(e.location)}`
  );
}

// iCalendar text for Apple Calendar / Outlook (.ics download).
export function icsContent(): string {
  const e = calendarEvent();
  const esc = (s: string) =>
    s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Florals and Frames//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${toCalDate(e.start)}-${couple.groom.toLowerCase()}-${couple.bride.toLowerCase()}@floralsandframes.com`,
    `DTSTAMP:${toCalDate(new Date())}`,
    `DTSTART:${toCalDate(e.start)}`,
    `DTEND:${toCalDate(e.end)}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.details)}`,
    `LOCATION:${esc(e.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(line => {
    // RFC 5545: fold at 75 UTF-8 octets without splitting Unicode characters.
    const encoder = new TextEncoder();
    let folded = ''; let length = 0;
    for (const char of line) {
      const bytes = encoder.encode(char).length;
      if (length + bytes > 75) { folded += '\r\n '; length = 1; }
      folded += char; length += bytes;
    }
    return folded;
  }).join('\r\n') + '\r\n';
}
