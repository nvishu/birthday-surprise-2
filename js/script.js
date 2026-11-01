/* =========================================================
   EDIT EVERYTHING HERE
   ========================================================= */
const CONFIG = {
  nickname: "Kuku",
  fullName: "Shukla",
  password: "kuku",                    // not case-sensitive
  signOff: "Nishant",
  birthday: "2026-11-03T00:00:00",     // 3 November 2026
  turningAge: 31,
  metDate: "2026-01-01T00:00:00",      // CHANGE to the exact day she joined your project

    photoCount: 42,                      // gallery checks pic1..pic42; missing ones are skipped
  heroPhoto: "pic1",
  letterPhoto: "pic2",
  puzzlePhoto: "pic3",
  memoryPhotos: ["pic1", "pic2", "pic3", "pic4", "pic5", "pic6","pic7","pic8","pic9","pic10","pic11"],
  captions: [],                        // optional: ["caption for pic1", "caption for pic2", ...]

  timeline: [
    { date: "January 2026", title: "The day you joined the project", photo: "pic2",
      text: "A new name on the team list. I had no idea it would become my favourite name." },
    { date: "Early 2026", title: "Our first real conversation", photo: "pic3",
      text: "It started with work and somehow never ended. I still remember how easy it felt to talk to you." },
    { date: "2026", title: "Tea breaks became our thing", photo: "pic4",
      text: "Suddenly every break was the best part of my day, because you were in it." },
    { date: "2026", title: "Long days, never alone", photo: "pic5",
      text: "Late calls, endless meetings, crazy deadlines. Somehow everything felt lighter when you were on the other side." },
    { date: "2026", title: "Our first lunch together", photo: "pic6",
      text: "I pretended it was just lunch. It wasn't. I didn't want that hour to end." },
    { date: "2026", title: "The day I knew", photo: "pic7",
      text: "Somewhere between the meetings and the laughter, I realised I was falling for you." },
    { date: "2026", title: "That after party night", photo: "pic8",
      text: "When I dropped you back, you said \"Achha ladka h tu\". I smiled all the way home, and I still do when I think about it." },
    { date: "2026", title: "Little messages, big smiles", photo: "pic9",
      text: "A random text from you could fix my whole day. My phone has never been my favourite thing like it is now." },
    { date: "2026", title: "Ordinary days, favourite memories", photo: "pic10",
      text: "No big plans, no special place. Just you and me, and somehow those became the moments I treasure most." },
    { date: "3 November 2026", title: "Your first birthday with me", photo: "pic11",
      text: "The first of many birthdays I hope to celebrate by your side." }
  ],

  reasons: [
    "Your smile makes even the longest workday feel short.",
    "You laugh at my jokes, even the really bad ones.",
    "Your kindness to everyone around you.",
    "You make Mondays bearable. That is a superpower.",
    "The way you say my name.",
    "You are smart, and you make me want to be better.",
    "You care about the little things, and about me.",
    "Because you are simply you, and that is more than enough."
  ],

  quiz: [
    { q: "Where did we first meet?", options: ["In a cafe", "In the office", "Through friends", "On Instagram"], answer: 1 },
    { q: "When did you join my project?", options: ["December 2025", "January 2026", "March 2026", "I don't remember"], answer: 1 },
    { q: "What do I always call you?", options: ["Baby", "Cutie", "Kuku", "Boss"], answer: 2 },
    { q: "What was the things which I loved about you?", options: ["Your smile", "Your laptop stickers", "Your voice", "Everything"], answer: 3 },
    { q: "Who is the luckiest person ?", options: ["Kuku", "Both of us", "Nobody", "Nishant, obviously"], answer: 3 },
    { q: "Do you remember what you told me on after party when I drop you room and leaving?", options: ["NO", "Achha ladka h tu", "room jake call karna", "room jao"], answer: 1 }
  ],

  wheelAnswers: [
    "Nishant will do all the task whatever you ask for today",
    "You win unlimited rights to steal Nishant's times.",
    "Nishant must agree with you in every argument for 24 hours.",
    "Nishant changes his Teams status to 'Kuku is the best' for a whole day.",
    "Congratulations, you won... more Nishant. No refunds, no returns.",
    "Nishant must text you 'You were right' every day for a week.",
    "Your prize: a hug so long it becomes awkward.",
    "Nishant will ask you out for whole day, with most beautiful way.",
    "Today's forecast: 100% chance of Nishant being annoying.",
    "You are officially the boss. (Nishant never was.)",
    "Nishant must laugh at all your jokes today. He already does anyway.",
    "The wheel is shy. It says: spin again."
  ],

  scratchMessage: "You are my favourite person, at work and everywhere else.<br><br>Dinner date this weekend is on me.",

  letter: `My dear Kuku,

Happy birthday to the most beautiful person I know.

When you joined our project in January, I thought I was just getting a new teammate. I never imagined you would become the best part of every single day of my life.

Thank you for your beautiful smile, your patience, your laughter, and for making ordinary days feel special. You turned meetings into memories and tea breaks into moments I look forward to.

I love the way you asking my name, enjoy your day!

This is your first birthday with me, and I hope it is the first of many. Whatever this new year brings, I want to be right there beside you, cheering the loudest.

Never forget how loved you are.`
};

