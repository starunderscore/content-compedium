// components/Layout.jsx (Modified to add bottom banner)
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure layout takes full viewport height
      }}
    >
      <Box
        sx={{
          mb: 5,
          flexGrow: 1, // Allow main content to grow and push footer down
        }}
      >
        {children}
      </Box>
      <Box
        component="footer"
        sx={{
          p: 2,
          textAlign: 'right',
          bgcolor: (theme) => theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100], // Light grey background for footer
          color: (theme) => theme.palette.getContrastText(theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100]),
          borderTop: '1px solid', // Add a top border to visually separate footer
          borderColor: (theme) => theme.palette.grey[300],
        }}
      >
        <Typography variant="body2" color="textSecondary">
          <em>Presented by</em>&nbsp;&nbsp;&nbsp;
          <img src="/favicon-16x16.png" alt="Star Underscore Logo" />&nbsp;
          {/* ✅ Modified <a> tag to use onClick and window.electronAPI.openExternalLink */}
          <a
            href="#" // Replace href with # - prevent default link behavior
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior (navigation in app)
              window.electronAPI.openExternalLink('https://starunderscore.com'); // Call preload function to open in default browser
            }}
            rel="noopener noreferrer" // Keep rel="noopener noreferrer" for security
            style={{ color: 'inherit', textDecoration: 'none' }} // Optional: keep link styling
          >
            StarUnderscore.com
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;