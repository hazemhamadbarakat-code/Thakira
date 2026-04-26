// ============================================================
// Data Layer Adapter — Heritage Chapters
// Single source of truth for ChaptersScreen + ChapterDetailScreen
// + Archive Detail. The provided UI screens consume this shape.
// ============================================================

export interface TimelinePoint {
  label: string;
  active?: boolean;
}

export interface ChapterWidget {
  label: string;
  value: string;
  icon?: string;
  pulse?: boolean;
}

export interface KeyPoint {
  title: string;
  description?: string;
}

export interface ChapterMedia {
  src: string;
  alt: string;
  caption?: string;
}

export interface Chapter {
  id: string;
  era: string;            // e.g. "BRONZE AGE"
  eraDates?: string;      // e.g. "(c. 3500 – 1200 BCE)"
  title: string;
  subtitle?: string;
  hero: ChapterMedia;
  gallery?: ChapterMedia[];
  pullQuote: string;
  intro: string[];        // body paragraphs (archive detail)
  timeline: TimelinePoint[];
  widgets: ChapterWidget[];
  keyPoints: KeyPoint[];
  daleelInsight: string;
  layout?: "primary" | "media-top" | "scientific" | "editorial";
}

// ---- Chapter dataset ---------------------------------------
export const CHAPTERS: Chapter[] = [
  {
    id: "canaanite-roots",
    era: "BRONZE AGE",
    eraDates: "(c. 3500 – 1200 BCE)",
    title: "Canaanite Roots & Ancient Cities",
    pullQuote:
      "Standing at the cradle of civilization, where the first stones of Jericho were laid and the earth first yielded to the Canaanite plow.",
    hero: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK1shZBGjK132TnzZW7nm-zx3q8jq7aJxBZIskzJ19HYp_SfXhBc3Qbayhhr-LDhv4rOfZt2j-Ba2fWg_LVH8dJMu8IPLTG64wX0nHo2ge5q5l58zhRFOe2q7Yi0cUOa8_SJAPb0AZonZMF0k0z4I0ZdsqmPMaqxq8hi4giKVPUX4y1SS0iPFzu96TQYl0VuLsDevA091BD2tqRkQLfUp2Gzv10pXCpTFyC1YE87quhu86XcLRiIsujGUt1zsPZLyAmOLFj9qpIbkN",
      alt: "Cinematic sweeping view of ancient middle eastern stone city ruins at golden hour",
    },
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzYoxDe6GdSmyKjnDCzqkYlRx-EctIyPG2cCZg9RdofEFnlFJ5KkmlBQl6uAXzfvc9jJo0sozXFz7nFR8lFrgRG6NBg8pvoEUrzvtdV8qYGJOUoAFoWpS1dJr7SpUi2j4c6KCcRFUeSy9CQDq-LrqXjjiFNUy0W_8f7deQhooyyYozyESB3_0Q-wzEfuPUykwpNvBR2w6Ahf9UULLF6zSqxI1jCl_hRinahP44RZkw0sXsDOLCYySjD1kKMKnimv98woZQpU1X1lGG",
        alt: "Wide shot of ancient stone ruins of Jericho under harsh desert sun",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb6r_aeVMZUXALa6z0r3xDjcVcFqEujqBPJS-ThfKU9dZu8mhLxLIT3UjxH6QG1fsmGSSYBByvxSyofpqBbkGundkDkWgecShiQDnDND5QAhRPOG_o-Ys5LY1KBnVDczYuRLxfTDfB2gja0Onl49m7TP-z-LMyLn49rbRSTCSsmU8i8DQjmn3w8oTTQJmkG_sL8j7bc3eEKEAutpRd19SIwHIGkWxOs4x5MeCz2uDQUu564g_q4FT09k85z2FyFCelxKT68kbhhO_t",
        alt: "Close up of stone foundations at an archaeological dig site",
      },
    ],
    intro: [
      "Standing at the cradle of civilization, the first stones of Jericho were laid as the earth yielded to the Canaanite plow. This marks a pivotal moment in human history, transitioning from nomadic existence to rooted, fortified communities.",
    ],
    timeline: [
      { label: "8000 BCE" },
      { label: "3000 BCE", active: true },
      { label: "1500 BCE" },
    ],
    widgets: [
      { label: "HISTORICAL DATA", value: "Archaeological Record Verified", pulse: true },
      { label: "LOCATION CONTEXT", value: "Jericho (Tell es-Sultan)", icon: "location_on" },
    ],
    keyPoints: [
      { title: "The Urban Revolution", description: "Transition from small villages to fortified cities like Jericho." },
      { title: "Engineering Marvels", description: "The Neolithic tower and massive stone walls." },
      { title: "Agricultural Mastery", description: "Pioneering olive and grape cultivation in the region." },
    ],
    daleelInsight:
      "Did you know that Jericho's walls were already ancient by the time the Romans arrived?",
    layout: "primary",
  },
  {
    id: "byzantine-roman",
    era: "BYZANTINE & ROMAN PERIOD",
    eraDates: "63 BCE — 634 CE",
    title: "The Byzantine & Roman Period: Mosaics & Holy Sites",
    pullQuote:
      "A significant era where faith was set in stone and glass, transforming the landscape into an enduring spiritual compass.",
    hero: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0dABsqBOn6H6y7nc5nvP8pXjSPaBWqsmRWPNtWZYg5GKcbLFf1E-WrVAgVTbgSh1KPC23VR9qROiZnh1La_TtQg20W4kQfR9fTQqlZiK040RuHMd5TZWxcv3EtR8rkV0PHRZWD1SY_OMe2332reCkFtzz7_KW5loGhlz34kFzSF_zO0uJtG7xLzYHUXQfXvFRnhFhKi3xHpG5dfMOQlzHMU8nXHHAGRowmktWb1UF-jLHVifDVKKF4luADCuwGATJSUTgTsZYQL2G",
      alt: "Cinematic interior of a grand byzantine basilica with shimmering gold mosaics and beams of sunlight",
    },
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbdn18DnXKAM32FE0_cbjT0bC0TJ0QfbJ15JvSGrPxD7PjE_yHQHegeAWRjmHw7Dn4fjsDhiHZfrR7WIUK1z7W3Z5We90TV7AfMu2qCKUwHD11VwdRghuJJUVq6vSIakUJLsK_CFys9LK0lDCRFqPQQ06igOCjE4s73kj-PsgzosE-U5YCdyW_q9K-XGuyXcIBMp6cx4H8nI5DP0JXLaomQbkOZW71rc4IHoTJbTONDb2Zmzy-xC6XtkpPYe4A-lag-5fROZ76zKHt",
        alt: "Intricate Byzantine floor mosaic with geometric patterns and earthy tones",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXY6HEiuOdIYaFRmDuic7ogA5oxHn4x47huq2bYgpYJqiLhAfOw11xR8bYxDOi0ArSrP5kyys_YtscqJl8IZeId6_8-d5Wx9R1m9Ky19vRDbdAkgDzcXe1uSLQYhjyG_AJIYYbprQCwtnFS7aTKTL-DevVGt20kZlrtJITimGetkXRr_WYDaF4FhzKOSFc-xfm4VzfRdiNYgJ8i0pMMn4PnfaYF7lCJLMAxxYEUKPO1wdvbfpXoAK8DLv4QGGWbA8tOR50OADgTYGR",
        alt: "Ancient Roman stone columns and ruined archways against a dark sky",
      },
    ],
    intro: [
      "This era marked a profound transformation of the region, evolving from a Roman province into a deeply significant center of the Byzantine Christian world. The landscape was reshaped with monumental basilicas, intricate mosaics, and bustling urban centers.",
      "The cultural synthesis of Greco-Roman traditions with local heritage created a unique artistic and intellectual flourishing, particularly evident in the detailed cartography and sophisticated rhetoric schools that emerged during this time.",
    ],
    timeline: [
      { label: "135 CE" },
      { label: "330 CE", active: true },
      { label: "638 CE" },
    ],
    widgets: [
      { label: "PRESERVATION STATUS", value: "UNESCO Heritage Verified Site", pulse: true },
      { label: "LOCATION CONTEXT", value: "Byzantine Holy Sites, Jerusalem District", icon: "location_on" },
    ],
    keyPoints: [
      { title: "The Transformation of Jerusalem" },
      { title: "The Madaba Map" },
      { title: "Urban Sophistication" },
      { title: "The Gaza School of Rhetoric" },
    ],
    daleelInsight:
      "Did you know that the Madaba Map is so detailed it shows the exact locations of the gates and streets of 6th century Jerusalem?",
    layout: "media-top",
  },
  {
    id: "islamic-golden-age",
    era: "ISLAMIC GOLDEN AGE",
    eraDates: "661 — 1258 CE",
    title: "Umayyad & Abbasid Splendor",
    subtitle: "The Rise of Science",
    pullQuote:
      "A pivotal era of cross-cultural innovation, where the pen became mightier than the sword, preserving ancient wisdom while creating the foundations of modern algebra and medicine.",
    hero: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzfzJlX3e7qMf1kWn1dIgD70Km3i_rktUx2nM2F1vo_3F5xqcQYezjaR44YEVyIrqwscfPHV7uXlZtt_PI_B2Rklg-EnZMwhosdYwConKU7A_pqd8lXHAI3Yr2wOCYW8-JAPls_zUhckr3NYRd1zpua0OLVqXdTpgfEvPeJdfI1crPZhOEBb2voDY4T0xsUAyGmsBUwyLSzePrUvV1eLqygI4HaSl12LUn2GT_rQng9CWRiXE2RLQfvT99UbUVjMu5p-FOb_F8ipMb",
      alt: "Cinematic photograph of Umayyad Great Mosque interior with gold geometric mosaics",
    },
    intro: [
      "A pivotal era of cross-cultural innovation. The Umayyad and Abbasid caliphates fostered a remarkable synthesis of Greek, Persian, Indian and indigenous traditions—producing breakthroughs in astronomy, mathematics, medicine and philosophy.",
    ],
    timeline: [
      { label: "661 CE" },
      { label: "750 CE", active: true },
      { label: "1258 CE" },
    ],
    widgets: [
      { label: "SCIENTIFIC INNOVATION", value: "House of Wisdom (Bayt al-Hikma) Records", pulse: true },
      { label: "LOCATION CONTEXT", value: "Umayyad Great Mosque, Damascus", icon: "location_on" },
    ],
    keyPoints: [
      { title: "Bayt al-Hikma", description: "The House of Wisdom in Baghdad as a cradle of translation and discovery." },
      { title: "Algebra & Medicine", description: "Foundational works by al-Khwārizmī and Ibn Sīnā." },
      { title: "Architectural Heritage", description: "The Great Mosque of Damascus and Dome of the Rock." },
    ],
    daleelInsight:
      "The word 'algorithm' is a Latinization of al-Khwārizmī, the 9th-century Abbasid mathematician.",
    layout: "scientific",
  },
  {
    id: "ottoman-century",
    era: "THE OTTOMAN CENTURY",
    eraDates: "1516 — 1917",
    title: "Stone-Walled Markets: The Soap & Olive Oil Legacy",
    pullQuote:
      "A period of enduring social fabric, where the scent of laurel and olive oil filled the bustling 'souks' of Nablus and Akka, fueling a golden age of regional industry.",
    hero: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBoVNcHWOxI9b7zCzWZQ9KQnYYP46CVPI8mn3TIix8gWj6Zp_R9YmgECxL9UelMK1j_ehsMQowjlydVmE5ZCqfiBntLIjGcBD8STH8pZ0Asa1xiQ-vzCE29_4oSGRIgY4Al0SYF5O6o0OHxw8qoUjzwNhQRpw219hpyFdE0tmn-QF6YYlpZ5iMwsqTCZBye4uWL2ecN57aEtyuHuo8LbYFFI4yjEoI71szDRU14H1oWXgFhh3Hme4BQRNemyG4jUczSoOvRXqWW0SB",
      alt: "High contrast historical photograph inside a traditional stone arched soap factory",
    },
    intro: [
      "Under four centuries of Ottoman rule, the region's economy and crafts flourished. Nablus rose as the world capital of olive-oil soap; Akka and Yaffa thrived as Mediterranean ports for grain, citrus and textiles.",
    ],
    timeline: [
      { label: "1516" },
      { label: "1850", active: true },
      { label: "1917" },
    ],
    widgets: [
      { label: "COMMERCIAL STATUS", value: "Guild Records & Export Logs Verified", pulse: true },
      { label: "LOCATION CONTEXT", value: "Old City, Nablus District", icon: "location_on" },
    ],
    keyPoints: [
      { title: "The Soap Industry", description: "Nablus laurel-and-olive soap exported across the Mediterranean." },
      { title: "Guild Networks", description: "Tightly-knit craft guilds preserved trade knowledge across generations." },
      { title: "Coastal Trade", description: "Akka and Yaffa as gateways for citrus and textile exports." },
    ],
    daleelInsight:
      "Nablus produced over half of the soap consumed in the Ottoman Empire by the mid-19th century.",
    layout: "editorial",
  },
];

// ---- Adapters / lookups ------------------------------------
export const getChapterById = (id?: string | null): Chapter | undefined =>
  CHAPTERS.find((c) => c.id === id);

export const getAdjacentChapters = (id: string) => {
  const idx = CHAPTERS.findIndex((c) => c.id === id);
  return {
    prev: idx > 0 ? CHAPTERS[idx - 1] : undefined,
    next: idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : undefined,
    index: idx,
    total: CHAPTERS.length,
  };
};
