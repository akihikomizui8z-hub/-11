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
  setupDoorScene();
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
setupInteriorHarunobu();
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

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  setupDoorScene();
  ScrollTrigger.refresh();
});

function setupDoorScene(){
  const wrap = document.querySelector(".door-wrap");
  const trigger = document.querySelector(".door-trigger");
  if(!wrap) return;

  const scene    = wrap.querySelector(".door-scene");
  const door     = wrap.querySelector(".door");
  const interior = wrap.querySelector(".interior");
  const veil     = wrap.querySelector(".veil");

  if(!scene || !door || !interior) return;

  // 初期状態（CSSだけに頼らずJSで固定）
  gsap.set(".interior-bg", { opacity: 0 });
  gsap.set(".door-scene", { scale: 1, autoAlpha: 1, transformOrigin: "50% 50%" });
  gsap.set(scene,    { opacity: 0, y: 180 });
  gsap.set(interior, { opacity: 0, scale: 1.12, transformOrigin: "50% 50%" });
  gsap.set(veil,     { opacity: 0.25 });
  gsap.set(door,     { rotateY: 0, transformOrigin: "left center", opacity: 1 });

  // ① 下から出る（scrubじゃなく再生）
  ScrollTrigger.create({
    trigger: wrap,
    start: "top 95%",
    onEnter: () => {
      gsap.to(scene, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    },

    // markers: true,
  });

  // ② その後スクロールで「開く」（pin+scrub）
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: "top 10%",   // ★ここを変えると「開き始める位置」が変わる
      end: "+=1600",
      scrub: true,
      pin: wrap,
      anticipatePin: 1,
      // markers: true,
    }
  });

  tl.to(interior, { opacity: 1, scale: 1.0, ease: "none" }, 0.05)
    .to(door,     { rotateY: -115, ease: "none" }, 0.15)  // ★開く
    .to(veil,     { opacity: 0.0, ease: "none" }, 0.60)
    .to(door,     { opacity: 0, ease: "none" }, 0.85);
    // 飛び込み（シーン消える + 背景ON）
    tl.call(() => document.body.classList.add("inside"), null, 0.80);
tl.call(() => document.body.classList.remove("inside"), null, 0.05);
  tl.to(".door-scene",   { scale: 1.25, autoAlpha: 0, ease: "none" }, 0.80)
    .to(".interior-bg",  { opacity: 1, ease: "none" },              0.80)
    

    

  // ★これを追加：door側の店内を後で消して残骸を防ぐ
    .to(".inside",     { opacity: 0, ease: "none" },              0.82);

}

function setupInteriorHarunobu(){
  const img = document.querySelector(".interior-harunobu");
  const body = document.body;

  if(!img) return;

  gsap.set(img, { x: 0, y: 0, autoAlpha: 0 }); // 念のため初期化

  ScrollTrigger.create({
    trigger: ".door-wrap",
    start: "top top",
    end: "+=1600",     // 扉演出と同じendに合わせる
    scrub: true,

    onUpdate: (self) => {
      if (self.progress > 0.60) body.classList.add("inside");  // ここで出る
      else body.classList.remove("inside");                    // 戻ったら消す
    }
  });
  
}

