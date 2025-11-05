// =========================
// Romantic Proposal — Script
// =========================

// Local storage helper
const store = {
  get(k, d = null) {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  },
};

// Animated floating hearts background
const heartsEl = document.getElementById("hearts");
const colors = ["#ff8fbd", "#b39ddb", "#ffd1e6", "#a8e6cf", "#ffb3c1"];
function spawnHearts() {
  if (!heartsEl) return;
  const total = Math.min(80, Math.floor(window.innerWidth / 14));
  heartsEl.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const h = document.createElement("i");
    h.className = "heart";
    const left = Math.random() * 100; // vw
    const delay = Math.random() * 10; // s
    const scale = 0.6 + Math.random() * 0.9;
    const color = colors[i % colors.length];
    h.style.left = left + "vw";
    h.style.bottom = -10 + Math.random() * 20 + "vh";
    h.style.animationDelay = delay + "s";
    h.style.animationDuration = 10 + Math.random() * 12 + "s";
    h.style.opacity = 0.15 + Math.random() * 0.4;
    h.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,.15))";
    h.style.transform = `rotate(45deg) scale(${scale})`;
    h.style.setProperty("--accent", color);
    heartsEl.appendChild(h);
  }
}
spawnHearts();
addEventListener("resize", () => {
  clearTimeout(window.__hR);
  window.__hR = setTimeout(spawnHearts, 150);
});

// Typewriter effect
const typer = document.getElementById("typewriter");
const lines = [
  () => `Hi <b>${store.get("herName", "you")}</b>,`,
  () => `I have something simple but important to say…`,
  () => `I <b>really</b> like you. Like, a lot.`,
  () => `Would you make me the luckiest and be mine? 💞`,
];
async function typeText(el, texts) {
  if (!el) return;
  for (const t of texts) {
    const text = typeof t === "function" ? t() : t;
    await typeOnce(el, text);
    await pause(500);
    el.innerHTML += "<br/>";
  }
}
function typeOnce(el, html) {
  return new Promise((resolve) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || "";
    el.innerHTML = "";
    let i = 0;
    const speed = 26; // ms per char
    const timer = setInterval(() => {
      i++;
      const raw = text.slice(0, i);
      el.textContent = raw;
      if (i >= text.length) {
        clearInterval(timer);
        el.innerHTML = html;
        resolve();
      }
    }, speed);
  });
}
function pause(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

typeText(typer, lines);

// Name personalization
const dearLine = document.getElementById("dearLine");
function refreshName() {
  const name = store.get("herName", "you");
  const brandTitle = document.getElementById("brandTitle");
  if (brandTitle) brandTitle.textContent = `For ${name}`;
  if (dearLine) dearLine.textContent = `Dear ${name}, this one's just for you.`;
}
refreshName();

// Love meter
const meterFill = document.getElementById("meterFill");
let meter = store.get("meter", 12);
function drawMeter() {
  if (meterFill) meterFill.style.width = Math.min(100, meter) + "%";
}
function bumpMeter(n = 6) {
  meter = Math.min(100, meter + n);
  store.set("meter", meter);
  drawMeter();
}
drawMeter();

// Buttons — YES / NO
const yesBtn = document.getElementById("yesBtn");
const yesBtn2 = document.getElementById("yesBtn2");
const noBtn = document.getElementById("noBtn");

function mischievousMove(btn) {
  if (!btn) return;
  const pad = 12;
  const x =
    Math.random() * (window.innerWidth - btn.offsetWidth - pad * 2) + pad;
  const y =
    Math.random() * (window.innerHeight - btn.offsetHeight - pad * 2) + pad;
  btn.style.position = "fixed";
  btn.style.left = x + "px";
  btn.style.top = y + "px";
}
if (noBtn) {
  noBtn.addEventListener("mouseenter", () => mischievousMove(noBtn));
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    mischievousMove(noBtn);
  });
}

// Overlay after YES
const overlay = document.getElementById("overlay");
const closeOverlay = document.getElementById("closeOverlay");
const celebrateBtn = document.getElementById("celebrateBtn");
function sayYes() {
  if (overlay) {
    overlay.classList.add("show");
  }
  confettiBurst();
  bumpMeter(20);
}
if (yesBtn) yesBtn.addEventListener("click", sayYes);
if (yesBtn2) yesBtn2.addEventListener("click", sayYes);
if (closeOverlay)
  closeOverlay.addEventListener(
    "click",
    () => overlay && overlay.classList.remove("show")
  );
