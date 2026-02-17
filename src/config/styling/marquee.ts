document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    ".marquee"
  ) as HTMLDivElement;
  const scroller = document.querySelector(
    ".marquee-content"
  ) as HTMLDivElement;
  const btnLeft = document.getElementById("marquee-scroll-left");
  const btnRight = document.getElementById(
    "marquee-scroll-right"
  );

  if (!container || !scroller) return;

  const bufferSize = 2;
  let items = Array.from(
    scroller.querySelectorAll(".marquee-item")
  ) as HTMLDivElement[];
  const originalCount = items.length;
  if (originalCount === 0) return;

  let itemWidth = 0;
  let sequenceWidth = 0;
  let targetScrollX = 0;
  let currentScrollX = 0;
  let isAnimating = false;
  let isDown = false;
  let lastTouchX = 0;
  let touchVelocity = 0;
  let lastTouchTime = 0;
  const smoothFactor = 0.1;
  const snapThreshold = 0.1;

  // setup clones
  const setupClones = () => {
    // remove existing clones
    scroller.querySelectorAll(".clone").forEach(c => c.remove());

    const originals = Array.from(
      scroller.querySelectorAll(".marquee-item")
    ) as HTMLDivElement[];

    // add clones after
    for (let i = 0; i < bufferSize; i++) {
      originals.forEach(item => {
        const clone = item.cloneNode(true) as HTMLDivElement;
        clone.classList.add("clone");
        scroller.appendChild(clone);
      });
    }

    // add clones before
    const beforeContainer = document.createDocumentFragment();
    for (let i = 0; i < bufferSize; i++) {
      originals.forEach(item => {
        const clone = item.cloneNode(true) as HTMLDivElement;
        clone.classList.add("clone");
        beforeContainer.appendChild(clone);
      });
    }
    scroller.insertBefore(beforeContainer, scroller.firstChild);

    items = Array.from(
      scroller.querySelectorAll(".marquee-item")
    ) as HTMLDivElement[];
  };

  const updateDimensions = () => {
    // capture item width
    const oldItemWidth = itemWidth;
    itemWidth = container.clientWidth;
    if (itemWidth === 0) return;

    sequenceWidth = originalCount * itemWidth;

    // standardize width
    scroller.style.width = `${items.length * itemWidth}px`;
    items.forEach(item => {
      item.style.width = `${itemWidth}px`;
      item.style.flex = `0 0 ${itemWidth}px`;
      item.style.maxWidth = `${itemWidth}px`;
    });

    if (oldItemWidth > 0) {
      const scrollRatio = targetScrollX / oldItemWidth;
      const relativeScroll = scrollRatio % originalCount;
      targetScrollX =
        (bufferSize * originalCount + relativeScroll) * itemWidth;
    } else {
      targetScrollX = bufferSize * sequenceWidth;
    }

    currentScrollX = targetScrollX;
    scroller.style.transform = `translateX(-${currentScrollX}px)`;
  };

  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  const animate = () => {
    if (!isDown && Math.abs(touchVelocity) < 0.1) {
      // snap to nearest item if not interacting and close to one
      const nearestItemScroll =
        Math.round(targetScrollX / itemWidth) * itemWidth;
      if (
        Math.abs(targetScrollX - nearestItemScroll) <
        itemWidth * 0.5
      ) {
        targetScrollX = lerp(
          targetScrollX,
          nearestItemScroll,
          0.1
        );
      }
    }

    currentScrollX = lerp(
      currentScrollX,
      targetScrollX,
      smoothFactor
    );

    // boundary reset
    if (currentScrollX > (bufferSize + 1) * sequenceWidth) {
      currentScrollX -= sequenceWidth;
      targetScrollX -= sequenceWidth;
    } else if (
      currentScrollX <
      (bufferSize - 1) * sequenceWidth
    ) {
      currentScrollX += sequenceWidth;
      targetScrollX += sequenceWidth;
    }

    scroller.style.transform = `translateX(-${currentScrollX}px)`;

    // fade in-out and scale items based on distance from center
    items.forEach((item, index) => {
      const itemCenter = index * itemWidth;
      const distance = Math.abs(currentScrollX - itemCenter);
      const progress = Math.min(distance / itemWidth, 1); // 0 at center, 1 at edge

      const opacity = 1 - progress;
      const scale = 1 - progress * 0.1; // scale down as it leaves
      const yOffset = progress * 20; // slide down as it leaves

      item.style.opacity = opacity.toString();
      // NOTE: apply transform to the video container specifically
      // to keep layout stable
      const content = item.querySelector(
        ".marquee-item-content"
      ) as HTMLElement;
      if (content) {
        content.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
      }
    });

    const diff = Math.abs(targetScrollX - currentScrollX);
    const interaction = isDown || Math.abs(touchVelocity) > 0.1;

    if (diff > snapThreshold || interaction) {
      requestAnimationFrame(animate);
    } else {
      isAnimating = false;
      currentScrollX = targetScrollX;
      scroller.style.transform = `translateX(-${currentScrollX}px)`;
    }
  };

  const startAnimation = () => {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(animate);
    }
  };

  // video handling
  const videos = scroller.querySelectorAll("video");
  const observerOptions = {
    root: container,
    threshold: 0.5,
  };

  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) {
        video.play().catch(() => {}); // Handle potential autoplay blocks
      } else {
        video.pause();
      }
    });
  }, observerOptions);

  videos.forEach(v => {
    videoObserver.observe(v);
    v.addEventListener("ended", () => {
      targetScrollX += itemWidth;
      startAnimation();
    });
  });

  // events
  btnLeft?.addEventListener("click", () => {
    targetScrollX -= itemWidth;
    startAnimation();
  });

  btnRight?.addEventListener("click", () => {
    targetScrollX += itemWidth;
    startAnimation();
  });

  container.addEventListener(
    "wheel",
    e => {
      e.preventDefault();
      targetScrollX += e.deltaY;
      startAnimation();
    },
    { passive: false }
  );

  container.addEventListener("touchstart", e => {
    isDown = true;
    lastTouchX = e.touches[0].clientX;
    lastTouchTime = Date.now();
    touchVelocity = 0;
  });

  container.addEventListener("touchmove", e => {
    if (!isDown) return;
    const currentTouchX = e.touches[0].clientX;
    const deltaX = lastTouchX - currentTouchX;
    targetScrollX += deltaX * 1.5;

    const now = Date.now();
    const dt = now - lastTouchTime;
    if (dt > 0) touchVelocity = deltaX / dt;

    lastTouchX = currentTouchX;
    lastTouchTime = now;
    startAnimation();
  });

  container.addEventListener("touchend", () => {
    isDown = false;
    targetScrollX += touchVelocity * 100; // Momentum
    touchVelocity = 0;
    startAnimation();
  });

  window.addEventListener("resize", updateDimensions);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      videos.forEach(v => v.pause());
    }
  });

  // init
  setupClones();
  setTimeout(() => {
    updateDimensions();
    container.classList.add("initialized");
    startAnimation();
  }, 50);
});
