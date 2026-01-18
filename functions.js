gsap.registerPlugin(ScrollTrigger);

const body = document.body;

/* -------------------------
  1) 本（表紙→開く）
------------------------- */
function setupBookMenu() {
  const wrap = document.querySelector(".book-wrap");
  if (!wrap) return;

  gsap.set(".cover", { rotateY: 0 });
  gsap.set(".spread", { opacity: 0, visibility: "hidden", pointerEvents: "none" });

  gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: "top top",
      end: "+=1200",
      scrub: true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })
    .to(".cover", { rotateY: -160, ease: "none" }, 0)
    .to(".spread", { opacity: 1, visibility: "visible", pointerEvents: "auto", ease: "none" }, 0.2);
}

/* -------------------------
  2) 第一章チャット：1通ずつフェードイン
------------------------- */
function setupChatReveal() {
  const msgs = gsap.utils.toArray(".chat .msg");
  if (!msgs.length) return;

  msgs.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 16 });

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
      },
    });
  });
}

/* -------------------------
  3) 背景画像：bg-start〜bg-endの間だけ表示
------------------------- */
function setupBackgroundRange() {
  const bg = document.querySelector(".bg-image");
  if (!bg) return;

  gsap.set(bg, { opacity: 0 });

  ScrollTrigger.create({
    trigger: ".bg-start",
    start: "top 70%",
    onEnter: () => gsap.to(bg, { opacity: 1, duration: 0.8, ease: "power2.out" }),
    onEnterBack: () => gsap.to(bg, { opacity: 1, duration: 0.6, ease: "power2.out" }),
  });

  ScrollTrigger.create({
    trigger: ".bg-end",
    start: "top 70%",
    onEnter: () => gsap.to(bg, { opacity: 0, duration: 1.2, ease: "power1.out" }),
    onEnterBack: () => gsap.to(bg, { opacity: 1, duration: 0.6, ease: "power2.out" }),
  });
}

/* -------------------------
  4) 背景GIF：gif-start〜gif-endの間だけ表示
------------------------- */
function setupBgGifRange() {
  const bgGif = document.querySelector(".bg-gif");
  const gifStart = document.querySelector(".gif-start");
  const gifEnd = document.querySelector(".gif-end");
  if (!bgGif || !gifStart || !gifEnd) return;

  gsap.set(bgGif, { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: gifStart,
    start: "top 75%",
    endTrigger: gifEnd,
    end: "top 75%",
    onToggle: (self) => {
      gsap.to(bgGif, {
        autoAlpha: self.isActive ? 1 : 0,
        duration: self.isActive ? 0.7 : 0.9,
        ease: "power2.out",
      });
    },
  });
}

/* -------------------------
  5) 扉 → 飛び込み → 店内背景に切り替え
  - 下から出現 → pin+scrubで開く → 飛び込み → inside付与
------------------------- */
function setupDoorScene() {
  const wrap = document.querySelector(".door-wrap");
  if (!wrap) return;

  const scene = wrap.querySelector(".door-scene");
  const door = wrap.querySelector(".door");
  const interior = wrap.querySelector(".interior");
  const veil = wrap.querySelector(".veil");
  const interiorBg = document.querySelector(".interior-bg"); // 画面全体の店内背景

  if (!scene || !door || !interior || !interiorBg) return;

  const trigger = document.querySelector(".door-trigger") || wrap;

  // 初期状態
  gsap.set(scene, { autoAlpha: 0, y: 180, transformOrigin: "50% 50%", scale: 1 });
  gsap.set(door, { rotateY: 0, transformOrigin: "left center", opacity: 1 });
  gsap.set(interior, { opacity: 0, scale: 1.12, transformOrigin: "50% 50%" });
  if (veil) gsap.set(veil, { opacity: 0.25 });
  gsap.set(interiorBg, { opacity: 0 });

  // 下から出現（1回だけ）
  ScrollTrigger.create({
    trigger: wrap,
    start: "top 95%",
    once: true,
    onEnter: () => {
      gsap.to(scene, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", overwrite: "auto" });
    },
  });

  // 開く＋飛び込み（pin+scrub）
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: "top 20%",  // ←開き始めの位置（遅くしたいなら 30%/40%）
      end: "+=1600",
      scrub: true,
      pin: wrap,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onLeaveBack: () => body.classList.remove("inside"),
    },
  });

  tl.to(interior, { opacity: 1, scale: 1.0, ease: "none" }, 0.05);
  tl.to(door, { rotateY: -115, ease: "none" }, 0.15);
  if (veil) tl.to(veil, { opacity: 0.0, ease: "none" }, 0.60);

  // 飛び込み開始（ここから inside ON）
  tl.add(() => body.classList.add("inside"), 0.78);

  tl.to(scene, { scale: 1.25, autoAlpha: 0, ease: "none" }, 0.78);
  tl.to(interiorBg, { opacity: 1, ease: "none" }, 0.78);
  tl.to(door, { opacity: 0, ease: "none" }, 0.80);
}

