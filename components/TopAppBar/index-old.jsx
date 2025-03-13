// components/TopAppBar/index.jsx
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Branding from "./Branding";
import ThemeMenu from "./ThemeMenu";
import { useThemeSettings } from "../../pages/_app";
import IconButton from "@mui/material/IconButton";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Tooltip from "@mui/material/Tooltip";
import AIPromptModal from './AIPromptModal';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import SettingsIcon from '@mui/icons-material/Settings'; // ✅ Import SettingsIcon (Gear Icon)
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // ✅ Import ChevronLeftIcon - Left Chevron Icon


const TopAppBar = ({ branding = "Content Compendium", homeLink = "/", onSettingsClick, onBackToHome }) => {
  const { mode, toggleTheme, syncWithOS, toggleSyncWithOS } = useThemeSettings();
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  const handleOpenPromptModal = () => setIsPromptModalOpen(true);
  const handleClosePromptModal = () => setIsPromptModalOpen(false);


  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar
          sx={{
            width: "100%",
            // maxWidth: "1180px",
            m: "0 auto",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {onBackToHome && (
                <Tooltip title="Back"> {/* ✅ Tooltip for Back Icon Button */}
                  <IconButton
                    color="inherit"
                    onClick={onBackToHome}
                    aria-label="back"
                    sx={{ mr: 2 }}
                  >
                    <ChevronLeftIcon /> {/* ✅ ChevronLeftIcon - Back Icon */}
                  </IconButton>
                </Tooltip>
              )}
              <Branding branding={branding} homeLink={homeLink} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Learn about Content Compendium">
                <IconButton
                  color="inherit"
                  onClick={handleOpenPromptModal}
                  aria-label="get AI prompt"
                >
                  <LightbulbIcon />
                </IconButton>
              </Tooltip>

              <ThemeMenu
                mode={mode}
                toggleTheme={toggleTheme}
                syncWithOS={syncWithOS}
                toggleSyncWithOS={toggleSyncWithOS}
              />

              <Tooltip title="Settings"> {/* ✅ Tooltip for Settings Icon Button */}
                <IconButton
                  color="inherit"
                  onClick={onSettingsClick}
                  aria-label="settings"
                  sx={{ mr: 1 }} // Slightly reduce right margin for icon button
                >
                  <SettingsIcon /> {/* ✅ Settings Icon (Gear) */}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <AIPromptModal
        open={isPromptModalOpen}
        onClose={handleClosePromptModal}
      />
    </>
  );
};

export default TopAppBar;