if (celebrateBtn)
  celebrateBtn.addEventListener("click", () => {
    confettiBurst(400);
    heartStorm();
  });

// Confetti (lightweight)
function confettiBurst(amount = 220) {
  const particles = amount;
  for (let i = 0; i < particles; i++) {
    const p = document.createElement("i");
    p.style.position = "fixed";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = "-10px";
    p.style.width = "8px";
    p.style.height = "12px";
    p.style.background = colors[i % colors.length];
    p.style.opacity = 0.9;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    p.style.borderRadius = "2px";
    p.style.zIndex = 8;
    document.body.appendChild(p);
    const endY = window.innerHeight + 20;
    const dx = (Math.random() * 2 - 1) * 120; // horizontal drift
    const duration = 1200 + Math.random() * 1200;
    const startX = p.getBoundingClientRect().left;
    const start = performance.now();
    (function animate(t) {
      const elapsed = t - start;
      const prog = Math.min(1, elapsed / duration);
      const x = startX + dx * prog + Math.sin(prog * 6 * Math.PI) * 16;
      const y = -10 + prog * endY;
      p.style.transform = `translate(${x - startX}px, ${y}px) rotate(${
        prog * 720
      }deg)`;
      p.style.opacity = 1 - prog;
      if (prog < 1) {
        requestAnimationFrame(animate);
      } else {
        p.remove();
      }
    })(start);
  }
}
function heartStorm() {
  for (let i = 0; i < 30; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.style.position = "fixed";
    h.style.left = window.innerWidth / 2 + "px";
    h.style.top = window.innerHeight / 2 + "px";
    h.style.animation = "none";
    h.style.opacity = 0.95;
    h.style.filter = "drop-shadow(0 6px 14px rgba(0,0,0,.15))";
    document.body.appendChild(h);
    const dx = (Math.random() * 2 - 1) * 220;
    const dy = (Math.random() * 2 - 1) * 160;
    const dur = 900 + Math.random() * 600;
    const start = performance.now();
    (function go(t) {
      const e = t - start;
      const p = Math.min(1, e / dur);
      h.style.transform = `translate(${dx * p}px, ${
        dy * p
      }px) rotate(45deg) scale(${1.2 - p * 0.3})`;
      h.style.opacity = 1 - p;
      if (p < 1) requestAnimationFrame(go);
      else h.remove();
    })(start);
  }
}

// Music controls
const music = document.getElementById("music");
const playBtn = document.getElementById("playBtn");
let playing = false;
if (playBtn) {
  playBtn.addEventListener("click", async () => {
    try {
      if (!playing) {
        await music.play();
        playBtn.textContent = "Pause music ⏸";
      } else {
        music.pause();
        playBtn.textContent = "Play music ▶️";
      }
      playing = !playing;
    } catch (e) {
      alert("Your browser blocked autoplay. Tap again to play ✨");
    }
  });
}

// Reasons scroller
const reasons = [
  "Your smile is my favorite sunrise",
  "You listen like it’s an art",
  "You make ordinary days feel special",
  "You are kind in ways most people don’t see",
  "Your laugh is ridiculously contagious",
  "You inspire me to be better",
  "You’re my calm & my excitement",
  "You remember the little things",
  "You make me feel at home",
  "You are, simply, you — perfect to me",
];
const scroller = document.getElementById("reasons");
if (scroller) {
  reasons.forEach((r, i) => {
    const d = document.createElement("div");
    d.className = "reason";
    d.innerHTML = `<small class="muted">#${
      i + 1
    }</small><h4>${r}</h4><p class="muted">(Swipe ➡ on mobile)</p>`;
    scroller.appendChild(d);
  });
}

// Compliment generator
const compliments = [
  "If I had a garden, your smile would be the sunflower. 🌻",
  "You make my heart do tiny happy cartwheels. 🤸‍♂️",
  "I could read your texts like poetry. 📖",
  "You’re the yes to all my maybes. ✔️",
  "Every good song reminds me of you. 🎵",
];
const complimentBtn = document.getElementById("complimentBtn");
if (complimentBtn) {
  complimentBtn.addEventListener("click", () => {
    const msg = compliments[Math.floor(Math.random() * compliments.length)];
    bumpMeter(4);
    toast(msg);
  });
}