/* -------------------------
  6) 店内に入ったら harunobu 出す（CSS inside運用の補助）
------------------------- */
function setupInteriorHarunobu() {
  const img = document.querySelector(".interior-harunobu");
  if (!img) return;

  gsap.set(img, { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: ".door-wrap",
    start: "top top",
    end: "+=1600",
    scrub: true,
    onUpdate: () => {
      gsap.to(img, {
        autoAlpha: body.classList.contains("inside") ? 1 : 0,
        duration: 0.2,
        overwrite: "auto",
      });
    },
  });
}

/* -------------------------
  7) 第二章：固定吹き出し（左下＆右下）をスクロールで差し替え
  - 第二章に入るまで corner-ui を表示しない
  - c2-msg は「トリガー用」（表示させないのはCSS側）
------------------------- */
function setupCornerChatChapter2() {
  const ui = document.querySelector(".corner-ui");
  const bubbleLeft = document.getElementById("bubbleLeft");
  const bubbleRight = document.getElementById("bubbleRight");
  const startAnchor = document.querySelector("#interview-start201");
  const msgs = gsap.utils.toArray(".chat-chapter2 .c2-msg");

  if (!ui || !bubbleLeft || !bubbleRight || !startAnchor || msgs.length === 0) return;

  // 第二章に入るまでUIを隠す
  gsap.set(ui, { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: startAnchor,
    start: "top 70%",
    onEnter: () => gsap.to(ui, { autoAlpha: 1, duration: 0.25, overwrite: "auto" }),
    onEnterBack: () => gsap.to(ui, { autoAlpha: 1, duration: 0.25, overwrite: "auto" }),
    onLeaveBack: () => gsap.to(ui, { autoAlpha: 0, duration: 0.2, overwrite: "auto" }),
  });

  const show = (side, text) => {
    const target = side === "left" ? bubbleLeft : bubbleRight;
    target.textContent = text;

    gsap.fromTo(
      target,
      { autoAlpha: 0, y: 10, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out", overwrite: "auto" }
    );
  };

  // 各メッセージをスクロールで発火
  msgs.forEach((el) => {
  const sideRaw = (el.dataset.side || "left");
  const side = sideRaw.trim().toLowerCase();  // ★trim()が重要
  const text = el.textContent.trim();

  ScrollTrigger.create({
    trigger: el,
    start: "top 60%",
    onEnter: () => show(side === "left" ? "left" : "right", text),
    onEnterBack: () => show(side === "left" ? "left" : "right", text),
  });
});


  // 初期表示（第二章に入った瞬間に空を防ぐ）
  const first = msgs[0];
  if (first) {
    show((first.dataset.side || "left").toLowerCase(), first.textContent.trim());
  }
}

/* -------------------------
  起動（loadは1回だけ）
------------------------- */
window.addEventListener("load", () => {
  setupBookMenu();
  setupChatReveal();
  setupBackgroundRange();
  setupBgGifRange();
  setupDoorScene();
  setupInteriorHarunobu();
  setupCornerChatChapter2();

  ScrollTrigger.refresh();
  setTimeout(() => ScrollTrigger.refresh(), 100);
});
