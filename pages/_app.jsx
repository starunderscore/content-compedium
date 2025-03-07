// pages/_app.jsx
import React, { useState, useMemo, useEffect, createContext, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// import "../styles/globals.css"; // if you have any global CSS

// Create a context for theme settings
const ThemeContext = createContext({
  mode: "light",
  syncWithOS: false,
  toggleTheme: () => {},
  toggleSyncWithOS: () => {},
});

// Export a hook to use this context
export const useThemeSettings = () => useContext(ThemeContext);

function MyApp({ Component, pageProps }) {
  const [mode, setMode] = useState("light");
  const [syncWithOS, setSyncWithOS] = useState(false);

  // On mount, load stored values
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("slop-press-theme-mode");
      const storedSync = localStorage.getItem("slop-press-sync-with-os");
      if (storedSync !== null) {
        setSyncWithOS(storedSync === "true");
      }
      if (storedMode) {
        setMode(storedMode);
      }
    }
  }, []);

  // When OS sync is enabled, update mode based on OS preference.
  useEffect(() => {
    if (syncWithOS && typeof window !== "undefined") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const updateMode = () => setMode(mql.matches ? "dark" : "light");
      updateMode(); // set initial value
      mql.addEventListener("change", updateMode);
      return () => mql.removeEventListener("change", updateMode);
    }
  }, [syncWithOS]);

  // Persist mode (if not syncing with OS)
  useEffect(() => {
    if (!syncWithOS && typeof window !== "undefined") {
      localStorage.setItem("slop-press-theme-mode", mode);
    }
  }, [mode, syncWithOS]);

  // Persist syncWithOS value
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("slop-press-sync-with-os", syncWithOS);
    }
  }, [syncWithOS]);

  // Toggle functions
  const toggleTheme = () => {
    // If syncing with OS, disable it on manual toggle.
    if (syncWithOS) {
      setSyncWithOS(false);
    }
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSyncWithOS = () => {
    setSyncWithOS((prev) => !prev);
  };

  // Create a theme based on our state.
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "dark" ? "#121212" : "#fff",
            paper: mode === "dark" ? "#121212" : "#fff",
          },
          text: {
            primary: mode === "dark" ? "#fff" : "#000",
          },
          grey: {
            200: "#ccc", // for example
            800: "#333", // for example
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "#ccc" : "#333",
                color: "#fff",
                transition: "background-color 0.3s ease, color 0.3s ease",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, syncWithOS, toggleTheme, toggleSyncWithOS }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default MyApp;
