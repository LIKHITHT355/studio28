// Studios 28 brand config. Replace the phone number with the real one.
export const STUDIO = {
  name: "Studios 28",
  tagline: "Capturing Your Story — Bangalore's Photography Studio",
  city: "Bangalore, Karnataka",
  email: "pradeep7791@gmail.com",
  phone: "+91 88845 45006",
  phoneHref: "+918884545006",
  whatsappHref: "918884545006",
  instagram: "https://www.instagram.com/studio28blr?igsh=NG1tNnB6cnMxdHpq",
  facebook: "https://www.facebook.com/profile.php?id=100082434444044",
  mapsEmbed:
    "https://www.google.com/maps?q=Bangalore,Karnataka&output=embed",
};

const u = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const GALLERY = [
  { id: 1, cat: "Wedding", src: u("1519741497674-611481863552", 1200), alt: "Wedding ceremony" },
  { id: 2, cat: "Wedding", src: u("1511285560929-80b456fea0bc", 1200), alt: "Bride and groom" },
  { id: 3, cat: "Wedding", src: u("1520854221256-17451cc331bf", 1200), alt: "Wedding rings" },
  { id: 4, cat: "Pre-Wedding", src: u("1529634597503-139d3726fed5", 1200), alt: "Pre-wedding couple" },
  { id: 5, cat: "Pre-Wedding", src: u("1516589091380-5d8e87df6999", 1200), alt: "Couple portrait outdoors" },
  { id: 6, cat: "Pre-Wedding", src: u("1522673607200-164d1b6ce486", 1200), alt: "Engagement shoot" },
  { id: 7, cat: "Portrait", src: u("1494790108377-be9c29b29330", 1000), alt: "Studio portrait" },
  { id: 8, cat: "Portrait", src: u("1500648767791-00dcc994a43e", 1000), alt: "Male portrait" },
  { id: 9, cat: "Portrait", src: u("1524504388940-b1c1722653e1", 1000), alt: "Fashion portrait" },
  { id: 10, cat: "Events", src: u("1492684223066-81342ee5ff30", 1200), alt: "Event crowd" },
  { id: 11, cat: "Events", src: u("1505236858219-8359eb29e329", 1200), alt: "Corporate event" },
  { id: 12, cat: "Events", src: u("1511578314322-379afb476865", 1200), alt: "Concert event" },
  
];

export const CATEGORIES = ["All", "Wedding", "Pre-Wedding", "Portrait", "Events"];

export const SERVICES = [
  {
    title: "Wedding Photography",
    desc: "Full-day coverage of your ceremony and reception — candid moments, family portraits, and cinematic storytelling.",
  },
  {
    title: "Pre-Wedding Shoots",
    desc: "Outdoor and studio couple sessions across Bangalore's most beautiful locations, styled to your story.",
  },
  {
    title: "Maternity",
    desc: "Elegant, tastefully lit maternity portraits in-studio or on location, celebrating this special chapter.",
  },
  {
    title: "Portrait Sessions",
    desc: "Personal, professional, and fashion portraits with studio lighting and multiple styled looks.",
  },
  {
    title: "Corporate & Events",
    desc: "Conferences, product launches, headshots, and brand events — delivered fast and press-ready.",
  },
  {
    title: "Product Photography",
    desc: "E-commerce, lookbook, and campaign imagery for brands — clean, catalog-ready, and on-brand.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Ananya & Rohit",
    role: "Wedding, Bangalore",
    photo: u("1544005313-94ddf0286df2", 200),
    rating: 5,
    text: "Studios 28 made our wedding day feel effortless. The photos are art — every emotion, every detail. Pradeep and team are magicians with a camera.",
  },
  {
    name: "Meera Kapoor",
    role: "Maternity Shoot",
    photo: u("1502823403499-6ccfcf4fb453", 200),
    rating: 5,
    text: "So calming and creative. I felt beautiful the entire session and the final gallery brought me to tears. Highly recommend.",
  },
  {
    name: "Nimbus Coffee Co.",
    role: "Product Campaign",
    photo: u("1560250097-0b93528c311a", 200),
    rating: 5,
    text: "Sharp, on-brand product imagery delivered on time. The Studios 28 team understood our vision immediately.",
  },
  {
    name: "Karthik R.",
    role: "Corporate Event",
    photo: u("1500648767791-00dcc994a43e", 200),
    rating: 5,
    text: "Professional, punctual, and phenomenal quality. Our conference photos looked like a magazine spread.",
  },
];