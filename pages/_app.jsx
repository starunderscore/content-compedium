// pages/_app.js (Theme Context and Theme Toggling - Version 9)
import React, { useState, useMemo, createContext } from 'react'; // ✅ Import createContext and useMemo
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // For global styles reset

// ✅ 1. Create a Theme Context
export const ThemeModeContext = createContext({
  toggleTheme: () => { }, // Placeholder toggle function
  mode: 'light',           // Default mode
});

function MyApp({ Component, pageProps }) {
  // ✅ 2. Manage Theme Mode State
  const [mode, setMode] = useState('light'); // 'light' | 'dark' - Initial theme mode

  // ✅ 3. Create Theme Object based on Mode (useMemo for performance)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // 'light' or 'dark' will be dynamically set
          ...(mode === 'light' ? { // Light mode palette
            // Light mode specific palette values can go here (if needed)
          } : { // Dark mode palette
            // Dark mode specific palette values can go here (if needed)
            background: {          // Dark mode background overrides (example - adjust as needed)
              default: '#121212', // Slightly darker default background for dark mode
              paper: '#1e1e1e',   // Slightly darker paper background for dark mode
            },
          }),
          primary: { // Example primary color - adjust to your brand color
            main: '#3f51b5',
          },
          secondary: { // Example secondary color - adjust to your brand color
            main: '#f50057',
            dark: '#c51162',      // Example dark variant of secondary
          },
          // divider: 'rgba(255, 255, 255, 0.12)', // Example divider color override - adjust as needed for dark mode
        },
      }),
    [mode], // Re-create theme when 'mode' changes
  );


  // ✅ 4. Theme Toggle Function (using useCallback for optimization - though not strictly necessary here)
  const themeContextValue = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')); // Toggle mode
      },
      mode, // Current theme mode ('light' or 'dark') - Make 'mode' available in context
    }),
    [mode] // Re-create context value when 'mode' changes
  );


  return (
    // ✅ 5. Provide Theme Context and ThemeProvider
    <ThemeModeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Apply Material UI's reset styles */}
        <Component {...pageProps} /> {/* Render your application components */}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default MyApp;