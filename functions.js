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
  2) 第一章：チャット 1通ずつフェードイン
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
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }),
      invalidateOnRefresh: true,
    });
  });
}

/* -------------------------
  3) 背景画像：bg-start〜bg-end
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
  4) 背景GIF：gif-start〜gif-end
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
        overwrite: "auto",
      });
    },
  });
}

/* -------------------------
  5) 扉 → 飛び込み → 店内背景に切り替え
------------------------- */
function setupDoorScene() {
  const wrap = document.querySelector(".door-wrap");
  if (!wrap) return;

  const scene = wrap.querySelector(".door-scene");
  const door = wrap.querySelector(".door");
  const interior = wrap.querySelector(".interior");
  const veil = wrap.querySelector(".veil");
  const interiorBg = document.querySelector(".interior-bg");
  if (!scene || !door || !interior || !interiorBg) return;

  const trigger = document.querySelector(".door-trigger") || wrap;

  gsap.set(scene, { autoAlpha: 0, y: 180, transformOrigin: "50% 50%", scale: 1 });
  gsap.set(door, { rotateY: 0, transformOrigin: "left center", opacity: 1 });
  gsap.set(interior, { opacity: 0, scale: 1.12, transformOrigin: "50% 50%" });
  gsap.set(veil, { opacity: 0.25 });
  gsap.set(interiorBg, { opacity: 0 });

  // 下から出現（1回）
  ScrollTrigger.create({
    trigger: wrap,
    start: "top 95%",
    once: true,
    onEnter: () => {
      gsap.to(scene, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
  });

  // 開く + 飛び込み
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top 20%",
      end: "+=1600",
      scrub: true,
      pin: wrap,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onLeaveBack: () => body.classList.remove("inside"),
    },
  });

  tl.to(interior, { opacity: 1, scale: 1.0, ease: "none" }, 0.05)
    .to(door, { rotateY: -115, ease: "none" }, 0.15)
    .to(veil, { opacity: 0.0, ease: "none" }, 0.60);

  // 飛び込み開始
  tl.add(() => body.classList.add("inside"), 0.78)
    .to(scene, { scale: 1.25, autoAlpha: 0, ease: "none" }, 0.78)
    .to(interiorBg, { opacity: 1, ease: "none" }, 0.78)
    .to(door, { opacity: 0, ease: "none" }, 0.80);
}

/* -------------------------
  6) 店内 harunobu（左下で固定）ふわっと＋上下ゆらゆら
------------------------- */
function setupInteriorHarunobu() {
  const img = document.querySelector(".interior-harunobu");
  if (!img) return;

  // inside になるまで隠す
  gsap.set(img, { autoAlpha: 0 });

  // inside中だけ表示
  ScrollTrigger.create({
    trigger: ".door-wrap",
    start: "top top",
    end: "+=1600",
    scrub: true,
    onUpdate: () => {
      gsap.to(img, { autoAlpha: body.classList.contains("inside") ? 1 : 0, duration: 0.2, overwrite: "auto" });
    },
  });

  // ゆらゆら（常時じゃなく、insideのときだけ見えるのでOK）
  gsap.to(img, {
    y: -10,
    duration: 1.6,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}

/* -------------------------
  7) 第二章：固定吹き出し（2個）更新
------------------------- */
function setupCornerChatChapter2() {
  const ui = document.querySelector(".corner-ui");
  const bubbleLeft = document.getElementById("bubbleLeft");
  const bubbleRight = document.getElementById("bubbleRight");
  const msgs = gsap.utils.toArray(".chat-chapter2 .c2-msg");

  if (!ui || !bubbleLeft || !bubbleRight || msgs.length === 0) return;

  // 第二章に入るまで隠す
  gsap.set(ui, { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: "#interview-start201",
    start: "top 70%",
    onEnter: () => gsap.to(ui, { autoAlpha: 1, duration: 0.25, overwrite: "auto" }),
    onEnterBack: () => gsap.to(ui, { autoAlpha: 1, duration: 0.25, overwrite: "auto" }),
    onLeaveBack: () => gsap.to(ui, { autoAlpha: 0, duration: 0.2, overwrite: "auto" }),
  });

  const show = (side, text) => {
    const target = side === "left" ? bubbleLeft : bubbleRight;
    target.textContent = text;
    target.classList.add("is-on");

    gsap.fromTo(
      target,
      { autoAlpha: 0, y: 10, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out", overwrite: "auto" }
    );
  };

  msgs.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 60%",
      onEnter: () => show((el.dataset.side || "left").toLowerCase(), el.textContent.trim()),
      onEnterBack: () => show((el.dataset.side || "left").toLowerCase(), el.textContent.trim()),
      invalidateOnRefresh: true,
    });
  });

  // 初期表示を防ぐ（入った瞬間に1つ目）
  const first = msgs[0];
  if (first) show((first.dataset.side || "left").toLowerCase(), first.textContent.trim());
}

/* -------------------------
  8) クライマックス：白へフェードイン（climax-start〜climax-end）
------------------------- */
function setupClimaxWhite() {
  const overlay = document.querySelector(".climax-overlay");
  const start = document.querySelector(".climax-start");
  const end = document.querySelector(".climax-end");
  if (!overlay || !start || !end) return;

  gsap.set(overlay, { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: start,
    start: "top 75%",
    endTrigger: end,
    end: "top 75%",
    onToggle: (self) => {
      gsap.to(overlay, {
        autoAlpha: self.isActive ? 1 : 0,
        duration: self.isActive ? 0.8 : 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
  });
}

/* -------------------------
  起動（loadは1回にまとめる）
------------------------- */
window.addEventListener("load", () => {
  setupBookMenu();
  setupChatReveal();
  setupBackgroundRange();
  setupBgGifRange();
  setupDoorScene();
  setupInteriorHarunobu();
  setupCornerChatChapter2();
  setupClimaxWhite();
  setupRyoriGifRange();

  ScrollTrigger.refresh();
  setTimeout(() => ScrollTrigger.refresh(), 100);
});

function setupRyoriGifRange(){
  const gif = document.querySelector(".ryori-gif");
  const start = document.querySelector(".ryori-start");
  const end   = document.querySelector(".ryori-end");

  if(!gif || !start || !end) return;

  gsap.set(gif, { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: start,
    start: "top 70%",
    endTrigger: end,
    end: "top 70%",
    onToggle: (self) => {
      gsap.to(gif, {
        autoAlpha: self.isActive ? 1 : 0,
        duration: 0.6,
        ease: "power2.out"
      });
    },
    // markers: true, // ← 出ない時は一回ON
  });
}
