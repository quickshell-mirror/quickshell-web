interface ThemeProps {
  theme: "light" | "dark";
  system: "light" | "dark";
}

export const getCurrentTheme = (): ThemeProps => {
  const isDarkSystem = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const systemTheme = isDarkSystem ? "dark" : "light";

  if (typeof localStorage !== "undefined") {
    if (localStorage.theme === "dark") {
      return { theme: "dark", system: systemTheme };
    }
    if (localStorage.theme === "light") {
      return { theme: "light", system: systemTheme };
    }
  }

  return { theme: systemTheme, system: systemTheme };
};

export const updateTheme = (transition = true) => {
  const theme = getCurrentTheme();
  const toggle = document.getElementById(
    "theme-manual-toggle"
  ) as HTMLInputElement;

  if (transition) {
    document.documentElement.classList.add("changing-theme");
    document.documentElement.style.setProperty(
      "--theme-transition",
      "0.3s var(--ease-in-out)"
    );
  } else {
    document.documentElement.style.removeProperty(
      "--theme-transition"
    );
  }

  if (theme.theme === "dark") {
    document.documentElement.classList.add("dark");
    if (toggle) toggle.checked = true;
  } else {
    document.documentElement.classList.remove("dark");
    if (toggle) toggle.checked = false;
  }

  if (transition) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove(
          "changing-theme"
        );
      });
    });
  }
};

export const initTheme = () => {
  const toggle = document.getElementById(
    "theme-manual-toggle"
  ) as HTMLInputElement;

  if (toggle) {
    toggle.addEventListener("change", () => {
      localStorage.theme = toggle.checked ? "dark" : "light";
      updateTheme();
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => updateTheme());
  window.addEventListener("storage", () => updateTheme());

  // initial sync
  updateTheme(false);
};

// auto-init on client
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
}
