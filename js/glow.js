/* =========================================================
   V3 UPGRADE: balloon groups, gate balloon pop-outs, sparkles,
   bunting, last-page ambience.  Loads after script.js + slides.js
   ========================================================= */
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const mk = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  const body = document.body, main = $("main"), calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PAL = [["#ff7aa2", "#e5102f"], ["#ffc46b", "#ff7a18"], ["#fff07a", "#f5b700"], ["#7af0c0", "#14b87a"],
               ["#7fd4ff", "#1d7df0"], ["#c9a2ff", "#7b3df0"], ["#ffa3dc", "#e83fa6"], ["#ff9b7a", "#e63b2e"]];
  let ac;
  const pop = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = "square"; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(120, t + .08);
    g.gain.setValueAtTime(.09, t); g.gain.exponentialRampToValueAtTime(.001, t + .09); o.connect(g).connect(ac.destination); o.start(); o.stop(t + .1); } catch (e) {} };

  /* little burst when a balloon pops */
  function burst(x, y, c) {
    pop();
    for (let i = 0; i < 12; i++) {
      const p = mk("i"); p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${rnd(5, 10)}px;height:${rnd(5, 10)}px;border-radius:${Math.random() > .5 ? "50%" : "2px"};background:${i % 3 ? c : "#fff"};z-index:1500;pointer-events:none`;
      body.appendChild(p); const a = Math.random() * 6.283, d = rnd(30, 90);
      p.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 30}px) scale(.2)`, opacity: 0 }],
        { duration: rnd(500, 900), easing: "ease-out" }).onfinish = () => p.remove();
    }
  }

  /* one balloon. Plain ones pop on tap (and grow back). Named ones carry a letter/word and stay put. */
  const NAME = (window.CONFIG && CONFIG.nickname) || "Kuku";
  function balloon(g, x, y, w, label, pal) {
    pal = pal || pick(PAL); const b = mk("i", "bl" + (label ? " named" : ""));
    b.style.cssText = `left:${x}px;top:${y}px;--w:${w}px;--c1:${pal[0]};--c2:${pal[1]};--s:${rnd(50, 90)}px;--dur:${rnd(4, 7)}s;--dly:${-rnd(0, 5)}s;--r0:${rnd(-4, -1)}deg;--r1:${rnd(1, 4)}deg`;
    if (label) { b.innerHTML = `<em class="${label.length > 2 ? "word" : ""}">${label}</em>`; g.appendChild(b); return; }
    b.addEventListener("pointerdown", e => {
      e.stopPropagation(); const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, pal[1]);
      b.style.visibility = "hidden"; b.style.pointerEvents = "none";
      setTimeout(() => { b.style.visibility = ""; b.style.pointerEvents = ""; b.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 700, easing: "cubic-bezier(.3,1.6,.5,1)" }); }, 5000);
    });
    g.appendChild(b);
  }
  const RAINBOW = [PAL[0], PAL[2], PAL[4], PAL[3], PAL[5], PAL[1], PAL[6]];
  function group(n, cls, W, H, names) {
    const g = mk("div", "bgroup " + cls);
    for (let i = 0; i < n; i++) { const w = rnd(34, 62); balloon(g, rnd(0, W - w), rnd(0, H * .55) + (i % 2) * 8, w); }
    if (names) {                                          // static lettered balloons in a row
      const k = names.length, w = Math.min(74, (W - 10) / k - 4);
      names.forEach((t, i) => balloon(g, 4 + i * (W - 8) / k + 2, H * .22 + (i % 2) * 16, t.length > 2 ? w * 1.25 : w, t, RAINBOW[i % RAINBOW.length]));
    }
    return g;
  }

  /* ---------- balloons on every page: just 2 groups of 5-9, one of them with names ---------- */
  const SPOTS = [["rt", { right: "1.5%", top: "78px" }], ["lb", { left: "1.5%", bottom: "96px" }], ["lt", { left: "1.5%", top: "34%" }], ["rb", { right: "1.5%", bottom: "100px" }]];
  const LETTERS = NAME.toUpperCase().split(""), SETS = [LETTERS, ["Happy", "Birthday"], [NAME], ["\u2764", NAME, "\u2764"]];
  const pages = $$("main > section");
  pages.forEach((s, i) => {
    [[i % 4, 5 + ((i * 3) % 5), SETS[i % 4]], [(i + 2) % 4, 5 + ((i * 2 + 1) % 4), null]].forEach(([k, n, names]) => {
      const g = group(n, "fixed " + SPOTS[k][0], 250, 200, names); Object.assign(g.style, SPOTS[k][1]); s.appendChild(g);
    });
  });
  const eyebrow = $("#home .eyebrow");                 // big cluster above "Happy Birthday, Kuku" spelling KUKU
  if (eyebrow) eyebrow.parentNode.insertBefore(group(10, "inline", 440, 150, LETTERS), eyebrow);
  const lockEl = $("#lock");                           // password screen too
  if (lockEl) [["lb", { left: "2%", bottom: "4%" }, LETTERS], ["rt", { right: "2%", top: "5%" }, null]].forEach(([c, pos, nm]) => { const g = group(7, "fixed " + c, 250, 200, nm); Object.assign(g.style, pos); lockEl.appendChild(g); });

  /* ---------- sparkles + bunting ---------- */
  const sp = mk("div"); sp.id = "sparkles";
  for (let i = 0; i < 24; i++) {
    const s = mk("i", "", pick(["&#10022;", "&#10023;", "&#10038;", "&#10084;"]));
    s.style.cssText = `left:${rnd(0, 100)}%;top:${rnd(0, 100)}%;font-size:${rnd(10, 24)}px;color:${pick(["#ffc83d", "#fff", "#ff8fb0", "#b57cff", "#7fd4ff"])};opacity:.7;animation-delay:${-rnd(0, 3)}s;animation-duration:${rnd(2, 5)}s`;
    sp.appendChild(s);
  }
  ["#ff9ac0", "#c9a2ff", "#ffd98a", "#8fd3ff"].forEach((c, i) => { const o = mk("b", "orb"); o.style.cssText = `background:${c};left:${[-8, 60, 20, 70][i]}%;top:${[-10, 5, 60, 55][i]}%;animation-delay:${-i * 5}s`; sp.appendChild(o); });
  body.insertBefore(sp, main);
  const bunting = mk("div"); bunting.id = "bunting"; body.appendChild(bunting);

  /* ---------- balloons rising out of a gate / from the bottom ---------- */
  function rise(rect, n, fromBottom, ambient) {
    if (calm) return;
    for (let i = 0; i < n; i++) {
      const pal = pick(PAL), w = rnd(38, 72), b = mk("i", "bl rising");
      const x = rect.left + rect.width * rnd(.1, .9) - w / 2, y = fromBottom ? innerHeight + 20 : rect.bottom - rnd(80, 230);
      b.style.cssText = `left:${x}px;top:${y}px;--w:${w}px;--c1:${pal[0]};--c2:${pal[1]};--s:${rnd(50, 90)}px${ambient ? ";z-index:0;opacity:.85" : ""}`;
      (ambient ? pages.find(x => x.classList.contains("show")) || body : body).appendChild(b);
      const dur = ambient ? rnd(7000, 10000) : rnd(3400, 5600), delay = i * (ambient ? 260 : 85), dx = rnd(-140, 140), up = fromBottom ? -(innerHeight + 260) : -(y + 220);
      const a = b.animate([{ transform: "translate(0,40px) scale(.15)", opacity: 0 }, { transform: "translate(0,0) scale(1)", opacity: 1, offset: .1 },
        { transform: `translate(${dx}px,${up}px) rotate(${rnd(-25, 25)}deg)`, opacity: 1 }], { duration: dur, delay, easing: "cubic-bezier(.3,.1,.35,1)", fill: "both" });
      a.onfinish = () => b.remove();
      if (!ambient && Math.random() < .5) setTimeout(() => { if (!b.isConnected) return; const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, pal[1]); b.remove(); }, delay + dur * rnd(.3, .8));
    }
  }
  function ring(rect) {
    const r = mk("i"); r.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:60px;height:60px;margin:-30px;border-radius:50%;border:5px solid #ffd27a;z-index:1400;pointer-events:none;box-shadow:0 0 30px #ffd27a`;
    body.appendChild(r); r.animate([{ transform: "scale(.3)", opacity: 1 }, { transform: "scale(14)", opacity: 0 }], { duration: 1300, easing: "ease-out" }).onfinish = () => r.remove();
  }
  $$(".gate").forEach(gate => {
    const scene = gate.querySelector(".gate-scene");
    [["left", -96], ["right", -96]].forEach(([side, off]) => {
      const g = group(7, "gside", 120, 130, side === "left" ? ["\u2764"] : null); g.style[side] = off + "px"; g.style.top = "-10px"; g.style.zIndex = "5"; scene.appendChild(g);
    });
    new MutationObserver(() => {
      if (!gate.classList.contains("opening") || gate._done) return; gate._done = 1;
      const rect = scene.getBoundingClientRect();
      gate.querySelectorAll(".gside").forEach(x => x.classList.add("fly"));
      setTimeout(() => { ring(rect); rise(rect, 20); }, 500);
      setTimeout(() => rise(rect, 10), 1300);
    }).observe(gate, { attributes: true, attributeFilter: ["class"] });
  });

  /* ---------- last page: ambient falling hearts & petals ---------- */
  const letter = $("#letter");
  for (let i = 0; i < 22; i++) {
    const f = mk("i", "gl-fall", pick(["&#10084;", "&#10084;", "&#10047;", "&#10022;"]));
    f.style.cssText = `left:${rnd(0, 100)}%;font-size:${rnd(12, 26)}px;color:${pick(["#ff5c8a", "#ffc83d", "#fff", "#b57cff", "#ff8a3d"])};opacity:.75;animation-duration:${rnd(7, 14)}s;animation-delay:${-rnd(0, 12)}s;--sw:${rnd(-120, 120)}px;--rt:${rnd(180, 540)}deg;font-style:normal`;
    letter.appendChild(f);
  }

  /* ---------- final surprise: balloon waves from the bottom ---------- */
  const fp = $("#final-pop");
  new MutationObserver(() => { if (!fp.classList.contains("show")) return;
    [0, 1800, 3800].forEach(t => setTimeout(() => fp.classList.contains("show") && rise({ left: 0, width: innerWidth, top: innerHeight, bottom: innerHeight }, 18, true), t)); })
    .observe(fp, { attributes: true, attributeFilter: ["class"] });

  /* =========================================================
     POLISH: ripples, tap sparkles, transition effects, drifting balloons
     ========================================================= */
  document.addEventListener("pointerdown", e => {
    const t = e.target.closest(".btn,.tab,.sb-next,.sb-back,.gate-lock,#nav a");
    if (t) {                                            // button ripple
      const r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, rp = mk("span", "rip");
      rp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      t.appendChild(rp); setTimeout(() => rp.remove(), 700);
    }
    if (!calm && !e.target.closest("input,#slidebar,.bl,button,#hearts-area,#scratch,#wheel,#puzzle-board,#memory-board,#habit-stack,#giftbox,#envelope,.cp,#vinyl,.s-star,.letter-card,.lm-heart,#finale")) {   // little hearts & stars wherever she taps
      for (let i = 0; i < 5; i++) {
        const p = mk("i", "", pick(["&#10084;", "&#10022;", "&#10084;", "&#10047;"]));
        p.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;z-index:1500;pointer-events:none;font-style:normal;font-size:${rnd(12, 22)}px;color:${pick(["#ff5c8a", "#ffc83d", "#b57cff", "#4dabf7", "#56d6a0"])}`;
        body.appendChild(p); const a = rnd(-2.6, -.5), d = rnd(40, 90);
        p.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) scale(1.2) rotate(${rnd(-60, 60)}deg)`, opacity: 0 }],
          { duration: rnd(700, 1100), easing: "ease-out" }).onfinish = () => p.remove();
      }
    }
  }, true);

  /* a few balloons keep drifting up in the background */
  setInterval(() => { if (!calm && !body.classList.contains("intro") && !body.classList.contains("locked") && !document.hidden)
    rise({ left: 0, width: innerWidth, top: innerHeight, bottom: innerHeight }, 1, true, true); }, 9000);

  /* ---------- closing love note at the end of every page ---------- */
  const NOTES = { home: "Every year, my favourite day is the day you were born.", story: "Every chapter I love has your name in it.",
    gallery: "Some moments never fade. These ones are ours.", reasons: "There are many more reasons. I am still counting.",
    habits: "I could keep this list going forever.", meter: "Some things are simply too big to measure.",
    sky: "Close your eyes. Make a wish. I already know mine.", games: "Win or lose, I am just happy you are here.",
    song: "Some songs are just a person in disguise.", promise: "Signed, with all my heart.", future: "To be continued, together.",
    gift: "The best gift is still you. These are just the wrapped extras.", letter: "P.S. I meant every single word." };
  pages.forEach(sec => { if (!NOTES[sec.id]) return; const n = mk("p", "page-note script", NOTES[sec.id]); (sec.querySelector(".section-content") || sec).appendChild(n); });
  const ls = $("#letter .section-sub");                 // clearer instruction before/after the envelope opens
  if (ls) { ls.textContent = "Tap the envelope to open your letter"; const env = $("#envelope");
    env && env.addEventListener("click", () => setTimeout(() => { ls.textContent = "Tap the letter to skip the typing"; }, 1200)); }

  /* ---------- "more below" hint when a page scrolls ---------- */
  const hint = mk("div", "", "scroll &#8595;"); hint.id = "scrollhint"; body.appendChild(hint);
  const refreshHint = () => { const s = pages.find(x => x.classList.contains("show") && !x.classList.contains("out"));
    hint.classList.toggle("on", !!s && !body.classList.contains("intro") && s.id !== "finale" && s.scrollHeight - s.scrollTop - s.clientHeight > 90); };
  pages.forEach(s => s.addEventListener("scroll", refreshHint, { passive: true }));
  document.addEventListener("page", () => setTimeout(refreshHint, 1300)); setInterval(refreshHint, 1000);
})();