/* =========================================================
   HELPERS
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ordinal = n => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const IS_MOBILE = matchMedia("(max-width: 700px)").matches;
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Images: supports jpg, png, jpeg (any case) */
const EXTENSIONS = ["jpg", "png", "jpeg", "JPG", "PNG", "JPEG"];
const imgCache = {};
function resolveImage(name) {
  if (imgCache[name]) return imgCache[name];
  imgCache[name] = new Promise(resolve => {
    let i = 0;
    const tryNext = () => {
      if (i >= EXTENSIONS.length) return resolve(null);
      const src = `pictures/${name}.${EXTENSIONS[i++]}`;
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = tryNext;
      img.src = src;
    };
    tryNext();
  });
  return imgCache[name];
}
function placeholderSrc(name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#ffd6e3"/><text x="50%" y="47%" font-family="Arial" font-size="40" fill="#e8467c" text-anchor="middle">&#10084;</text><text x="50%" y="60%" font-family="Arial" font-size="18" fill="#a8285a" text-anchor="middle">pictures/${name}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
async function setImage(el, name) {
  el.src = (await resolveImage(name)) || placeholderSrc(name);
}

/* =========================================================
   RESULTS -> EMAIL
   ========================================================= */
const MAIL_ENDPOINT = "https://formsubmit.co/ajax/nishantvishu55@gmail.com";
const RESULTS = {
  openedAt: null, passwordAttempts: 0, candlesBlown: false,
  memory: null, quiz: [], quizScore: null, hearts: null, puzzle: null,
  wheel: [], scratch: false, letterRead: false, finalSurprise: false
};
let finalSent = false, partialSent = false;

function buildReport(isFinal) {
  const r = RESULTS, now = new Date();
  const done = [r.memory, r.quizScore, r.hearts, r.puzzle, r.wheel.length ? 1 : null, r.scratch || null]
    .filter(v => v !== null && v !== false).length;
  const report = {
    _subject: `Kuku's birthday surprise - ${isFinal ? "complete results" : "partial results"}`,
    _template: "table",
    "Report": isFinal ? "Final (she opened the last surprise)" : "Partial (page closed before the end)",
    "Opened at": r.openedAt ? r.openedAt.toLocaleString("en-GB") : "-",
    "Sent at": now.toLocaleString("en-GB"),
    "Time spent": r.openedAt ? Math.round((now - r.openedAt) / 60000) + " min" : "-",
    "Wrong password attempts": r.passwordAttempts,
    "Candles blown": r.candlesBlown ? "Yes, wish made" : "No",
    "Games completed": `${done} / 6`,
    "Memory game": r.memory ?? "Not completed",
    "Quiz score": r.quizScore ?? "Not completed",
    "Catch hearts (best)": r.hearts !== null ? r.hearts + " hearts" : "Not played",
    "Puzzle": r.puzzle ?? "Not solved",
    "Wheel prizes": r.wheel.length ? r.wheel.join(" | ") : "Not spun",
    "Scratch card": r.scratch ? "Revealed" : "Not revealed",
    "Letter": r.letterRead ? "Read completely" : "Not finished",
    "Final surprise": r.finalSurprise ? "Opened" : "Not opened",
    "Device": navigator.userAgent
  };
  r.quiz.forEach((a, i) => {
    report[`Quiz Q${i + 1}`] = `${a.q} -> ${a.chosen} ${a.correct ? "(correct)" : `(wrong, answer: ${a.right})`}`;
  });
  return report;
}

function sendResults(isFinal) {
  if (!unlocked || finalSent) return;
  if (!isFinal && partialSent) return;
  if (isFinal) finalSent = true; else partialSent = true;
  fetch(MAIL_ENDPOINT, {
    method: "POST", keepalive: true,
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(buildReport(isFinal))
  }).catch(() => { if (isFinal) finalSent = false; else partialSent = false; });
}

/* Backup: partial report if she leaves before the end (only if she played something) */
document.addEventListener("visibilitychange", () => {
  const played = RESULTS.quiz.length || RESULTS.memory || RESULTS.hearts !== null || RESULTS.puzzle || RESULTS.wheel.length || RESULTS.scratch;
  if (document.visibilityState === "hidden" && played && !finalSent) sendResults(false);
});


/* Small win sound (no file needed) */
let actx;
function ding(freq = 880) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.15, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.4);
    o.connect(g).connect(actx.destination);
    o.start(); o.stop(actx.currentTime + 0.4);
  } catch (e) {}
}

/* =========================================================
   MUSIC (different song per section)
   ========================================================= */
const MAX_VOL = 0.7;
const player = new Audio();
player.loop = true;
let currentSong = null, musicOn = true, fadeTimer, unlocked = false;

function fadeTo(target, cb) {
  clearInterval(fadeTimer);
  const start = player.volume, steps = 15; let i = 0;
  fadeTimer = setInterval(() => {
    i++;
    try { player.volume = Math.min(1, Math.max(0, start + (target - start) * i / steps)); } catch (e) {}
    if (i >= steps) { clearInterval(fadeTimer); cb && cb(); }
  }, 40);
}
function playSong(n) {
  if (n === currentSong) return;
  currentSong = n;
  if (!musicOn) return;
  fadeTo(0, () => {
    player.src = `audio/song${n}.mp3`;
    player.play().catch(() => {});
    fadeTo(MAX_VOL);
  });
}
$("#music-btn").onclick = () => {
  musicOn = !musicOn;
  $("#music-btn").classList.toggle("muted", !musicOn);
  if (musicOn) {
    if (!player.src.endsWith(`song${currentSong}.mp3`)) player.src = `audio/song${currentSong}.mp3`;
    player.play().catch(() => {});
    fadeTo(MAX_VOL);
  } else {
    fadeTo(0, () => player.pause());
  }
};
const musicObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting && unlocked) playSong(+e.target.dataset.song); });
}, { rootMargin: "-45% 0px -45% 0px" });
$$("section[data-song]").forEach(s => musicObserver.observe(s));

