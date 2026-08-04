// ============================================================
// TV DASHBOARD — script.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initApt();
  initLang();
  initSlideshow();
  initGreeting();
  renderCards();
  initWeather();
  initCardEffects();

  // Zapri jezikovni meni ob kliku izven
  document.addEventListener("click", (e) => {
    const bubble = document.getElementById("lang-bubble");
    const menu = document.getElementById("lang-menu");
    if (menu && bubble && !bubble.contains(e.target)) {
      menu.style.display = "none";
    }
  });
});

// ---------- Izbira apartmaja ----------

let apt;
let currentGuestName = null;

function initApt() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("apt")) || 1;
  apt = APARTMENTS.find(a => a.id === id) || APARTMENTS[0];

  apt.cards.forEach(c => {
    if (c.id === "guide") c.content = apt.guideBook;
    if (c.id === "washing") c.content = apt.washingInstructions;
  });
}

// ---------- Card hover glow ----------

function initCardEffects() {
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });
}

// ---------- Slideshow ----------

let slideshowTimer;
let slideshowImages = [];
let slideshowIdx = 0;
let slideshowActive = false;

async function initSlideshow() {
  try {
    const res = await fetch("galerija.json");
    if (!res.ok) return;
    const files = await res.json();
    if (!files.length) return;

    slideshowImages = files;
    showInitial();
    slideshowTimer = setInterval(nextSlide, 12000);
  } catch (e) {
    console.warn("Galerija ni na voljo");
  }
}

function showInitial() {
  const div = document.getElementById("slideshow");
  const file = slideshowImages[0];
  div.style.backgroundImage = `url(galerija/${encodeURI(file)})`;
  div.style.opacity = "1";
  document.getElementById("slideshow-label").textContent = formatLabel(file);
}

function nextSlide() {
  const nextIdx = (slideshowIdx + 1) % slideshowImages.length;
  const file = slideshowImages[nextIdx];

  const inactive = document.getElementById(slideshowActive ? "slideshow" : "slideshow-next");
  const active = document.getElementById(slideshowActive ? "slideshow-next" : "slideshow");

  inactive.style.backgroundImage = `url(galerija/${encodeURI(file)})`;
  inactive.style.opacity = "1";
  active.style.opacity = "0";

  slideshowIdx = nextIdx;
  slideshowActive = !slideshowActive;
  document.getElementById("slideshow-label").textContent = formatLabel(file);
}

function detectBrightness(file) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    document.body.classList.toggle("light-bg", brightness > 135);
  };
  img.src = `galerija/${encodeURI(file)}`;
}

function formatLabel(filename) {
  let name = filename.replace(/\.[^.]+$/, "");
  name = name.replace(/^\d+[-_\s]*/, "");
  return name
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ---------- Pozdrav / ime gosta ----------

async function initGreeting() {
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  if (urlName) {
    setGreeting(urlName);
    return;
  }

  const guestName = await fetchGuestFromIcal();
  setGreeting(guestName);
}

function setGreeting(name) {
  currentGuestName = name;
  const el = document.getElementById("greeting-text");
  if (name) {
    el.textContent = t("welcomeGuest", { name });
  } else {
    el.textContent = t("welcome", { name: apt.name });
  }
}

// ---------- Zasedenost / ime gosta ----------

const CHECKIN_HOUR = 11;
const GUEST_CACHE_KEY = "guest_name";
const GUEST_CACHE_TIME_KEY = "guest_name_time";

async function fetchGuestFromIcal() {
  const cached = getCachedGuest();
  if (cached !== null) {
    console.log("Uporabljam shranjeno ime gosta:", cached);
    return cached;
  }

  let name = null;

  // 1. bookings.json — generira GitHub Action, brez CORS-a
  try {
    const res = await fetch("bookings.json");
    if (res.ok) {
      const allBookings = await res.json();
      const bookings = allBookings[String(apt.id)] || [];
      name = findTodayGuest(bookings);
      if (name) console.log("Gost iz bookings.json:", name);
    }
  } catch (e) {
    console.warn("bookings.json ni na voljo");
  }

  // 2. Fallback: iCal prek native bridge (Android WebView)
  if (!name) {
    name = await fetchGuestViaIcal();
  }

  cacheGuest(name);
  return name;
}

function getCachedGuest() {
  const name = localStorage.getItem(GUEST_CACHE_KEY);
  const time = localStorage.getItem(GUEST_CACHE_TIME_KEY);
  if (name === null || time === null) return null;

  const cachedAt = new Date(parseInt(time, 10));
  const now = new Date();

  if (cachedAt.getFullYear() !== now.getFullYear()) return null;
  if (cachedAt.getMonth() !== now.getMonth()) return null;
  if (cachedAt.getDate() !== now.getDate()) return null;

  const cachedBefore = cachedAt.getHours() < CHECKIN_HOUR;
  const nowBefore = now.getHours() < CHECKIN_HOUR;
  if (cachedBefore !== nowBefore) return null;

  return name;
}

function cacheGuest(name) {
  if (name) {
    localStorage.setItem(GUEST_CACHE_KEY, name);
    localStorage.setItem(GUEST_CACHE_TIME_KEY, String(Date.now()));
  }
}

function findTodayGuest(bookings) {
  const today = toDateStr(new Date());
  for (const b of bookings) {
    if (today >= b.start && today < b.end) {
      return b.name;
    }
  }
  return null;
}

// ---------- iCal parsing (fallback za Android native bridge) ----------

async function fetchGuestViaIcal() {
  const raw = await fetchIcalNative();
  if (!raw) return null;
  return parseGuestName(raw);
}

async function fetchIcalNative() {
  if (typeof ApartmaBridge === "undefined" || !ApartmaBridge.fetchIcal) {
    return null;
  }
  try {
    return await ApartmaBridge.fetchIcal(apt.icalUrl);
  } catch (e) {
    console.error("Native bridge napaka:", e);
    return null;
  }
}

function parseGuestName(icalText) {
  const now = new Date();
  const today = toDateStr(now);

  const events = icalText.split("BEGIN:VEVENT").slice(1);

  for (const block of events) {
    const endIdx = block.indexOf("END:VEVENT");
    const vevent = endIdx !== -1 ? block.substring(0, endIdx) : block;

    const dtstart = extractIcalProp(vevent, "DTSTART");
    const dtend = extractIcalProp(vevent, "DTEND");
    const summary = extractIcalProp(vevent, "SUMMARY");

    if (!dtstart || !dtend || !summary) continue;
    if (summary === "Not available") continue;

    const startDay = dtstart.substring(0, 8);
    const endDay = dtend.substring(0, 8);

    if (today >= startDay && today < endDay) {
      return summary.split(",")[0].trim();
    }
  }

  return null;
}

function extractIcalProp(text, propName) {
  const regex = new RegExp(`^${propName}(?:;.*?)?:(.+)$`, "m");
  const match = text.match(regex);
  if (!match) return null;
  return match[1].trim();
}

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

// ---------- Kartice ----------

function renderCards() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  apt.cards.forEach((card) => {
    const el = document.createElement("div");
    el.className = "card";
    el.setAttribute("data-card-id", card.id);
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", card.title);
    el.innerHTML = `
      <span class="card-icon">${card.icon}</span>
      <span class="card-title">${t(card.id)}</span>
    `;
    el.addEventListener("click", () => openCard(card));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCard(card);
      }
    });
    container.appendChild(el);
  });
}

