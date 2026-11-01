/* =========================================================
   V4: new slides (habits, love meter, star sky, song, promises,
   future, gift, envelope, fireworks).  EDIT THE TEXT HERE.
   ========================================================= */
(() => {
  const X = {
    habits: [
      { i: "&#9749;", t: "The way you say my name" }, { i: "&#128516;", t: "Your tea-break face" },
      { i: "&#128584;", t: "How you laugh before the joke even ends" }, { i: "&#10024;", t: "Your small kindness to everyone" },
      { i: "&#128172;", t: "Random texts that fix my whole day" }, { i: "&#127800;", t: "Simply how you are, always" }
    ],
    stars: ["Your smile", "Your laugh", "Our tea breaks", "Late-night calls", "Our first lunch", "\"Achha ladka h tu\"",
            "Your kindness", "The way you care", "Every ordinary day", "You. Just you."],
    songTitle: "The song that always sounds like you",
    songLine: "Whatever song is playing, it always sounds like you.",
    promises: [
      { i: "&#129309;", t: "I will always be on your side." }, { i: "&#9749;", t: "I will never skip a tea break with you." },
      { i: "&#127749;", t: "I will make your mornings lighter." }, { i: "&#128172;", t: "I will always reply to you first." },
      { i: "&#127769;", t: "I will stay, even on your hardest days." }
    ],
    future: [
      { w: "Soon", i: "&#127748;", t: "A long drive with no destination" }, { w: "Very soon", i: "&#127869;", t: "A candlelit dinner, just us two" },
      { w: "Next year", i: "&#9992;", t: "Our first trip together" }, { w: "3 November 2027", i: "&#127874;", t: "Your 32nd birthday, with me again" },
      { w: "And after that", i: "&#10084;", t: "Every tea break, every year, everything" }
    ],
    coupons: [
      ["One free hug", "valid anytime, no questions"], ["One dinner date", "your choice of place"],
      ["One \"You were right\"", "I will say it with a straight face"], ["One tea break treat", "I carry the cups"],
      ["One day of Nishant obeying", "within reason"], ["One long walk and talk", "phones away"]
    ]
  };
  const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
  const mk = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const words = t => t.trim().split(/\s+/).map((w, i) => `<span class="w" style="--w:${i}">${w}</span>`).join(" ");

  /* ---------- HABITS: swipe cards ---------- */
  const stack = $("#habit-stack"); let hLeft = 0;
  function dealHabits() {
    stack.innerHTML = ""; $("#habit-msg").textContent = "";
    X.habits.slice().reverse().forEach((h, n, a) => {
      const c = mk("div", "h-card", `<b>${h.i}</b><span>${h.t}</span>`);
      const depth = a.length - 1 - n; c.style.transform = `scale(${1 - Math.min(depth, 3) * .04}) translateY(${Math.min(depth, 3) * 10}px)`;
      stack.appendChild(c);
    });
    hLeft = X.habits.length;
  }
  function flyCard(dir) {
    const c = stack.lastElementChild; if (!c || !c.classList.contains("h-card")) return;
    c.classList.remove("drag");
    c.style.transform = `translateX(${dir * 520}px) rotate(${dir * 28}deg)`; c.style.opacity = 0;
    setTimeout(() => c.remove(), 450); ding(dir > 0 ? 990 : 780); hLeft--;
    [...stack.children].forEach((k, i, a) => { if (k !== c) { const d = a.length - 2 - i; k.style.transform = `scale(${1 - Math.min(d, 3) * .04}) translateY(${Math.min(d, 3) * 10}px)`; } });
    if (!hLeft) setTimeout(() => {
      stack.innerHTML = '<div class="h-card" style="cursor:default"><b>&#128150;</b><span>100% match.<br>I knew it.</span></div>';
      $("#habit-msg").textContent = "Every single one is true."; burstConfetti(200); ding(1046);
      setTimeout(() => { const b = mk("button", "btn", "Play again"); b.onclick = dealHabits; $("#habit-msg").appendChild(mk("br")); $("#habit-msg").appendChild(b); }, 800);
    }, 450);
  }
  let hx = null;
  stack.addEventListener("pointerdown", e => { const c = stack.lastElementChild; if (!c || e.target.closest(".btn")) return; hx = e.clientX; c.classList.add("drag"); c.setPointerCapture(e.pointerId); });
  stack.addEventListener("pointermove", e => { if (hx === null) return; const c = stack.lastElementChild, dx = e.clientX - hx; c.style.transform = `translateX(${dx}px) rotate(${dx / 14}deg)`; });
  const endDrag = e => { if (hx === null) return; const c = stack.lastElementChild, dx = e.clientX - hx; hx = null; c.classList.remove("drag");
    if (Math.abs(dx) > 90) flyCard(dx > 0 ? 1 : -1); else c.style.transform = ""; };
  stack.addEventListener("pointerup", endDrag); stack.addEventListener("pointercancel", endDrag);
  $$(".habit-btns .btn").forEach(b => b.onclick = () => flyCard(+b.dataset.h));
  dealHabits();

  /* ---------- LOVE METER ---------- */
  let lv = 0, hold = false, boom = false, boomAt = 0;
  const fill = $("#lm-fill"), pct = $("#lm-pct"), heart = $("#lm-heart"), bar = $(".lm-bar"), msg = $("#lm-msg");
  const press = e => { e.preventDefault(); if (boom && performance.now() - boomAt < 2500) return; if (boom) { boom = false; lv = 0; heart.innerHTML = "&#10084;"; msg.textContent = "Hold on tight..."; } hold = true; };
  const rel = () => { hold = false; };
  heart.addEventListener("pointerdown", press);
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => heart.addEventListener(ev, rel));
  (function tick() {
    if (!boom) {
      lv = hold ? lv + .9 : Math.max(0, lv - 1.4);
      const t = [[30, "A little bit..."], [70, "Getting warmer..."], [100, "Almost full..."], [150, "100%! But it keeps going..."], [200, "WARNING: heart overflow!"]].find(x => lv < x[0]);
      if (hold || lv > 0) msg.textContent = t ? t[1] : "";
      if (lv >= 200) { boom = true; boomAt = performance.now(); hold = false;
        msg.textContent = "ERROR: too much love detected. System cannot handle Kuku \u2764"; heart.innerHTML = "&#128165;";
        burstConfetti(320); [392, 523, 659, 784, 1046].forEach((f, i) => setTimeout(() => ding(f), i * 90)); }
    }
    const v = boom ? 100 : Math.min(lv, 100);
    fill.style.width = v + "%"; pct.textContent = (boom ? "\u221E" : Math.floor(lv)) + "%";
    bar.classList.toggle("over", lv > 100 && !boom);
    heart.style.transform = `scale(${1 + (boom ? 0 : lv) / 260})`;
    requestAnimationFrame(tick);
  })();

  /* ---------- STAR SKY: tap stars to draw a heart ---------- */
  const box = $("#sky-box"), svg = $("#sky-svg"), N = X.stars.length, lit = new Set(), pts = [];
  for (let i = 0; i < 90; i++) { const d = mk("i"); d.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:2px;height:2px;border-radius:50%;background:#fff;opacity:${.2 + Math.random() * .6}`; box.prepend(d); }
  for (let i = 0; i < N; i++) {
    const t = i / N * 2 * Math.PI, x = 16 * Math.pow(Math.sin(t), 3), y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const px = 50 + x * 2.6, py = 45 + y * 2.4; pts.push([px, py]);
    const b = mk("button", "s-star", "&#10022;"); b.style.left = px + "%"; b.style.top = py + "%"; b.style.animationDelay = -Math.random() * 2 + "s";
    b.onclick = () => {
      if (lit.has(i)) { $("#sky-msg").textContent = X.stars[i]; return; }
      lit.add(i); b.classList.add("lit"); ding(700 + i * 60); $("#sky-msg").textContent = X.stars[i];
      [(i + N - 1) % N, (i + 1) % N].forEach(j => { if (lit.has(j)) { const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", pts[i][0]); l.setAttribute("y1", pts[i][1]); l.setAttribute("x2", pts[j][0]); l.setAttribute("y2", pts[j][1]); svg.appendChild(l); } });
      if (lit.size === N) { const pg = document.createElementNS("http://www.w3.org/2000/svg", "polygon"); pg.setAttribute("points", pts.map(p => p.join(",")).join(" ")); svg.prepend(pg);
        $("#sky-sub").textContent = "You are the brightest star in my sky \u2764"; $("#sky-msg").textContent = "Every star was you."; burstConfetti(260); [523, 659, 784, 1046].forEach((f, k) => setTimeout(() => ding(f), k * 120)); }
    };
    box.appendChild(b);
  }

  /* ---------- SONG ---------- */
  $("#song-title").textContent = X.songTitle; $("#song-line").innerHTML = words(X.songLine);
  $("#vinyl").onclick = () => { $("#music-btn").click(); $("#vinyl").classList.toggle("paused", $("#music-btn").classList.contains("muted")); };
  const voice = new Audio("audio/voice.mp3"); let vOn = false;
  const vEnd = () => { vOn = false; $("#voice-btn").innerHTML = "&#127908; Play my voice note"; if (musicOn) fadeTo(MAX_VOL); };
  voice.addEventListener("ended", vEnd);
  $("#voice-btn").onclick = () => {
    if (vOn) { voice.pause(); return vEnd(); }
    voice.play().then(() => { vOn = true; $("#voice-btn").innerHTML = "&#9208; Stop"; $("#voice-msg").textContent = ""; fadeTo(.1); })
      .catch(() => { $("#voice-msg").textContent = "Add your recording as audio/voice.mp3 and it will play here \u2764"; });
  };
  document.addEventListener("page", e => { if (vOn && e.detail !== "song") voice.pause(), vEnd(); });

  /* ---------- PROMISES / FUTURE ---------- */
  X.promises.forEach((p, k) => $("#promises").appendChild(mk("li", "", `<span class="pi" style="--k:${k}">${p.i}</span><span class="pt" style="--k:${k}">${p.t}</span>`)));
  X.future.forEach((f, k) => $("#path").appendChild(mk("div", "fi", `<b>${f.w}</b><span>${f.i}</span><p>${f.t}</p>`)).style.setProperty("--k", k));
  $$(".fi").forEach((e, k) => e.style.setProperty("--k", k));

  /* ---------- GIFT BOX + COUPONS ---------- */
  let got = 0;
  $("#giftbox").onclick = function () {
    if (this.classList.contains("open")) return;
    this.classList.add("open"); burstConfetti(280); [392, 523, 659, 784].forEach((f, i) => setTimeout(() => ding(f), i * 110));
    $("#gift-sub").textContent = "Your coupons. Tap to collect them all!";
    setTimeout(() => $("#coupons").classList.add("show"), 800);
  };
  X.coupons.forEach((c, k) => { const el = mk("div", "cp", `${c[0]}<small>${c[1]}</small>`); el.style.setProperty("--k", k);
    el.onclick = () => { if (el.classList.contains("got")) return; el.classList.add("got"); ding(900); got++;
      if (got === X.coupons.length) { $("#gift-sub").textContent = "All collected. Valid forever, no expiry \u2764"; burstConfetti(250); } };
    $("#coupons").appendChild(el); });

  /* ---------- LETTER ENVELOPE ---------- */
  $("#envelope").onclick = function () {
    if (this.classList.contains("open")) return;
    this.classList.add("open"); [523, 659, 784].forEach((f, i) => setTimeout(() => ding(f), i * 120));
    setTimeout(() => { this.style.display = "none"; $("#letter-card").classList.add("open"); }, 1000);
  };

  /* ---------- FINALE: fireworks ---------- */
  $("#fin-eyebrow").textContent = `Happy ${ordinal(CONFIG.turningAge)} birthday`;
  const cv = $("#fw"), cx = cv.getContext("2d"); let fw = false, rk = [], pa = [], timer, n = 0;
  const size = () => { cv.width = innerWidth; cv.height = innerHeight; }; addEventListener("resize", size);
  const launch = x => rk.push({ x: x ?? cv.width * (.1 + Math.random() * .8), y: cv.height, vy: -(9 + Math.random() * 4) * (cv.height / 700), ty: cv.height * (.12 + Math.random() * .35), c: `hsl(${330 + Math.random() * 40},100%,${62 + Math.random() * 14}%)` });
  function explode(x, y, c) {
    const heartShape = ++n % 3 === 0, cnt = heartShape ? 60 : 80;
    for (let i = 0; i < cnt; i++) {
      let vx, vy;
      if (heartShape) { const t = i / cnt * 2 * Math.PI; vx = 16 * Math.pow(Math.sin(t), 3) / 4.2; vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 4.2; }
      else { const a = Math.random() * 6.283, s = 1 + Math.random() * 4; vx = Math.cos(a) * s; vy = Math.sin(a) * s; }
      pa.push({ x, y, vx, vy, l: 1, c: heartShape ? "hsl(350,100%,65%)" : c });
    }
    ding(300 + Math.random() * 300);
  }
  function frame() {
    cx.globalCompositeOperation = "destination-out"; cx.fillStyle = "rgba(0,0,0,.2)"; cx.fillRect(0, 0, cv.width, cv.height);
    cx.globalCompositeOperation = "lighter";
    rk = rk.filter(r => { r.y += r.vy; cx.fillStyle = r.c; cx.beginPath(); cx.arc(r.x, r.y, 2.5, 0, 6.283); cx.fill(); if (r.y <= r.ty) { explode(r.x, r.y, r.c); return false; } return true; });
    pa = pa.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += .045; p.vx *= .985; p.l -= .011; cx.globalAlpha = Math.max(0, p.l); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, 2.2, 0, 6.283); cx.fill(); cx.globalAlpha = 1; return p.l > 0; });
    if (fw) requestAnimationFrame(frame);
  }
  document.addEventListener("page", e => {
    if (e.detail === "finale") { setTimeout(() => { if (fw) return; fw = true; size(); document.body.classList.add("fw-on"); frame(); launch(); timer = setInterval(() => launch(), 750); }, 900); }
    else if (fw) { fw = false; clearInterval(timer); document.body.classList.remove("fw-on"); rk = []; pa = []; }
  });
  $("#finale").addEventListener("pointerdown", e => { if (fw) { launch(e.clientX); launch(); } });
})();
