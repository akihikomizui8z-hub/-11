gsap.registerPlugin(ScrollTrigger);

// 出現
function animateIn(el) {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    overwrite: "auto",
  });
}

// 退場（今回は「一度出たら消さない」運用なら使わなくてもOK）
function animateOut(el) {
  gsap.to(el, {
    opacity: 0,
    y: 24,
    duration: 0.4,
    ease: "power2.in",
    overwrite: "auto",
  });
}

// 本（表紙→開く）
function setupBookMenu() {
  const wrap = document.querySelector(".book-wrap");
  if (!wrap) return;

  gsap.set(".cover", { rotateY: 0 });
  gsap.set(".spread", { opacity: 0, visibility: "hidden", pointerEvents: "none" });

  gsap.timeline({
    scrollTrigger: {
      trigger: ".book-wrap",
      start: "top top",
      end: "+=1200",
      scrub: true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      // ピン区間が終わったら、本文側の位置を再計算
      onLeave: () => ScrollTrigger.refresh(),
      onLeaveBack: () => ScrollTrigger.refresh(),
    },
  })
    .to(".cover", { rotateY: -160, ease: "none" }, 0)
    .to(
      ".spread",
      {
        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",
        duration: 0.2,
        ease: "none",
      },
      0.2
    );
}

// 本文（会話）reveal：安定版
function setupScrollEffects() {
  const elements = gsap.utils.toArray(".js-reveal");

  elements.forEach((el) => {
    // 初期状態をJSで固定（CSSだけに頼らない）
    gsap.set(el, { opacity: 0, y: 24 });

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => animateIn(el),
      onEnterBack: () => animateIn(el),

      // 「一度出たら消さない」なら下2つは不要（安定）
      // onLeave: () => animateOut(el),
      // onLeaveBack: () => animateOut(el),

      invalidateOnRefresh: true,
    });
  });
}

window.addEventListener("load", () => {
  setupBookMenu();
  setupScrollEffects();
  setupChatReveal();     // ←追加
  setupBackgroundFade();   // ← 追加
  setupBackgroundRange();
  ScrollTrigger.refresh();



  // フォント読み込み等でズレることがあるので二段refreshが安定
  ScrollTrigger.refresh();
  setTimeout(() => ScrollTrigger.refresh(), 100);

  
  

});

function setupChatReveal() {
  const msgs = gsap.utils.toArray(".chat .msg");

  msgs.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 16 });

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true, // 1回だけ出す（戻したら消える挙動にしたいなら外す）
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });
  });
}

function setupBackgroundRange(){
  gsap.set(".bg-image", { opacity: 0 });

  // 出す
  ScrollTrigger.create({
    trigger: ".bg-start",
    start: "top 70%",
    onEnter: () => gsap.to(".bg-image", { opacity: 1, duration: 0.8, ease: "power2.out" }),
    onEnterBack: () => gsap.to(".bg-image", { opacity: 1, duration: 0.6, ease: "power2.out" }),
  });

  // 終わらせる（消す）
  ScrollTrigger.create({
    trigger: ".bg-end",
    start: "top 70%",
    onEnter: () => gsap.to(".bg-image", { opacity: 0, duration: 1.2, ease: "power1.out" }),
    onEnterBack: () => gsap.to(".bg-image", { opacity: 1, duration: 0.6, ease: "power2.out" }), // 戻ったらまた出す
  });
}

window.addEventListener("load", () => {
  gsap.set(".bg-image", { opacity: 0 });

  // 背景を出す
  ScrollTrigger.create({
    trigger: ".bg-start",
    start: "top 75%",
    onEnter: () =>
      gsap.to(".bg-image", {
        opacity: 1,
        duration: 1.0,
        ease: "power2.out",
      }),
    onEnterBack: () =>
      gsap.to(".bg-image", {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }),
  });

  // 背景を終わらせる
  ScrollTrigger.create({
    trigger: ".bg-end",
    start: "top 75%",
    onEnter: () =>
      gsap.to(".bg-image", {
        opacity: 0,
        duration: 1.4,   // ← 余韻を残して消える
        ease: "power1.out",
      }),
    onEnterBack: () =>
      gsap.to(".bg-image", {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }),
  });

  ScrollTrigger.refresh();
});

window.addEventListener("load", () => {
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
    // markers: true, // 調整したい時だけON
  });
});

