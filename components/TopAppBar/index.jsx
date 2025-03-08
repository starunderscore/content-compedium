// src/components/TopAppBar/index.jsx
import React, { useState } from "react"; // ✅ Import useState
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Branding from "./Branding";
import ThemeMenu from "./ThemeMenu";
import { useThemeSettings } from "../../pages/_app";
import IconButton from "@mui/material/IconButton"; // ✅ Import IconButton
import LightbulbIcon from '@mui/icons-material/Lightbulb'; // ✅ Import LightbulbIcon (or your chosen icon)
import Tooltip from "@mui/material/Tooltip"; // ✅ Import Tooltip
import AIPromptModal from './AIPromptModal'; // ✅ Import AIPromptModal

const TopAppBar = ({ branding = "Content Compendium", homeLink = "/" }) => {
  const { mode, toggleTheme, syncWithOS, toggleSyncWithOS } = useThemeSettings();
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false); // ✅ State for modal visibility

  const handleOpenPromptModal = () => setIsPromptModalOpen(true); // ✅ Open modal handler
  const handleClosePromptModal = () => setIsPromptModalOpen(false); // ✅ Close modal handler


  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar
          sx={{
            width: "100%",
            maxWidth: "1180px",
            m: "0 auto",
          }}
        >
          <Branding branding={branding} homeLink={homeLink} />

          <Tooltip title="Get AI Prompt for Typing Games"> {/* ✅ Tooltip for the button */}
            <IconButton
              color="inherit"
              onClick={handleOpenPromptModal} // ✅ Open modal on click
              aria-label="get AI prompt"
            >
              <LightbulbIcon /> {/* ✅ Lightbulb Icon */}
            </IconButton>
          </Tooltip>

          <ThemeMenu
            mode={mode}
            toggleTheme={toggleTheme}
            syncWithOS={syncWithOS}
            toggleSyncWithOS={toggleSyncWithOS}
          />
        </Toolbar>
      </AppBar>
      <AIPromptModal // ✅ Render the AIPromptModal
        open={isPromptModalOpen}
        onClose={handleClosePromptModal}
      />
    </>
  );
};

export default TopAppBar;