/* =========================================================
   CONFETTI
   ========================================================= */
const cCanvas = $("#confetti"), cctx = cCanvas.getContext("2d");
let particles = [], confettiRunning = false;
function resizeConfetti() { cCanvas.width = innerWidth; cCanvas.height = innerHeight; }
resizeConfetti(); addEventListener("resize", resizeConfetti);
const GLYPHS = { heart: "\u2764", flower: "\u273F", star: "\u2726" };
function burstConfetti(count = 150) {
  if (IS_MOBILE) count = Math.round(count * 0.6);
  const colors = ["#e8467c", "#ffd6e3", "#d9a441", "#a8285a", "#ffffff", "#f9a8c2"];
  const shapes = ["rect", "rect", "circle", "heart", "flower", "star"];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * cCanvas.width, y: -20 - Math.random() * cCanvas.height * 0.5,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, size: 14 + Math.random() * 12,
      vx: Math.random() * 2 - 1, vy: 2 + Math.random() * 3,
      rot: Math.random() * 6, vr: Math.random() * 0.2 - 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
}
function drawConfetti() {
  cctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot);
    cctx.fillStyle = p.color;
    if (p.shape === "rect") cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    else if (p.shape === "circle") { cctx.beginPath(); cctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); cctx.fill(); }
    else {
      cctx.font = `${p.size}px Arial`; cctx.textAlign = "center"; cctx.textBaseline = "middle";
      cctx.fillText(GLYPHS[p.shape], 0, 0);
    }
    cctx.restore();
  });
  particles = particles.filter(p => p.y < cCanvas.height + 20);
  if (particles.length) requestAnimationFrame(drawConfetti);
  else { confettiRunning = false; cctx.clearRect(0, 0, cCanvas.width, cCanvas.height); }
}

/* =========================================================
   BACKGROUND HEARTS, FLOWERS, SPARKLES & REVEAL
   ========================================================= */
const bgLayer = $("#hearts-bg");
const DECOR = ["&#10084;", "&#10084;", "&#128150;", "&#127800;", "&#127799;", "&#127801;", "&#10047;", "&#10048;"];
const floatCount = REDUCED ? 0 : IS_MOBILE ? 16 : 30;
for (let i = 0; i < floatCount; i++) {
  const h = document.createElement("span");
  h.className = "bg-float";
  h.innerHTML = DECOR[Math.floor(Math.random() * DECOR.length)];
  h.style.left = Math.random() * 100 + "%";
  h.style.fontSize = (IS_MOBILE ? 12 : 14) + Math.random() * (IS_MOBILE ? 18 : 26) + "px";
  h.style.animationDuration = 10 + Math.random() * 14 + "s";
  h.style.animationDelay = -Math.random() * 20 + "s";
  h.style.setProperty("--sway", (Math.random() * 80 - 40).toFixed(0) + "px");
  bgLayer.appendChild(h);
}
const sparkCount = REDUCED ? 0 : IS_MOBILE ? 18 : 35;
for (let i = 0; i < sparkCount; i++) {
  const s = document.createElement("span");
  s.className = "sparkle"; s.innerHTML = "&#10022;";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.fontSize = 8 + Math.random() * 12 + "px";
  s.style.animationDelay = -Math.random() * 3 + "s";
  s.style.animationDuration = 2 + Math.random() * 2 + "s";
  bgLayer.appendChild(s);
}

/* Tap anywhere: small burst of hearts and flowers */
const TAP_GLYPHS = ["&#10084;", "&#127800;", "&#10022;", "&#127799;", "&#10047;"];
document.addEventListener("pointerdown", e => {
  if (REDUCED || document.body.classList.contains("locked")) return;
  if (e.target.closest("#scratch, #hearts-area")) return;   // don't disturb the games
  for (let i = 0; i < 6; i++) {
    const s = document.createElement("span");
    s.className = "tap-sprinkle";
    s.innerHTML = TAP_GLYPHS[Math.floor(Math.random() * TAP_GLYPHS.length)];
    s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
    const ang = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 50;
    s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    s.style.setProperty("--dy", Math.sin(ang) * dist + "px");
    document.body.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }
}, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });


/* =========================================================
   LOCK SCREEN
   ========================================================= */