// Toasts
function toast(message) {
  const t = document.createElement("div");
  t.textContent = message;
  t.style.position = "fixed";
  t.style.left = "50%";
  t.style.bottom = "24px";
  t.style.transform = "translateX(-50%)";
  t.style.background =
    "linear-gradient(90deg, rgba(255,255,255,.7), rgba(255,255,255,.55))";
  t.style.border = "1px solid rgba(42,34,64,.12)";
  t.style.padding = "10px 14px";
  t.style.borderRadius = "999px";
  t.style.backdropFilter = "blur(6px)";
  t.style.zIndex = 10;
  t.style.fontWeight = "600";
  t.style.color = "#2a2240";
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.transition = "all .6s ease";
    t.style.opacity = "0";
    t.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => t.remove(), 600);
  }, 1800);
}

// Date counter
const dateInput = document.getElementById("dateInput");
const saveDate = document.getElementById("saveDate");
const dEls = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  mins: document.getElementById("mins"),
  secs: document.getElementById("secs"),
};
function updateCounter() {
  const start = new Date(store.get("startDate", new Date()));
  const now = new Date();
  let diff = Math.max(0, now - start);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);
  const secs = Math.floor(diff / 1000);
  if (dEls.days) dEls.days.textContent = days;
  if (dEls.hours) dEls.hours.textContent = hours;
  if (dEls.mins) dEls.mins.textContent = mins;
  if (dEls.secs) dEls.secs.textContent = secs;
}
setInterval(updateCounter, 1000);
updateCounter();
if (dateInput) {
  dateInput.value = (function () {
    const d = new Date(store.get("startDate", new Date()));
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  })();
}
if (saveDate) {
  saveDate.addEventListener("click", () => {
    const v = dateInput && dateInput.value;
    if (!v) {
      toast("Pick a date first ✨");
      return;
    }
    store.set("startDate", v);
    updateCounter();
    toast("Saved! ⏰");
    bumpMeter(3);
  });
}

// Photo frame
const photoInput = document.getElementById("photoInput");
const photoFrame = document.getElementById("photoFrame");
if (photoInput) {
  photoInput.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => URL.revokeObjectURL(url);
    img.src = url;
    img.alt = "Your photo";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "16px";
    img.style.boxShadow = "0 20px 40px rgba(42,34,64,.15)";
    img.style.border = "6px solid rgba(42,34,64,.08)";
    if (photoFrame) {
      photoFrame.innerHTML = "";
      photoFrame.appendChild(img);
    }
    bumpMeter(5);
  });
}

// Personalize prompt (name)
(function maybeAskName() {
  const nameFromLS = store.get("herName", null);
  if (nameFromLS) return;
  const dlg = document.createElement("dialog");
  dlg.innerHTML = `
    <form method="dialog">
      <div class="dlg-body">
        <h3 style="margin:4px 0 8px">Before we start… 💫</h3>
        <div class="field"><label>What should I call you?</label><input id="herNameInput" placeholder="Your name" required></div>
        <div class="field"><label>When did I start liking you? (optional)</label><input id="startDateInput" type="datetime-local"></div>
        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px">
          <button class="btn" value="cancel">Skip</button>
          <button class="btn btn-yes" value="ok">Save</button>
        </div>
      </div>
    </form>`;
  document.body.appendChild(dlg);
  dlg.showModal();
  dlg.addEventListener("close", () => {
    const name = dlg.querySelector("#herNameInput")?.value?.trim();
    const date = dlg.querySelector("#startDateInput")?.value;
    if (name) {
      store.set("herName", name);
      refreshName();
      typeText(typer, []);
    }
    if (date) {
      store.set("startDate", date);
      if (dateInput) {
        dateInput.value = date;
      }
      updateCounter();
    }
    dlg.remove();
  });
})();

// Accessibility niceties
addEventListener("keydown", (e) => {
  if (e.key && e.key.toLowerCase() === "y") {
    sayYes();
  }
  if (e.key === "Escape" && overlay) {
    overlay.classList.remove("show");
  }
});