function openCard(card) {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");

  if (card.type === "wifi") {
    content.innerHTML = buildWifiContent();
    overlay.classList.add("active");
    setTimeout(() => renderWifiQR(), 50);
  } else if (card.type === "apps") {
    content.innerHTML = buildAppsContent();
    overlay.classList.add("active");
  } else {
    content.innerHTML = card.content;
    overlay.classList.add("active");
  }
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("active");
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---------- WiFi / QR koda ----------

function buildWifiContent() {
  return `
    <h3>${t("wifiTitle")}</h3>
    <div class="wifi-center">
      <div class="wifi-ssid">📶 ${apt.wifi.ssid}</div>
      <div class="wifi-pass">${t("wifiPassword")}: ${apt.wifi.password}</div>
    </div>
    <div class="wifi-qr" id="wifi-qr-container"></div>
    <p style="text-align:center;color:var(--dim);margin-top:14px;font-size:14px;">
      ${t("wifiScan")}
    </p>
  `;
}

function renderWifiQR() {
  const container = document.getElementById("wifi-qr-container");
  if (!container) return;

  let wifiString;
  if (apt.wifi.encryption === "nopass") {
    wifiString = `WIFI:T:nopass;S:${apt.wifi.ssid};;`;
  } else {
    wifiString = `WIFI:T:${apt.wifi.encryption};S:${apt.wifi.ssid};P:${apt.wifi.password};;`;
  }

  const img = document.createElement("img");
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(wifiString)}`;
  img.alt = "WiFi QR koda";
  img.width = 200;
  img.height = 200;
  img.style.borderRadius = "12px";
  img.style.background = "white";
  img.style.padding = "12px";
  img.onerror = function () {
    container.innerHTML = `<p style="color:var(--dim);text-align:center;">${t("qrUnavailable")}</p>`;
  };
  container.innerHTML = "";
  container.appendChild(img);
}

// ---------- Aplikacije ----------

function buildAppsContent() {
  if (!apt.apps || apt.apps.length === 0) {
    return `<h3>${t("appsTitle")}</h3><p style="color:var(--dim)">${t("appsEmpty")}</p>`;
  }

  let html = `<h3>${t("appsTitle")}</h3><div class='apps-grid'>`;
  apt.apps.forEach(app => {
    html += `
      <button class="app-btn" onclick="launchApp('${app.package}')" aria-label="${app.name}">
        <span class="app-icon">${app.icon}</span>
        <span class="app-name">${app.name}</span>
      </button>`;
  });
  html += "</div>";
  return html;
}

function launchApp(packageName) {
  const fk = typeof fully !== "undefined" ? fully : (typeof window.fully !== "undefined" ? window.fully : null);

  if (fk && typeof fk.startApplication === "function") {
    fk.startApplication(packageName);
    return;
  }

  try {
    window.location.href = "intent://#Intent;package=" + packageName + ";end";
  } catch (e) {
    console.warn("App launch failed:", e);
  }
}

// ---------- Vreme (Open-Meteo API, brezplačno) ----------

let currentWeatherCode = null;

const WEATHER_CODES = {
  0: { icon: "☀️", label: "Jasno" },
  1: { icon: "🌤️", label: "Pretežno jasno" },
  2: { icon: "⛅", label: "Delno oblačno" },
  3: { icon: "☁️", label: "Oblačno" },
  45: { icon: "🌫️", label: "Megla" },
  48: { icon: "🌫️", label: "Megla" },
  51: { icon: "🌦️", label: "Rahlo rosenje" },
  53: { icon: "🌦️", label: "Zmerno rosenje" },
  55: { icon: "🌧️", label: "Močno rosenje" },
  56: { icon: "🌧️", label: "Ledeno rosenje" },
  57: { icon: "🌧️", label: "Močno ledeno rosenje" },
  61: { icon: "🌧️", label: "Rahlo dežuje" },
  63: { icon: "🌧️", label: "Zmerno dežuje" },
  65: { icon: "🌧️", label: "Močno dežuje" },
  66: { icon: "🌧️", label: "Ledeni dež" },
  67: { icon: "🌧️", label: "Močan ledeni dež" },
  71: { icon: "🌨️", label: "Rahlo sneži" },
  73: { icon: "🌨️", label: "Zmerno sneži" },
  75: { icon: "❄️", label: "Močno sneži" },
  77: { icon: "❄️", label: "Snežna zrna" },
  80: { icon: "🌦️", label: "Ploha" },
  81: { icon: "🌧️", label: "Zmerna ploha" },
  82: { icon: "⛈️", label: "Močna ploha" },
  85: { icon: "🌨️", label: "Snežna ploha" },
  86: { icon: "❄️", label: "Močna snežna ploha" },
  95: { icon: "⛈️", label: "Nevihta" },
  96: { icon: "⛈️", label: "Nevihta s točo" },
  99: { icon: "⛈️", label: "Močna nevihta s točo" },
};

function getWeatherIcon(code) {
  return WEATHER_CODES[code] || { icon: "❓" };
}

function getWeatherLabel(code) {
  const codes = LANG[currentLang]?.weatherCodes || LANG.en.weatherCodes;
  return codes[code] || "Unknown";
}

function getDayName(idx) {
  const days = LANG[currentLang]?.days || LANG.en.days;
  return days[idx] || "";
}

const DANI = ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"];

async function initWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${apt.weather.lat}&longitude=${apt.weather.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Napaka pri nalaganju vremena");

    const data = await res.json();
    renderCurrentWeather(data.current);
    renderForecast(data.daily);
    updateLocation(data);
  } catch (err) {
    console.error("Weather error:", err);
    showWeatherError();
  }
}

function renderCurrentWeather(current) {
  document.getElementById("weather-loading").style.display = "none";
  const panel = document.getElementById("weather-current");
  panel.style.display = "";
  currentWeatherCode = current.weather_code;
  updateWeatherLabels();

  const w = getWeatherIcon(current.weather_code);
  document.getElementById("weather-icon").textContent = w.icon;
  document.getElementById("weather-temp").textContent = `${Math.round(current.temperature_2m)}°`;
  document.getElementById("weather-desc").textContent = getWeatherLabel(current.weather_code);
  document.getElementById("weather-humidity").textContent = `${current.relative_humidity_2m}%`;
  document.getElementById("weather-wind").textContent = `${current.wind_speed_10m} km/h`;
  document.getElementById("weather-feels").textContent = `${Math.round(current.apparent_temperature)}°`;
}

function renderForecast(daily) {
  const container = document.getElementById("weather-forecast");
  container.innerHTML = "";

  for (let i = 0; i < daily.time.length; i++) {
    const date = new Date(daily.time[i] + "T12:00:00");
    const dayName = getDayName(date.getDay());
    const w = getWeatherIcon(daily.weather_code[i]);
    const max = Math.round(daily.temperature_2m_max[i]);
    const min = Math.round(daily.temperature_2m_min[i]);

    const el = document.createElement("div");
    el.className = "forecast-day";
    el.innerHTML = `
      <span class="forecast-day-name">${dayName}</span>
      <span class="forecast-day-icon">${w.icon}</span>
      <span class="forecast-day-temp">${max}° / ${min}°</span>
    `;
    container.appendChild(el);
  }
}

function updateLocation(data) {
  const el = document.getElementById("weather-location");
  const tz = data.timezone || "Europe/Ljubljana";
  const city = tz.replace("_", " ").split("/").pop() || tz;
  el.textContent = city;
}

function showWeatherError() {
  document.getElementById("weather-loading").textContent = t("weatherUnavailable");
}
