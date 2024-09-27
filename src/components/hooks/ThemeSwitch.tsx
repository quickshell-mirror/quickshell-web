import {
  createSignal,
  createEffect,
  onCleanup,
  onMount,
  type VoidComponent,
} from "solid-js";
import { Sun, Moon } from "@icons";

interface ThemeProps {
  theme: "light" | "dark";
  system: "light" | "dark";
}

const getCurrentTheme = (): ThemeProps => {
  if (
    typeof localStorage !== "undefined" &&
    (localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches))
  ) {
    return {
      theme: "dark",
      system: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    };
  }
  return {
    theme: "light",
    system: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  };
};

const updateTheme = () => {
  document.documentElement.classList.add("changing-theme");
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("changing-theme");
    });
  });
};

export const ThemeSelect: VoidComponent = () => {
  const [currentTheme, setCurrentTheme] = createSignal<ThemeProps>({
    theme: "dark",
    system: "dark",
  });
  const [mounted, setMounted] = createSignal(false);

  const toggleTheme = () => {
    if (!mounted()) return;
    setCurrentTheme(getCurrentTheme());
    if (currentTheme()!.theme !== currentTheme()!.system) {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = currentTheme()!.theme === "dark" ? "light" : "dark";
    }
    updateTheme();
    setCurrentTheme(getCurrentTheme());
  };

  onMount(() => {
    setMounted(true);
    setCurrentTheme(getCurrentTheme());
  });

  createEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);
    window.addEventListener("storage", updateTheme);

    onCleanup(() => {
      mediaQuery.removeEventListener("change", updateTheme);
      window.removeEventListener("storage", updateTheme);
      setMounted(false);
    });
  });

  return (
    <div onclick={toggleTheme} class="theme-toggle">
      {(mounted() && currentTheme().theme === "light") ||
        currentTheme().system === "light" ? (
        <Sun class="theme-sun" />
      ) : (
        <Moon class="theme-moon" />
      )}
    </div>
  );
};
