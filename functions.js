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