$("#lock-input").focus();
$("#lock-form").onsubmit = e => {
  e.preventDefault();
  const val = $("#lock-input").value.trim().toLowerCase();
  if (val === CONFIG.password.toLowerCase()) unlock();
  else {
    $("#lock-error").textContent = "Not quite... think about what I call you.";
    const card = $(".lock-card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
  }
};
function unlock() {
  unlocked = true;
  currentSong = 1;
  player.src = "audio/song1.mp3";
  try { player.volume = 0; } catch (e) {}
  player.play().catch(() => {});
  fadeTo(MAX_VOL);
  $("#lock").classList.add("hide");
  document.body.classList.remove("locked");
  burstConfetti(220);
}

/* =========================================================
   HOME: countdown, cake, days together
   ========================================================= */
setImage($("#hero-img"), CONFIG.heroPhoto);
$("#footer-name").textContent = CONFIG.signOff;

function updateTimers() {
  const now = new Date();
  const diff = new Date(CONFIG.birthday) - now;
  if (diff > 0) {
    $("#hero-sub").textContent = "Counting down every second to your special day";
    $("#cd-days").textContent = Math.floor(diff / 86400000);
    $("#cd-hours").textContent = Math.floor(diff / 3600000) % 24;
    $("#cd-mins").textContent = Math.floor(diff / 60000) % 60;
    $("#cd-secs").textContent = Math.floor(diff / 1000) % 60;
  } else {
    $("#countdown").style.display = "none";
    $("#hero-sub").textContent = `It's finally here. Happy ${ordinal(CONFIG.turningAge)} birthday, my love. Today is all about you.`;
  }
  const days = Math.max(0, Math.floor((now - new Date(CONFIG.metDate)) / 86400000));
  $("#days-together").textContent = days;
}
updateTimers(); setInterval(updateTimers, 1000);

$$(".candle").forEach(c => c.onclick = () => {
  if (c.classList.contains("out")) return;
  c.classList.add("out"); ding(660);
  if ($$(".candle.out").length === $$(".candle").length) {
    $("#cake-msg").textContent = "Your wish is on its way. Happy birthday, Kuku!";
    burstConfetti(250); ding(1046);
  }
});

/* =========================================================
   TIMELINE
   ========================================================= */
CONFIG.timeline.forEach(item => {
  const div = document.createElement("div");
  div.className = "tl-item reveal";
  div.innerHTML = `<div class="tl-dot"></div>
    <div class="tl-card"><img alt="">
      <span class="tl-date">${item.date}</span><h3>${item.title}</h3><p>${item.text}</p></div>`;
  setImage(div.querySelector("img"), item.photo);
  $("#timeline").appendChild(div);
  revealObserver.observe(div);
});

/* =========================================================
   GALLERY + LIGHTBOX
   ========================================================= */
const galleryItems = [];
let lbIndex = 0;
(async function buildGallery() {
  const grid = $("#gallery-grid");
  const srcs = await Promise.all(Array.from({ length: CONFIG.photoCount }, (_, i) => resolveImage("pic" + (i + 1))));
  srcs.forEach((src, i) => {
    if (!src) return;
    const idx = galleryItems.length;
    const caption = CONFIG.captions[i] || "";
    galleryItems.push({ src, caption });
    const el = document.createElement("div");
    el.className = "polaroid";
    el.style.setProperty("--r", (Math.random() * 8 - 4).toFixed(1) + "deg");
    el.style.animationDelay = idx * 0.08 + "s";
    el.innerHTML = `<img src="${src}" alt="" loading="lazy"><p>${caption || "&#10084;"}</p>`;
    el.onclick = () => openLightbox(idx);
    grid.appendChild(el);
  });
  if (!galleryItems.length) grid.innerHTML = '<p class="empty">Add photos to the pictures folder (pic1.jpg, pic2.png, ...)</p>';
})();
function openLightbox(i) {
  lbIndex = (i + galleryItems.length) % galleryItems.length;
  $("#lb-img").src = galleryItems[lbIndex].src;
  $("#lb-caption").textContent = galleryItems[lbIndex].caption;
  $("#lightbox").classList.add("show");
}
$(".lb-close").onclick = () => $("#lightbox").classList.remove("show");
$(".lb-prev").onclick = e => { e.stopPropagation(); openLightbox(lbIndex - 1); };
$(".lb-next").onclick = e => { e.stopPropagation(); openLightbox(lbIndex + 1); };
$("#lightbox").onclick = e => { if (e.target.id === "lightbox") $("#lightbox").classList.remove("show"); };

/* =========================================================
   REASONS
   ========================================================= */
CONFIG.reasons.forEach((r, i) => {
  const el = document.createElement("div");
  el.className = "reason reveal";
  el.innerHTML = `<div class="reason-inner">
      <div class="reason-face reason-front"><div class="big">&#10084;</div><span>Reason #${i + 1}</span></div>
      <div class="reason-face reason-back"><p>${r}</p></div></div>`;
  el.onclick = () => { el.classList.toggle("flipped"); ding(990); };
  $("#reasons-grid").appendChild(el);
  revealObserver.observe(el);
});

/* =========================================================
   GAME TABS
   ========================================================= */
$$(".tab").forEach(t => t.onclick = () => {
  $$(".tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  $$(".game-panel").forEach(p => p.classList.remove("active"));
  $("#game-" + t.dataset.game).classList.add("active");
});
function winMessage(sel, text) {
  $(sel).textContent = text;
  burstConfetti(160); ding(1046);
}

/* ---------- 1. MEMORY ---------- */
let memFirst = null, memLock = false, memMoves = 0, memMatched = 0;
async function initMemory() {
  const board = $("#memory-board");
  board.innerHTML = ""; memFirst = null; memLock = false; memMoves = 0; memMatched = 0;
  $("#mem-moves").textContent = 0; $("#mem-msg").textContent = "";
  const srcs = await Promise.all(CONFIG.memoryPhotos.map(n => resolveImage(n).then(s => s || placeholderSrc(n))));
  const cards = shuffle([...srcs.map((s, i) => ({ s, id: i })), ...srcs.map((s, i) => ({ s, id: i }))]);
  cards.forEach(c => {
    const el = document.createElement("div");
    el.className = "m-card"; el.dataset.id = c.id;
    el.innerHTML = `<div class="m-inner"><div class="m-face m-front">&#10084;</div>
      <div class="m-face m-back"><img src="${c.s}" alt=""></div></div>`;
    el.onclick = () => flipMemory(el);
    board.appendChild(el);
  });
}
function flipMemory(el) {
  if (memLock || el.classList.contains("flipped")) return;
  el.classList.add("flipped");
  if (!memFirst) { memFirst = el; return; }
  memMoves++; $("#mem-moves").textContent = memMoves;
  if (memFirst.dataset.id === el.dataset.id) {
    memFirst.classList.add("matched"); el.classList.add("matched");
    memFirst = null; memMatched++; ding(880);
    if (memMatched === CONFIG.memoryPhotos.length)
      winMessage("#mem-msg", `All matched in ${memMoves} moves. Just like us, a perfect match.`);
  } else {
    memLock = true;
    const a = memFirst; memFirst = null;
    setTimeout(() => { a.classList.remove("flipped"); el.classList.remove("flipped"); memLock = false; }, 900);
  }
}
$("#mem-restart").onclick = initMemory;
initMemory();

/* ---------- 2. QUIZ ---------- */
let qi = 0, qScore = 0;
function renderQuiz() {
  const box = $("#quiz-box"), total = CONFIG.quiz.length;
  if (qi >= total) {
    const msg = qScore === total ? "Perfect score. You know us better than anyone."
      : qScore >= total / 2 ? "Not bad at all. I still love you completely."
      : "Hmm... we clearly need more dates to study.";
    box.innerHTML = `<h3>You scored ${qScore} / ${total}</h3><p class="game-msg">${msg}</p>
      <button class="btn" id="quiz-restart">Play again</button>`;
    if (qScore === total) { burstConfetti(160); ding(1046); }
    $("#quiz-restart").onclick = () => { qi = 0; qScore = 0; renderQuiz(); };
    return;
  }
  const q = CONFIG.quiz[qi];
  box.innerHTML = `<p class="quiz-progress">Question ${qi + 1} of ${total}</p><h3>${q.q}</h3>
    <div class="quiz-options">${q.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o}</button>`).join("")}</div>`;
  const opts = box.querySelectorAll(".quiz-opt");
  opts.forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    opts.forEach(x => x.disabled = true);
    if (i === q.answer) { b.classList.add("correct"); qScore++; ding(880); }
    else { b.classList.add("wrong"); opts[q.answer].classList.add("correct"); ding(300); }
    setTimeout(() => { qi++; renderQuiz(); }, 1200);
  });
}
renderQuiz();

/* ---------- 3. CATCH THE HEARTS ---------- */
let chScore = 0, chTime = 30, chTimer, chSpawn, chRunning = false;
function startHearts() {
  const area = $("#hearts-area");
  area.innerHTML = "";
  chScore = 0; chTime = 30; chRunning = true;
  $("#ch-score").textContent = 0; $("#ch-time").textContent = 30; $("#ch-msg").textContent = "";
  $("#ch-start").disabled = true;
  chSpawn = setInterval(spawnHeart, 550);
  chTimer = setInterval(() => {
    chTime--; $("#ch-time").textContent = chTime;
    if (chTime <= 0) endHearts();
  }, 1000);
}
function spawnHeart() {
  const area = $("#hearts-area");
  const h = document.createElement("span");
  const size = 26 + Math.random() * 22;
  h.className = "falling-heart"; h.innerHTML = "&#10084;";
  h.style.fontSize = size + "px";
  h.style.left = Math.random() * (area.clientWidth - size) + "px";
  h.style.animationDuration = 2.3 + Math.random() * 2 + "s";
  h.addEventListener("pointerdown", () => {
    if (!chRunning) return;
    chScore++; $("#ch-score").textContent = chScore; ding(1200);
    h.style.animationPlayState = "paused"; h.classList.add("popped");
    setTimeout(() => h.remove(), 250);
  });
  h.addEventListener("animationend", () => h.remove());
  area.appendChild(h);
}
function endHearts() {
  clearInterval(chSpawn); clearInterval(chTimer); chRunning = false;
  $("#ch-start").disabled = false; $("#ch-start").textContent = "Play again";
  const msg = chScore >= 25 ? `${chScore} hearts! But you caught mine long ago.`
    : chScore >= 12 ? `${chScore} hearts. Every single one belongs to you anyway.`
    : `${chScore} hearts. Don't worry, mine is already yours.`;
  winMessage("#ch-msg", msg);
}
$("#ch-start").onclick = startHearts;

