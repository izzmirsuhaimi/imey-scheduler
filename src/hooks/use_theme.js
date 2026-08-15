import { useEffect, useState } from "react";
import useLocalStorage from "./use_local_storage";

const THEME_STORAGE_KEY = "imey_scheduler:theme";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function useTheme() {
  const [storedTheme, setStoredTheme] = useLocalStorage(THEME_STORAGE_KEY, null);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    const mql = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (!mql) return undefined;
    const handler = (event) => setSystemTheme(event.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const theme = storedTheme ?? systemTheme;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#000000" : "#f8fafc");
  }, [theme]);

  const toggleTheme = () => setStoredTheme(theme === "dark" ? "light" : "dark");

  return { theme, toggleTheme };
}
