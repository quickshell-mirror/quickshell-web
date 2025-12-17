document.addEventListener("DOMContentLoaded", () => {
  let currentProgressScale = 0;
  let targetProgressScale = 0;
  let lastPercentage = 0;
  const progressCounter = document.querySelector(
    ".progress-counter h1"
  );
  const progressBar = document.querySelector(
    ".progress-bar"
  ) as HTMLDivElement;

  const updateProgress = (
    sequenceWidth: number,
    forceReset = false
  ) => {
    const basePosition = sequenceWidth * bufferSize;
    const currentPosition =
      (currentScrollX - basePosition) % sequenceWidth;
    let percentage = (currentPosition / sequenceWidth) * 100;

    if (percentage < 0) {
      percentage = 100 + percentage;
    }

    const isWrapping =
      (lastPercentage > 80 && percentage < 20) ||
      (lastPercentage < 20 && percentage > 80) ||
      forceReset;

    progressCounter.textContent = `${Math.round(percentage)}`;
    targetProgressScale = percentage / 100;

    if (isWrapping) {
      currentProgressScale = targetProgressScale;
      progressBar.style.transform = `scaleX(${currentProgressScale})`;
    }

    lastPercentage = percentage;
  };
  updateProgress(sequenceWidth, true);
  progressBar.style.transform = `scaleX(${currentProgressScale})`;
  updateProgress(sequenceWidth, forceProgressReset);

  if (!forceProgressReset) {
    currentProgressScale = lerp(
      currentProgressScale,
      targetProgressScale,
      smoothFactor
    );
  }
  progressBar.style.transform = `scaleX(${currentProgressScale})`;
});