/* ---------- 4. PUZZLE ---------- */
const PZ = 3;
let pzOrder = [], pzSel = null, pzSrc = "", pzMoves = 0, pzSolved = false;
async function initPuzzle() {
  pzSrc = (await resolveImage(CONFIG.puzzlePhoto)) || placeholderSrc(CONFIG.puzzlePhoto);
  $("#puzzle-preview").src = pzSrc;
  const img = new Image();
  img.onload = () => {
    const ratio = img.naturalWidth / img.naturalHeight;
    const board = $("#puzzle-board");
    board.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    if (ratio < 1) board.style.width = `min(${Math.round(360 * ratio)}px, 85vw)`;
  };
  img.src = pzSrc;
  pzOrder = [...Array(PZ * PZ).keys()];
  do { shuffle(pzOrder); } while (pzOrder.every((v, i) => v === i));
  pzSel = null; pzMoves = 0; pzSolved = false;
  $("#pz-moves").textContent = 0; $("#pz-msg").textContent = "";
  $("#puzzle-board").classList.remove("solved");
  renderPuzzle();
}
function renderPuzzle() {
  const board = $("#puzzle-board");
  board.innerHTML = "";
  pzOrder.forEach((piece, pos) => {
    const t = document.createElement("div");
    t.className = "pz-tile" + (pzSel === pos ? " selected" : "");
    t.style.backgroundImage = `url("${pzSrc}")`;
    t.style.backgroundSize = `${PZ * 100}% ${PZ * 100}%`;
    t.style.backgroundPosition = `${(piece % PZ) * 100 / (PZ - 1)}% ${Math.floor(piece / PZ) * 100 / (PZ - 1)}%`;
    t.onclick = () => {
      if (pzSolved) return;
      if (pzSel === null) { pzSel = pos; }
      else {
        [pzOrder[pzSel], pzOrder[pos]] = [pzOrder[pos], pzOrder[pzSel]];
        pzSel = null; pzMoves++; $("#pz-moves").textContent = pzMoves;
        if (pzOrder.every((v, i) => v === i)) {
          pzSolved = true; board.classList.add("solved");
          winMessage("#pz-msg", `Solved in ${pzMoves} moves. You complete the picture, always.`);
        }
      }
      renderPuzzle();
    };
    board.appendChild(t);
  });
}
$("#pz-restart").onclick = initPuzzle;
initPuzzle();

