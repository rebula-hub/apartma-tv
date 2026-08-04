// ============================================================
// KONFIGURACIJA — uredi spodnje nastavitve za vsak apartma
// Izbereš z URL parametrom: ?apt=1, ?apt=2, ... ?apt=6
// ============================================================

const ICONS = {
  wifi: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8.5c4-4 10-4 14 0"/><path d="M8.5 12a5 5 0 0 1 7 0"/><path d="M12 16v0"/><circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  guide: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-3-5-8-9-8-14a8 8 0 1 1 16 0c0 5-5 9-8 14z"/><circle cx="12" cy="7" r="2.5"/></svg>`,
  washing: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="3.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><path d="M7 7v-2M12 7v-2M17 7v-2" stroke-linecap="round"/></svg>`,
  apps: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="7" height="7" rx="1.5"/><rect x="2.5" y="14.5" width="7" height="7" rx="1.5"/><rect x="14.5" y="2.5" width="7" height="7" rx="1.5"/><rect x="14.5" y="14.5" width="7" height="7" rx="1.5"/></svg>`,
  netflix: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#E50914"><path d="M5.5 3h3l5 13.5L15.5 7 18 3h3l-7 18h-3.5z"/></svg>`,
  youtube: `<svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#FF0000"/><polygon points="13,10 13,22 23,16" fill="white"/></svg>`,
  spotify: `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#1DB954"/><circle cx="16" cy="16" r="11" fill="none" stroke="white" stroke-width="2"/></svg>`,
};

