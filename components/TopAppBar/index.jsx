// components/TopAppBar/index.jsx (Theme Toggle Functionality - Final UI with Dropdown Menus)
import React, { useContext, useState, useRef } from 'react'; // ✅ Import useState and useRef
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { ThemeModeContext } from '../../pages/_app'; // ✅ Import ThemeModeContext
import Menu from '@mui/material/Menu'; // ✅ Import Menu
import MenuItem from '@mui/material/MenuItem'; // ✅ Import MenuItem
import Divider from '@mui/material/Divider'; // ✅ Import Divider

const TopAppBar = ({ onSettingsClick, onBackToHome }) => {
  const theme = useTheme();
  const { toggleTheme, mode } = useContext(ThemeModeContext);
  const currentThemeText = mode === 'light' ? 'Light' : 'Dark';

  // State for File Menu
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const isFileMenuOpen = Boolean(fileMenuAnchorEl);
  const handleFileMenuOpen = (event) => {
    setFileMenuAnchorEl(event.currentTarget);
  };
  const handleFileMenuClose = () => {
    setFileMenuAnchorEl(null);
  };

  // State for Help Menu
  const [helpMenuAnchorEl, setHelpMenuAnchorEl] = useState(null);
  const isHelpMenuOpen = Boolean(helpMenuAnchorEl);
  const handleHelpMenuOpen = (event) => {
    setHelpMenuAnchorEl(event.currentTarget);
  };
  const handleHelpMenuClose = () => {
    setHelpMenuAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default">
      {/* --- FILE MENU BAR --- */}
      <Toolbar variant="dense" sx={{ bgcolor: theme.palette.background.default, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            sx={{ textTransform: 'none' }}
            onClick={handleFileMenuOpen}
            aria-controls={isFileMenuOpen ? 'file-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isFileMenuOpen ? 'true' : undefined}
          >
            File
          </Button>
          <Menu
            id="file-menu"
            anchorEl={fileMenuAnchorEl}
            open={isFileMenuOpen}
            onClose={handleFileMenuClose}
            MenuListProps={{
              'aria-labelledby': 'file-menu-button',
            }}
          >
            <MenuItem onClick={handleFileMenuClose}>New Workspace</MenuItem>
            <Divider />
            {/* <MenuItem onClick={handleFileMenuClose}>Import...</MenuItem>
                        <MenuItem onClick={handleFileMenuClose}>Export...</MenuItem>
                        <Divider /> */}
            <MenuItem onClick={handleFileMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleFileMenuClose}>Quit</MenuItem>
          </Menu>

          <Button
            color="inherit"
            sx={{ textTransform: 'none', ml: 2 }}
            onClick={handleHelpMenuOpen}
            aria-controls={isHelpMenuOpen ? 'help-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isHelpMenuOpen ? 'true' : undefined}
          >
            Help
          </Button>
          <Menu
            id="help-menu"
            anchorEl={helpMenuAnchorEl}
            open={isHelpMenuOpen}
            onClose={handleHelpMenuClose}
            MenuListProps={{
              'aria-labelledby': 'help-menu-button',
            }}
          >
            <MenuItem onClick={handleHelpMenuClose}>About Content Compendium</MenuItem>
            <MenuItem onClick={handleHelpMenuClose}>Documentation</MenuItem>
            <MenuItem onClick={handleHelpMenuClose}>Report Issue</MenuItem>
            <MenuItem onClick={handleHelpMenuClose}>Donate</MenuItem>
          </Menu>

          {/* --- THEME TOGGLE BUTTON --- */}
          <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
          <Button
            color="inherit"
            sx={{ textTransform: 'none' }}
            onClick={toggleTheme}
          >
            Theme: {currentThemeText}
          </Button>
          {/* --- END THEME TOGGLE BUTTON --- */}

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;