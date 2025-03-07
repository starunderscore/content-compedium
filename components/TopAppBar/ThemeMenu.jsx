// src/components/TopAppBar/ThemeMenu.jsx
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeMenu = ({ mode, toggleTheme, syncWithOS, toggleSyncWithOS }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen} aria-label="Theme options">
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            toggleTheme();
            handleMenuClose();
          }}
        >
          {mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox checked={syncWithOS} onChange={toggleSyncWithOS} />
            }
            label="Sync with OS"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeMenu;
