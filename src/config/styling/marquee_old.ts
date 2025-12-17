document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.getElementById("marquee-content")!;
  marquee.style.setProperty("--scroll", "0");

  window.addEventListener("load", autoplayInit, false);
  let videos = document.getElementsByClassName(
    "marquee-item-content"
  ) as HTMLCollectionOf<HTMLVideoElement>;
  let vid_containers = document.getElementsByClassName(
    "marquee-item"
  ) as HTMLCollectionOf<HTMLDivElement>;

  let currentVideoIndex = 0;
  let currentVideo: HTMLVideoElement | null = null;

  function autoplayInit() {
    setActiveVideo(0);
    if (currentVideo) {
      currentVideo.play();
      currentVideo.style.animationPlayState = "running";
    }
  }

  function setActiveVideo(index: number) {
    if (currentVideo) {
      currentVideo.pause();
    }

    currentVideoIndex = index;
    currentVideo = videos[currentVideoIndex];

    currentVideo.currentTime = 0;
    marquee.style.setProperty("--scroll", `-${index * 100}%`);
    marquee.style.setProperty("--mult", `${index + 1}`);
  }

  function offsetCarousel(offset: number) {
    let nextIndex = currentVideoIndex + offset;

    if (nextIndex === videos.length - 1) {
      nextIndex = shiftItems(nextIndex);
      marquee.style.setProperty(
        "--scroll",
        `-${(nextIndex - 1) * 100}%`
      );
      marquee.style.setProperty("--mult", `${nextIndex - 1}`);
    }

    // NOTE: previous behavior
    // nextIndex = nextIndex % videos.length;

    setActiveVideo(nextIndex);
  }

  function shiftItems(index: number) {
    const vid_arr = Array.from(vid_containers);
    const shifted = vid_arr.shift()! as HTMLDivElement;

    shifted.setAttribute("clone", "");

    marquee.firstElementChild?.remove();
    marquee.appendChild(shifted);

    videos = marquee.getElementsByClassName(
      "marquee-item-content"
    ) as HTMLCollectionOf<HTMLVideoElement>;
    vid_containers = document.getElementsByClassName(
      "marquee-item"
    ) as HTMLCollectionOf<HTMLDivElement>;
    return index - 1;
  }

  const intersectionOptions = {
    root: marquee,
    rootMargin: "0px",
    threshold: 0.0,
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target as HTMLVideoElement;

      if (!entry.isIntersecting) {
        video.pause();

        video.style.animationName = "none";
        void video.offsetWidth;

        video.style.animationName = "fade";
        video.style.animationDuration = "0.3s";
        video.style.animationTimingFunction = "ease-in-out";
        video.style.animationFillMode = "forwards";
        video.style.animationDirection = "reverse";
      } else if (video === currentVideo) {
        video.play();

        video.style.animationName = "none";
        void video.offsetWidth;

        video.style.animationName = "fade";
        video.style.animationDuration = "0.3s";
        video.style.animationTimingFunction = "ease-in-out";
        video.style.animationFillMode = "forwards";
        video.style.animationPlayState = "running";
        video.style.animationDirection = "normal";
      }
    });
  }, intersectionOptions);

  for (const video of videos) {
    observer.observe(video);

    video.addEventListener("ended", () => {
      // The "ended" event might just mean its buffering.
      if (
        video === currentVideo &&
        video.duration !== 0 &&
        video.currentTime === video.duration
      ) {
        offsetCarousel(1);
      }
    });
  }

  let wasPaused = false;
  document.addEventListener("visibilitychange", () => {
    if (currentVideo) {
      if (document.hidden) {
        wasPaused = currentVideo.paused;
        currentVideo.pause();
      } else if (!wasPaused) {
        currentVideo.play();
      }
    }
  });

  // left-right buttons
  document
    .getElementById("marquee-scroll-left")!
    .addEventListener("mousedown", () => offsetCarousel(-1));
  document
    .getElementById("marquee-scroll-right")!
    .addEventListener("mousedown", () => offsetCarousel(1));
});
