export function initAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    observerOptions
  );

  const animatedElements = document.querySelectorAll(
    ".animate-fade-up, .stagger-parent"
  );
  animatedElements.forEach(el => observer.observe(el));
}

export function initTOCHighlighting() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const heading = entry.target.querySelector(
        "h1, h2, h3, h4, h5, h6"
      );
      if (heading) {
        const id = heading.id;
        const desktopElement = document.querySelector(
          `.toc-wrapper li a[href="#${id}"]`
        );
        const mobileElement = document.querySelector(
          `.toc-wrapper-mobile li a[href="#${id}"]`
        );

        if (entry.isIntersecting) {
          desktopElement?.parentElement?.classList.add("active");
          mobileElement?.parentElement?.classList.add("active");
        } else {
          desktopElement?.parentElement?.classList.remove(
            "active"
          );
          mobileElement?.parentElement?.classList.remove(
            "active"
          );
        }
      }
    });
  });

  document
    .querySelectorAll("section[data-heading-rank]")
    .forEach(section => {
      observer.observe(section);
    });
}

// auto-init on DOMContentLoaded
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initAnimations();
    initTOCHighlighting();
  });
}