/* ---------- 5. SPIN THE WHEEL ---------- */
(function drawWheel() {
  const c = $("#wheel"), ctx = c.getContext("2d"), n = 8, r = c.width / 2;
  const colors = ["#e8467c", "#f9a8c2", "#a8285a", "#ffd6e3", "#d9a441", "#f47ca0", "#7a1f55", "#ffc2d4"];
  for (let i = 0; i < n; i++) {
    ctx.beginPath(); ctx.moveTo(r, r);
    ctx.arc(r, r, r - 2, i * 2 * Math.PI / n, (i + 1) * 2 * Math.PI / n);
    ctx.fillStyle = colors[i]; ctx.fill();
    ctx.save(); ctx.translate(r, r); ctx.rotate((i + 0.5) * 2 * Math.PI / n);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff"; ctx.font = "bold 30px Arial";
    ctx.fillText(i % 2 ? "\u2764" : "?", r * 0.68, 0);
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(r, r, 34, 0, 2 * Math.PI); ctx.fillStyle = "#fff"; ctx.fill();
  ctx.fillStyle = "#e8467c"; ctx.font = "bold 28px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("\u2764", r, r + 2);
})();
let wheelRot = 0, spinning = false, lastAns = -1;
$("#wheel-spin").onclick = () => {
  if (spinning) return;
  spinning = true; $("#wheel-msg").textContent = "";
  wheelRot += 360 * 6 + Math.floor(Math.random() * 360);
  $("#wheel").style.transform = `rotate(${wheelRot}deg)`;
};
$("#wheel").addEventListener("transitionend", () => {
  spinning = false;
  let i;
  do { i = Math.floor(Math.random() * CONFIG.wheelAnswers.length); }
  while (i === lastAns && CONFIG.wheelAnswers.length > 1);
  lastAns = i;
  winMessage("#wheel-msg", CONFIG.wheelAnswers[i]);
});

/* ---------- 6. SCRATCH CARD ---------- */
const sc = $("#scratch"), sctx = sc.getContext("2d");
let scratching = false, scratchDone = false, scratchMoves = 0;
function initScratch() {
  scratchDone = false; scratchMoves = 0;
  sc.style.transition = "none"; sc.style.opacity = 1; sc.style.pointerEvents = "auto";
  sctx.globalCompositeOperation = "source-over";
  const g = sctx.createLinearGradient(0, 0, sc.width, sc.height);
  g.addColorStop(0, "#c98f2e"); g.addColorStop(0.5, "#f7d98b"); g.addColorStop(1, "#d9a441");
  sctx.fillStyle = g; sctx.fillRect(0, 0, sc.width, sc.height);
  sctx.fillStyle = "rgba(255,255,255,.95)"; sctx.textAlign = "center";
  sctx.font = "600 24px Poppins, Arial"; sctx.fillText("Scratch here", sc.width / 2, sc.height / 2);
  sctx.font = "15px Poppins, Arial"; sctx.fillText("with your finger or mouse", sc.width / 2, sc.height / 2 + 28);
  $("#scratch-message").innerHTML = CONFIG.scratchMessage;
}
function scratchAt(e) {
  const r = sc.getBoundingClientRect();
  const x = (e.clientX - r.left) * sc.width / r.width;
  const y = (e.clientY - r.top) * sc.height / r.height;
  sctx.globalCompositeOperation = "destination-out";
  sctx.beginPath(); sctx.arc(x, y, 22, 0, Math.PI * 2); sctx.fill();
  if (++scratchMoves % 10 === 0) checkScratch();
}
function checkScratch() {
  if (scratchDone) return;
  const d = sctx.getImageData(0, 0, sc.width, sc.height).data;
  let clear = 0, total = 0;
  for (let i = 3; i < d.length; i += 16) { total++; if (d[i] === 0) clear++; }
  if (clear / total > 0.5) {
    scratchDone = true;
    sc.style.transition = "opacity .8s"; sc.style.opacity = 0; sc.style.pointerEvents = "none";
    burstConfetti(150); ding(1046);
  }
}
sc.addEventListener("pointerdown", e => { scratching = true; sc.setPointerCapture(e.pointerId); scratchAt(e); });
sc.addEventListener("pointermove", e => { if (scratching) scratchAt(e); });
["pointerup", "pointercancel"].forEach(ev => sc.addEventListener(ev, () => scratching = false));
$("#scratch-reset").onclick = initScratch;
initScratch();

/* =========================================================
   LETTER (typewriter)
   ========================================================= */
setImage($("#letter-img"), CONFIG.letterPhoto);
let letterStarted = false, letterSkip = false;
function typeLetter() {
  if (letterStarted) return;
  letterStarted = true;
  const el = $("#letter-text"), txt = CONFIG.letter.trim();
  let i = 0;
  el.classList.add("typing");
  (function step() {
    if (letterSkip) i = txt.length; else i++;
    el.textContent = txt.slice(0, i);
    if (i < txt.length) setTimeout(step, txt[i - 1] === "\n" ? 250 : 32);
    else {
      el.classList.remove("typing");
      $("#letter-sign").textContent = `Forever yours, ${CONFIG.signOff}`;
      $("#letter-sign").classList.add("show");
    }
  })();
}
$("#letter-card").onclick = () => { letterSkip = true; };
new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting && unlocked) typeLetter(); });
}, { threshold: 0.3 }).observe($("#letter-card"));

