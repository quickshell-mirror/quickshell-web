// NOTE: at last index, append every item 1 by 1 starting from 0

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    ".marquee-item"
  ) as HTMLDivElement;
  const scroller = document.querySelector(
    ".marquee-content"
  ) as HTMLDivElement;
  if (!scroller) {
    return;
  }

  const sections = Array.from(
    scroller.querySelectorAll(".marquee-item")
  );

  const smoothFactor = 0.05;
  const touchSensitivity = 2.5;
  const bufferSize = 2;

  let targetScrollX = 0;
  let currentScrollX = 0;
  let isAnimating = false;

  let isDown = false;
  let lastTouchX = 0;
  let touchVelocity = 0;
  let lastTouchTime = 0;

  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  const setupScroll = () => {
    scroller.querySelectorAll(".clone").forEach(clone => {
      clone.remove();
    });

    const originalSections = Array.from(
      scroller.querySelectorAll(".marquee-item:not(.clone)")
    );

    const templateSections =
      originalSections.length > 0 ? originalSections : sections;

    let sequenceWidth = 0;
    templateSections.forEach(section => {
      sequenceWidth += parseFloat(
        window.getComputedStyle(section).width
      );
    });

    // Create clones before original sections
    for (let i = -bufferSize; i < 0; i++) {
      templateSections.forEach((section, index) => {
        const clone = section.cloneNode(true) as HTMLDivElement;
        clone.classList.add("clone");
        clone.setAttribute("data-clone-index", `${i}-${index}`);
        scroller.appendChild(clone);
      });
    }

    // Add original sections if none exist
    if (originalSections.length === 0) {
      templateSections.forEach((section, index) => {
        const clone = section.cloneNode(true) as HTMLDivElement;
        clone.setAttribute("data-clone-index", `0-${index}`);
        scroller.appendChild(clone);
      });
    }

    // Create clones after original sections
    for (let i = 1; i <= bufferSize; i++) {
      templateSections.forEach((section, index) => {
        const clone = section.cloneNode(true) as HTMLDivElement;
        clone.classList.add("clone");
        clone.setAttribute("data-clone-index", `${i}-${index}`);
        scroller.appendChild(clone);
      });
    }

    scroller.style.width = `${sequenceWidth * (1 + bufferSize * 2)}px`;
    targetScrollX = sequenceWidth * bufferSize;
    currentScrollX = targetScrollX;
    scroller.style.transform = `translateX(-${currentScrollX}px)`;

    return sequenceWidth;
  };

  const checkBoundaryAndReset = (sequenceWidth: number) => {
    if (currentScrollX > sequenceWidth * (bufferSize + 0.5)) {
      targetScrollX -= sequenceWidth;
      currentScrollX -= sequenceWidth;
      scroller.style.transform = `translateX(-${currentScrollX}px)`;
      return true;
    }

    if (currentScrollX < sequenceWidth * (bufferSize - 0.5)) {
      targetScrollX += sequenceWidth;
      currentScrollX += sequenceWidth;
      scroller.style.transform = `translateX(-${currentScrollX}px)`;
      return true;
    }

    return false;
  };

  const animate = (
    sequenceWidth: number,
    forceProgressReset = false
  ) => {
    currentScrollX = lerp(
      currentScrollX,
      targetScrollX,
      smoothFactor
    );
    scroller.style.transform = `translateX(-${currentScrollX}px)`;

    if (Math.abs(targetScrollX - currentScrollX) > 0.01) {
      requestAnimationFrame(() => animate(sequenceWidth));
    } else {
      isAnimating = false;
    }
  };

  // Initialize
  const sequenceWidth = setupScroll();

  // Wheel event
  container.addEventListener(
    "wheel",
    e => {
      e.preventDefault();
      targetScrollX += e.deltaY;

      const needsReset = checkBoundaryAndReset(sequenceWidth);

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(() =>
          animate(sequenceWidth, needsReset)
        );
      }
    },
    { passive: false }
  );

  // Touch events
  container.addEventListener("touchstart", e => {
    isDown = true;
    lastTouchX = e.touches[0].clientX;
    lastTouchTime = Date.now();
    targetScrollX = currentScrollX;
  });

  container.addEventListener("touchmove", e => {
    if (!isDown) return;
    e.preventDefault();

    const currentTouchX = e.touches[0].clientX;
    const touchDelta = lastTouchX - currentTouchX;

    targetScrollX += touchDelta * touchSensitivity;

    const currentTime = Date.now();
    const timeDelta = currentTime - lastTouchTime;
    if (timeDelta > 0) {
      touchVelocity = (touchDelta / timeDelta) * 15;
    }
    lastTouchX = currentTouchX;
    lastTouchTime = currentTime;

    const needsReset = checkBoundaryAndReset(sequenceWidth);
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(() =>
        animate(sequenceWidth, needsReset)
      );
    }
  });

  container.addEventListener("touchend", () => {
    isDown = false;

    if (Math.abs(touchVelocity) > 0.1) {
      targetScrollX += touchVelocity * 20;

      const decayVelocity = () => {
        touchVelocity *= 0.95;

        if (Math.abs(touchVelocity) > 0.1) {
          targetScrollX += touchVelocity;
          requestAnimationFrame(decayVelocity);
        }
      };

      requestAnimationFrame(decayVelocity);
    }
  });
});