const APARTMENTS = [
  // --- Apartma 1 ---
  {
    id: 1,
    name: "Apartma Ob Morju",
    icalUrl: "https://www.bentral.com/service/icalendar/337a6b354e5638304d6a5578587a45314d7a4d34587a45314f546b4e.ics",
    wifi: {
      ssid: "Apartma-Guest",
      password: "dobrodosli2024",
      encryption: "WPA",
    },
    weather: { lat: 45.5475, lon: 13.7308 },
    apps: [
      { name: "Netflix", icon: ICONS.netflix, package: "com.netflix.ninja" },
      { name: "YouTube", icon: ICONS.youtube, package: "com.google.android.youtube.tv" },
      { name: "Spotify", icon: ICONS.spotify, package: "com.spotify.tv.android" },
    ],
    guideBook: `
      <h3>Local Recommendations</h3>
      <h4>Restaurants</h4>
      <ul>
        <li><strong>Gostilna Pri Ribiču</strong> — fresh fish, 5 min walk</li>
        <li><strong>Pizzerija Porto</strong> — excellent wood-fired pizza, 8 min walk</li>
        <li><strong>Sladoled Pri Miki</strong> — homemade ice cream, 3 min walk</li>
      </ul>
      <h4>Beaches</h4>
      <ul>
        <li><strong>Main beach</strong> — 5 min walk, sunbed rental</li>
        <li><strong>Hidden beach</strong> — 15 min walk along the coast, quieter</li>
      </ul>
      <h4>Shops</h4>
      <ul>
        <li><strong>Mercator</strong> — 10 min walk, open 8 AM–8 PM</li>
        <li><strong>Pharmacy</strong> — 12 min walk, opposite the post office</li>
      </ul>
    `,
    washingInstructions: `
      <h3>Washing Machine — Instructions</h3>
      <ol>
        <li>Turn on the machine with the <strong>ON/OFF</strong> button (top left).</li>
        <li>Select a program with the dial:
          <ul>
            <li><strong>Cotton 40°C</strong> — towels and bed linen</li>
            <li><strong>Synthetics 30°C</strong> — everyday clothes</li>
            <li><strong>Quick 30'</strong> — lightly soiled laundry</li>
          </ul>
        </li>
        <li>Put detergent in the <strong>left compartment</strong>, fabric softener in the <strong>middle compartment</strong>.</li>
        <li>Press <strong>START</strong>.</li>
        <li>After washing, leave the door open to dry.</li>
      </ol>
      <p><em>The dryer is in the bathroom, to the right of the washing machine.</em></p>
    `,
    cards: [
      { id: "wifi", title: "WiFi", icon: ICONS.wifi, type: "wifi", content: "" },
      { id: "guide", title: "Guide", icon: ICONS.guide, type: "html", content: "" },
      { id: "washing", title: "Washing machine", icon: ICONS.washing, type: "html", content: "" },
      { id: "apps", title: "Apps", icon: ICONS.apps, type: "apps", content: "" },
    ],
  },

  // --- Apartma 2 ---
  {
    id: 2,
    name: "Apartma 2",
    icalUrl: "https://www.bentral.com/service/icalendar/TVOJ-ICAL-URL-2.ics",
    wifi: { ssid: "Apartma2-Guest", password: "geslo2", encryption: "WPA" },
    weather: { lat: 45.5475, lon: 13.7308 },
    apps: [],
    guideBook: `<h3>Local Recommendations — Apt 2</h3><p>Edit in configs.js</p>`,
    washingInstructions: `<h3>Washing Machine — Apt 2</h3><p>Edit in configs.js</p>`,
    cards: [
      { id: "wifi", title: "WiFi", icon: ICONS.wifi, type: "wifi", content: "" },
      { id: "guide", title: "Guide", icon: ICONS.guide, type: "html", content: "" },
      { id: "washing", title: "Washing machine", icon: ICONS.washing, type: "html", content: "" },
      { id: "apps", title: "Apps", icon: ICONS.apps, type: "apps", content: "" },
    ],
  },

  // --- Apartma 3 ---
  {
    id: 3,
    name: "Apartma 3",
    icalUrl: "https://www.bentral.com/service/icalendar/TVOJ-ICAL-URL-3.ics",
    wifi: { ssid: "Apartma3-Guest", password: "geslo3", encryption: "WPA" },
    weather: { lat: 45.5475, lon: 13.7308 },
    apps: [],
    guideBook: `<h3>Local Recommendations — Apt 3</h3><p>Edit in configs.js</p>`,
    washingInstructions: `<h3>Washing Machine — Apt 3</h3><p>Edit in configs.js</p>`,
    cards: [
      { id: "wifi", title: "WiFi", icon: ICONS.wifi, type: "wifi", content: "" },
      { id: "guide", title: "Guide", icon: ICONS.guide, type: "html", content: "" },
      { id: "washing", title: "Washing machine", icon: ICONS.washing, type: "html", content: "" },
      { id: "apps", title: "Apps", icon: ICONS.apps, type: "apps", content: "" },
    ],
  },

  // --- Apartma 4 ---
  {
    id: 4,
    name: "Apartma 4",
    icalUrl: "https://www.bentral.com/service/icalendar/TVOJ-ICAL-URL-4.ics",
    wifi: { ssid: "Apartma4-Guest", password: "geslo4", encryption: "WPA" },
    weather: { lat: 45.5475, lon: 13.7308 },
    apps: [],
    guideBook: `<h3>Local Recommendations — Apt 4</h3><p>Edit in configs.js</p>`,
    washingInstructions: `<h3>Washing Machine — Apt 4</h3><p>Edit in configs.js</p>`,
    cards: [
      { id: "wifi", title: "WiFi", icon: ICONS.wifi, type: "wifi", content: "" },
      { id: "guide", title: "Guide", icon: ICONS.guide, type: "html", content: "" },
      { id: "washing", title: "Washing machine", icon: ICONS.washing, type: "html", content: "" },
      { id: "apps", title: "Apps", icon: ICONS.apps, type: "apps", content: "" },
    ],
  },

  // --- Apartma 5 ---
  {
    id: 5,
    name: "Apartma 5",
    icalUrl: "https://www.bentral.com/service/icalendar/TVOJ-ICAL-URL-5.ics",
    wifi: { ssid: "Apartma5-Guest", password: "geslo5", encryption: "WPA" },
    weather: { lat: 45.5475, lon: 13.7308 },
    apps: [],
    guideBook: `<h3>Local Recommendations — Apt 5</h3><p>Edit in configs.js</p>`,
    washingInstructions: `<h3>Washing Machine — Apt 5</h3><p>Edit in configs.js</p>`,
    cards: [
      { id: "wifi", title: "WiFi", icon: ICONS.wifi, type: "wifi", content: "" },
      { id: "guide", title: "Guide", icon: ICONS.guide, type: "html", content: "" },
      { id: "washing", title: "Washing machine", icon: ICONS.washing, type: "html", content: "" },
      { id: "apps", title: "Apps", icon: ICONS.apps, type: "apps", content: "" },
    ],
  },

  // --- Apartma 6 ---
  {
    id: 6,
    name: "Apartma 6",
    icalUrl: "https://www.bentral.com/service/icalendar/TVOJ-ICAL-URL-6.ics",
    wifi: { ssid: "Apartma6-Guest", password: "geslo6", encryption: "WPA" },
    weather: { lat: 45.5475, lon: 13.7308 },
    apps: [],
    guideBook: `<h3>Local Recommendations — Apt 6</h3><p>Edit in configs.js</p>`,
    washingInstructions: `<h3>Washing Machine — Apt 6</h3><p>Edit in configs.js</p>`,
    cards: [
      { id: "wifi", title: "WiFi", icon: ICONS.wifi, type: "wifi", content: "" },
      { id: "guide", title: "Guide", icon: ICONS.guide, type: "html", content: "" },
      { id: "washing", title: "Washing machine", icon: ICONS.washing, type: "html", content: "" },
      { id: "apps", title: "Apps", icon: ICONS.apps, type: "apps", content: "" },
    ],
  },
];