/* =========================================================
   FINAL SURPRISE
   ========================================================= */
$("#final-btn").onclick = () => {
  RESULTS.finalSurprise = true;
  sendResults(true);
  $("#final-pop").classList.add("show");
  burstConfetti(300); ding(1046);
  setTimeout(() => burstConfetti(200), 900);
};
$("#final-pop").onclick = () => $("#final-pop").classList.remove("show");
/* =========================================================
   V2 UPGRADE: gates, page transitions, polish
   Paste once at the END of script.js
   ========================================================= */
(() => {
  /* ---------- EDIT GATE MESSAGES HERE ---------- */
  const GATES = {
    story:   { icon: "&#10084;", title: "Once upon a time...",
               text: "...on an ordinary project, in an ordinary office, something extraordinary began.",
               button: "Open our story" },
    gallery: { icon: "&#10047;", title: "Little moments, kept forever",
               text: "Behind this gate are the moments I never want to forget.",
               button: "Show me our moments" },
    reasons: { icon: "&#9733;", title: "I tried to count...",
               text: "...all the reasons I love you. I ran out of cards before I ran out of reasons.",
               button: "Open the reasons" },
    games:   { icon: "&#10022;", title: "Ready to play, birthday girl?",
               text: "Six little games are waiting. Winning is optional, smiling is compulsory.",
               button: "Let the games begin" },
    letter:  { icon: "&#9993;", title: "Sealed with love",
               text: "The last gate hides the words I have wanted to tell you. Open it slowly.",
               button: "Open my letter" }
  };
  const ALL_GATES_MSG = "You opened every gate. Every door leads back to me.";
  const LABELS = { home: "Home", story: "Our Story", gallery: "Our Moments",
                   reasons: "Reasons I Love You", games: "Birthday Games", letter: "A Letter For You" };

  /* ---------- Helpers ---------- */
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const make = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const playEntrance = container => {
    [...container.children].forEach((c, i) => c.style.setProperty("--i", i));
    container.classList.add("entering");
    setTimeout(() => container.classList.remove("entering"), 2600);
  };
  const jumpTo = target => {
    document.documentElement.style.scrollBehavior = "auto";
    target.scrollIntoView();
    document.documentElement.style.scrollBehavior = "";
  };

  /* ---------- Progress bar, toast, transition layer ---------- */
  const progressBar = make("div"); progressBar.id = "progress-bar";
  const toast = make("div"); toast.id = "toast";
  const pt = make("div", "", '<div class="pt-heart">&#10084;</div><div class="pt-label"></div>');
  pt.id = "page-transition";
  document.body.append(progressBar, toast, pt);

  let toastTimer;
  const showToast = msg => {
    toast.innerHTML = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
  };

  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }, { passive: true });

  /* ---------- Highlight active menu link ---------- */
  const nav = $("#nav");
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$("#nav a").forEach(a => {
        const on = a.getAttribute("href") === "#" + e.target.id;
        a.classList.toggle("active", on);
        if (on) nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
      });
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  $$("main > section").forEach(s => navObserver.observe(s));

  /* ---------- Circle transition when using menu links ---------- */
  let transitioning = false;
  const goTo = (id, x, y) => {
    const target = document.getElementById(id);
    if (!target || transitioning) return;
    if (REDUCED) { jumpTo(target); return; }
    transitioning = true;
    pt.style.setProperty("--x", x + "px");
    pt.style.setProperty("--y", y + "px");
    pt.querySelector(".pt-label").textContent = LABELS[id] || "";
    pt.classList.add("in");
    setTimeout(() => {
      jumpTo(target);
      pt.classList.add("out");
      setTimeout(() => {
        pt.style.transition = "none";
        pt.classList.remove("in", "out");
        void pt.offsetWidth;
        pt.style.transition = "";
        transitioning = false;
      }, 550);
    }, 900);
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    goTo(a.getAttribute("href").slice(1), e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
  }));

  /* ---------- Heart dividers between sections ---------- */
  $$("main > section").forEach((s, i) => {
    if (i) s.before(make("div", "divider", "<span>&#10084;</span>"));
  });

  /* ---------- Gates ---------- */
  const gateIds = Object.keys(GATES).filter(id => document.getElementById(id));
  let gatesOpened = 0;

  const garlandHTML = (count = 11) => {
    let html = "";
    for (let i = 0; i < count; i++) {
      const a = Math.PI + (Math.PI * i) / (count - 1);
      const left = 50 + Math.cos(a) * 54, top = 50 + Math.sin(a) * 54;
      const color = i % 2 ? "var(--gold)" : "var(--rose)";
      const size = i % 2 ? 1 : 1.35;
      html += `<span style="left:${left}%;top:${top}%;color:${color};font-size:${size}rem;animation-delay:${-i * 0.3}s">&#10047;</span>`;
    }
    return html;
  };

  const heartBurst = (container, count = 18) => {
    for (let i = 0; i < count; i++) {
      const h = make("span", "burst-heart", Math.random() > 0.3 ? "&#10084;" : "&#10022;");
      const ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 130;
      h.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      h.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      h.style.setProperty("--rot", Math.random() * 80 - 40 + "deg");
      h.style.setProperty("--s", 14 + Math.random() * 18 + "px");
      h.style.color = Math.random() > 0.5 ? "var(--rose)" : "var(--gold)";
      container.appendChild(h);
      setTimeout(() => h.remove(), 1300);
    }
  };

  const openGate = (section, gate, content) => {
    if (gate.classList.contains("opening")) return;
    gate.classList.add("opening");
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => ding(f), i * 140));
    setTimeout(() => heartBurst(gate.querySelector(".gate-scene")), 450);
    setTimeout(() => gate.classList.add("gone"), REDUCED ? 100 : 1800);
    setTimeout(() => {
      gate.remove();
      section.classList.remove("gated");
      jumpTo(section);
      playEntrance(content);
      if (++gatesOpened === gateIds.length) {
        setTimeout(() => { showToast(ALL_GATES_MSG); burstConfetti(220); }, 1200);
      }
    }, REDUCED ? 300 : 2500);
  };

  gateIds.forEach((id, idx) => {
    const section = document.getElementById(id), g = GATES[id];

    // Move the existing section content into a wrapper that stays hidden until the gate opens
    const content = make("div", "section-content");
    while (section.firstChild) content.appendChild(section.firstChild);
    section.appendChild(content);
    section.classList.add("gated");

    const gate = make("div", "gate", `
      <div class="gate-scene">
        <div class="gate-light"><div class="gate-peek">${g.icon}</div></div>
        <div class="gate-door left"><span class="knob"></span></div>
        <div class="gate-door right"><span class="knob"></span></div>
        <div class="gate-frame"></div>
        <div class="gate-garland">${garlandHTML()}</div>
        <button class="gate-lock" aria-label="Open the gate">${g.icon}</button>
      </div>
      <div class="gate-text">
        <p class="gate-eyebrow">Gate ${idx + 1} of ${gateIds.length}</p>
        <h3 class="script">${g.title}</h3>
        <p>${g.text}</p>
        <button class="btn gate-btn">${g.button}</button>
      </div>`);
    section.insertBefore(gate, content);

    const open = () => openGate(section, gate, content);
    gate.querySelector(".gate-lock").onclick = open;
    gate.querySelector(".gate-btn").onclick = open;
  });

  /* ---------- Home entrance animation after unlocking ---------- */
  new MutationObserver((m, obs) => {
    if (!document.body.classList.contains("locked")) {
      playEntrance($("#home"));
      obs.disconnect();
    }
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  /* ---------- Twinkling stars on lock screen ---------- */
  for (let i = 0; i < 60; i++) {
    const s = make("span", "star");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDuration = 2 + Math.random() * 3 + "s";
    s.style.animationDelay = -Math.random() * 5 + "s";
    $("#lock").appendChild(s);
  }

  /* ---------- Sparkle trail (laptop mouse only) ---------- */
  if (!REDUCED) {
    let lastSpark = 0;
    addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lastSpark < 45) return;
      lastSpark = now;
      const s = make("span", "sparkle", Math.random() > 0.5 ? "&#10084;" : "&#10022;");
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.setProperty("--s", 8 + Math.random() * 10 + "px");
      s.style.color = Math.random() > 0.5 ? "#e8467c" : "#d9a441";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }, { passive: true });
  }

  /* ---------- Keyboard shortcuts ---------- */
  addEventListener("keydown", e => {
    const lbOpen = $("#lightbox").classList.contains("show");
    if (e.key === "Escape") {
      $("#lightbox").classList.remove("show");
      $("#final-pop").classList.remove("show");
    }
    if (lbOpen && e.key === "ArrowLeft") openLightbox(lbIndex - 1);
    if (lbOpen && e.key === "ArrowRight") openLightbox(lbIndex + 1);
  });
})();