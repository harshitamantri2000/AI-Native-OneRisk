import React, { createContext, useContext, useEffect } from "react";

interface ThemeContextValue {
  theme: "light";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Ensure no leftover dark class from previous sessions
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("lokey-theme");
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
};
