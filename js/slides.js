/* =========================================================
   V3: intro cinematic + one-page-at-a-time slides
   Loads AFTER script.js (uses its $, $$, ding, playSong, burstConfetti, CONFIG)
   ========================================================= */
(() => {
  const body = document.body, main = $("main");
  const pages = [...$$("main > section")];
  const NAMES = { home: "Home", story: "Our Story", gallery: "Our Moments", reasons: "Reasons", habits: "Habits", meter: "Love Meter", sky: "Stars",
    games: "Games", song: "Our Song", promise: "Promises", future: "Our Future", gift: "Your Gift", letter: "Letter", finale: "Finale" };
  const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  let cur = -1, busy = false, introOn = true, ac;
  const tone = (f, d = .25, type = "sine", v = .12, f2) => { try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t); f2 && o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g).connect(ac.destination); o.start(); o.stop(t + d); } catch (e) {} };
  const whoosh = (d = .6) => { try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const n = ac.sampleRate * d, buf = ac.createBuffer(1, n, ac.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime;
    src.buffer = buf; f.type = "bandpass"; f.Q.value = 1.2;
    f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2600, t + d * .6); f.frequency.exponentialRampToValueAtTime(500, t + d);
    g.gain.setValueAtTime(.001, t); g.gain.linearRampToValueAtTime(.25, t + d * .4); g.gain.linearRampToValueAtTime(.001, t + d);
    src.connect(f).connect(g).connect(ac.destination); src.start(); } catch (e) {} };
  const SCALE = [523, 587, 659, 784, 880, 1046];
  const petals = (n = 26) => { if (REDUCED) return; for (let i = 0; i < n; i++) {
    const p = mk("i", "pet"), sz = 10 + Math.random() * 10;
    p.style.cssText = `left:${Math.random() * 100}%;width:${sz}px;height:${sz * 1.3}px;animation-duration:${2.2 + Math.random() * 1.8}s;animation-delay:${Math.random() * .5}s;--sw:${Math.random() * 160 - 80}px;--rt:${300 + Math.random() * 500}deg`;
    body.appendChild(p); setTimeout(() => p.remove(), 4800); } };

  body.classList.add("slides", "intro");
  musicObserver.disconnect();                       // music is now driven by page changes
  const _bc = window.burstConfetti;                 // keep confetti off the intro, use it after
  window.burstConfetti = c => { if (!introOn) _bc(c); };
  $("#footer-name") && pages[pages.length - 1].appendChild($("footer"));

  /* ---------- Slide bar (Back / dots / Next) ---------- */
  const bar = mk("div"); bar.id = "slidebar";
  bar.innerHTML = `<button class="sb-back" aria-label="Back">&#8249;</button><div class="sb-dots"></div>
    <button class="sb-next"><span></span><b>&#8250;</b></button>`;
  const sweep = mk("div"); sweep.id = "sweep";
  body.append(bar, sweep);
  const dots = bar.querySelector(".sb-dots");
  pages.forEach((p, i) => { const d = mk("i"); d.onclick = () => go(i); dots.appendChild(d); });
  bar.querySelector(".sb-back").onclick = () => go(cur - 1);
  bar.querySelector(".sb-next").onclick = () => go(cur + 1 < pages.length ? cur + 1 : 0);

  function updateUI() {
    [...dots.children].forEach((d, i) => d.classList.toggle("on", i === cur));
    bar.querySelector(".sb-back").disabled = cur <= 0;
    const last = cur === pages.length - 1;
    bar.querySelector(".sb-next span").innerHTML = last ? "Start again" : `Next <small>&middot; ${NAMES[pages[cur + 1]?.id] || ""}</small>`;
    $$("#nav a").forEach(a => {
      const on = a.getAttribute("href") === "#" + pages[cur].id;
      a.classList.toggle("active", on);
      if (on) $("#nav").scrollTo({ left: a.offsetLeft - $("#nav").clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
    });
  }
  const entrance = el => {
    [...el.children].forEach((c, i) => c.style.setProperty("--i", i));
    el.classList.add("entering"); setTimeout(() => el.classList.remove("entering"), 2600);
  };

  function go(i, first) {
    if (busy || i === cur || i < 0 || i >= pages.length) return;
    const old = pages[cur], nu = pages[i], d = i > cur ? 1 : -1;
    main.style.setProperty("--d", d);
    nu.scrollTop = 0; nu.classList.add("show");
    cur = i; updateUI(); document.dispatchEvent(new CustomEvent("page", { detail: nu.id }));
    if (unlocked) playSong(+nu.dataset.song);
    if (first) { return; }
    busy = true;
    nu.classList.add("in"); old.classList.add("out");
    sweep.style.setProperty("--sd", d); sweep.classList.remove("go"); void sweep.offsetWidth; sweep.classList.add("go");
    whoosh(); tone(SCALE[i % 6] * (i > 5 ? 1.5 : 1), .5, "sine", .1); petals();
    setTimeout(() => {
      old.classList.remove("show", "out"); nu.classList.remove("in"); busy = false;
    }, REDUCED ? 60 : 950);
  }

  /* menu links, keyboard, swipe */
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault(); e.stopPropagation();
    const i = pages.findIndex(p => p.id === a.getAttribute("href").slice(1));
    if (i > -1 && !introOn) go(i);
  }, true);
  addEventListener("keydown", e => {
    if (introOn || $("#lightbox").classList.contains("show") || e.target.closest("input")) return;
    if (e.key === "ArrowRight") go(cur + 1);
    if (e.key === "ArrowLeft") go(cur - 1);
  });
  let tx = 0, ty = 0, skipSwipe = false;
  addEventListener("touchstart", e => {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    skipSwipe = !!e.target.closest("#scratch,#hearts-area,#wheel,#puzzle-board,#lightbox,#slidebar,#habit-stack,#lm-heart,#sky-box,.coupons,input");
  }, { passive: true });
  addEventListener("touchend", e => {
    if (skipSwipe || introOn) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) go(dx < 0 ? cur + 1 : cur - 1);
  }, { passive: true });

  /* ---------- INTRO: heart, bow & arrow, blast, zooming title ---------- */
  const HEART = `<svg viewBox="0 0 100 90"><defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ff4d5e"/><stop offset=".6" stop-color="#e5102f"/><stop offset="1" stop-color="#a30020"/></linearGradient></defs>
    <path d="M50 88C20 62 2 44 2 24 2 10 13 2 26 2c10 0 19 6 24 14C55 8 64 2 74 2c13 0 24 8 24 22 0 20-18 38-48 64z" fill="url(#hg)"/>
    <path d="M18 22c0-6 4-10 10-11" stroke="#ffc2cc" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/></svg>`;
  const intro = mk("div"); intro.id = "intro";
  intro.innerHTML = `<button class="skip">Skip &#8250;</button>
    <div class="i-hello">For you, ${CONFIG.nickname} &#10084;</div>
    <div class="i-heart">${HEART}</div>
    <div class="archer"><svg viewBox="0 0 120 200">
      <path d="M40 8Q112 100 40 192" fill="none" stroke="#e7b15a" stroke-width="7" stroke-linecap="round"/>
      <path class="str" d="M40 8L40 100L40 192" fill="none" stroke="#ffe8ee" stroke-width="2"/></svg>
      <svg class="arrow" viewBox="0 0 130 16"><line x1="4" y1="8" x2="124" y2="8" stroke="#f4d9a8" stroke-width="3" stroke-linecap="round"/>
        <polygon points="120,1 132,8 120,15" fill="#ff8fb0"/>
        <path d="M2 2L16 8L2 14M12 3L24 8L12 13" fill="none" stroke="#ff4d6d" stroke-width="2"/></svg></div>
    <div class="ring"></div>
    <div class="i-text"><span>Happy Birthday</span><span>${CONFIG.nickname}</span></div>
    <div class="flash"></div>`;
  body.appendChild(intro);
  const Q = s => intro.querySelector(s);
  let skipped = false, finished = false;

  function finish() {
    if (finished) return; finished = true; skipped = true;
    intro.classList.add("fade");
    go(0, true); pages[0].classList.add("active");
    body.classList.remove("intro"); introOn = false;
    entrance(pages[0]);
    setTimeout(() => _bc(240), 500);
    setTimeout(() => intro.remove(), 1300);
  }
  Q(".skip").onclick = finish;

  async function runIntro() {
    if (REDUCED) return finish();
    const heart = Q(".i-heart"), archer = Q(".archer"), arrow = Q(".arrow"), str = Q(".str"), text = Q(".i-text"), ring = Q(".ring");
    const sc = Math.min(1.5, Math.max(.8, innerWidth / 520));
    archer.style.setProperty("--sc", sc);
    const hello = Q(".i-hello");
    await wait(300); if (skipped) return;
    hello.animate([{ opacity: 0, transform: "translateY(calc(-50% + 14px))" }, { opacity: 1, transform: "translateY(-50%)" }], { duration: 1000, fill: "forwards" });
    await wait(2100); if (skipped) return;
    hello.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: "forwards" });
    await wait(650); if (skipped) return;
    heart.style.opacity = 1;
    heart.animate([{ transform: "scale(.1)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 1100, easing: "cubic-bezier(.34,1.56,.64,1)" });
    heart.classList.add("beat"); ding(196);
    await wait(1200); if (skipped) return;

    // aim the bow at the heart
    const hr = heart.getBoundingClientRect(), R = hr.width / 2;
    const h = { x: hr.left + R, y: hr.top + hr.height / 2 };
    let ar = archer.getBoundingClientRect();
    const a = { x: ar.left + ar.width / 2, y: ar.top + ar.height / 2 };
    const ang = Math.atan2(h.y - a.y, h.x - a.x) * 180 / Math.PI;
    archer.style.setProperty("--rot", ang + "deg");
    archer.animate([{ opacity: 0, translate: "-60px 40px" }, { opacity: 1, translate: "0 0" }], { duration: 700, fill: "forwards", easing: "ease-out" });
    archer.style.opacity = 1;
    await wait(800); if (skipped) return;

    // draw the string
    const setPull = p => { str.setAttribute("d", `M40 8L${40 - 32 * p} 100L40 192`); arrow.style.transform = `translateX(${-32 * p}px)`; };
    await new Promise(res => { const t0 = performance.now(); (function f(t) {
      const p = Math.min(1, (t - t0) / 900); setPull(p * p * (3 - 2 * p)); p < 1 && !skipped ? requestAnimationFrame(f) : res(); })(t0); });
    if (skipped) return;
    await wait(250); if (skipped) return;

    // release
    tone(196, .6, "sawtooth", .16, 80); whoosh(.35); setPull(0);
    const D = Math.hypot(h.x - a.x, h.y - a.y), T = (D - R * .35) / sc - 110;
    arrow.animate([{ transform: "translateX(-32px)" }, { transform: `translateX(${T}px)` }], { duration: 520, easing: "cubic-bezier(.45,0,1,.7)", fill: "forwards" });
    await wait(520); if (skipped) return;

    // impact + blast
    const flash = Q(".flash");
    flash.animate([{ opacity: .9 }, { opacity: 0 }], { duration: 500 });
    ding(120); setTimeout(() => ding(660), 120); setTimeout(() => ding(880), 260);
    ring.animate([{ opacity: 1, transform: "scale(.5)" }, { opacity: 0, transform: "scale(" + (innerWidth / 40) + ")" }], { duration: 1100, easing: "ease-out" });
    heart.classList.remove("beat");
    heart.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.25)", opacity: 1, offset: .25 }, { transform: "scale(2.2)", opacity: 0 }], { duration: 700, easing: "ease-out", fill: "forwards" });
    archer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: "forwards" });
    arrow.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
    for (let i = 0; i < 42; i++) {
      const p = mk("span", "p", Math.random() > .25 ? "&#10084;" : "&#10022;");
      p.style.fontSize = 14 + Math.random() * 26 + "px";
      p.style.color = ["#ff1744", "#ff4d6d", "#ff8fb0", "#ffd27a"][i % 4];
      intro.appendChild(p);
      const t = Math.random() * Math.PI * 2, dist = 90 + Math.random() * Math.max(innerWidth, innerHeight) * .5;
      p.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(t) * dist}px),calc(-50% + ${Math.sin(t) * dist}px)) scale(1.3) rotate(${Math.random() * 360}deg)`, opacity: 0 }],
        { duration: 1000 + Math.random() * 900, easing: "cubic-bezier(.1,.7,.3,1)", fill: "forwards" }).onfinish = () => p.remove();
    }
    await wait(350); if (skipped) return;

    // "Happy Birthday Kuku" - zooms in, in, in
    text.style.opacity = 1;
    await text.animate([{ transform: "translateY(-50%) scale(.1)", opacity: 0 }, { transform: "translateY(-50%) scale(1)", opacity: 1 }],
      { duration: 1300, easing: "cubic-bezier(.2,1.3,.4,1)", fill: "forwards" }).finished.catch(() => {});
    if (skipped) return;
    await text.animate([{ transform: "translateY(-50%) scale(1)" }, { transform: "translateY(-50%) scale(1.22)" }],
      { duration: 1800, easing: "linear", fill: "forwards" }).finished.catch(() => {});
    if (skipped) return;
    setTimeout(() => !skipped && finish(), 450);      // page 1 fades in while the title zooms through the screen
    text.animate([{ transform: "translateY(-50%) scale(1.22)", opacity: 1 }, { transform: "translateY(-50%) scale(10)", opacity: 0 }],
      { duration: 1300, easing: "cubic-bezier(.6,0,.9,.4)", fill: "forwards" });
  }

  /* start the show the moment the password is accepted */
  if (!body.classList.contains("locked")) runIntro();
  else new MutationObserver((m, o) => { if (!body.classList.contains("locked")) { o.disconnect(); runIntro(); } })
    .observe(body, { attributes: true, attributeFilter: ["class"] });
})();

/* Reasons: split each sentence into words so they can pop in one by one */
$$(".reason-back p").forEach(p => {
  p.innerHTML = p.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--w:${i}">${w}</span>`).join(" ");
});
