// components/ContentViewTabs.jsx (VS Code Style Tabs - Light/Dark Mode Support)
import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%', bgcolor: useTheme().palette.background.default }}> {/* ✅ Theme-aware TabPanel background */}  {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `content-tab-${index}`,
    'aria-controls': `content-tabpanel-${index}`,
  };
}

const ContentViewTabs = () => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme(); // ✅ Get theme object
  const isDarkMode = theme.palette.mode === 'dark'; // ✅ Determine if dark mode is active

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // --- Define Tab Colors based on Theme Mode ---
  const tabBgColorUnselected = isDarkMode ? theme.palette.grey[900] : theme.palette.grey[100]; // Flipped
  const tabBgColorSelected = isDarkMode ? theme.palette.grey[800] : theme.palette.grey[200];   // Flipped
  const tabTextColorUnselected = isDarkMode ? theme.palette.grey[400] : theme.palette.grey[700];
  const tabTextColorSelected = isDarkMode ? theme.palette.common.white : theme.palette.common.black;
  const tabSeparatorColor = isDarkMode ? theme.palette.grey[700] : theme.palette.grey[300];


  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="content view tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          // --- Tabs container styling - Theme-Aware Background ---
          bgcolor: tabBgColorUnselected, // Use theme-aware unselected tab background
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: '38px',
        }}
        TabIndicatorProps={{
          style: { display: 'none' }
        }}
      >
        <Tab
          label="Image Page" {...a11yProps(0)}
          sx={{
            // --- Tab styling - Theme-Aware Colors ---
            minWidth: '120px',
            padding: '0 15px',
            minHeight: '38px',
            alignItems: 'flex-start',
            textTransform: 'none',
            color: tabTextColorUnselected, // Theme-aware unselected text color
            '&.Mui-selected': {
              bgcolor: tabBgColorSelected, // Theme-aware selected tab background
              color: tabTextColorSelected, // Theme-aware selected tab text color
            },
            '&:not(:last-of-type)': {
              borderRight: `1px solid ${tabSeparatorColor}`, // Theme-aware separator color
            },
          }}
        />
        <Tab
          label="Content Page 1" {...a11yProps(1)}
          sx={{
            // --- Tab styling - Theme-Aware Colors ---
            minWidth: '120px',
            padding: '0 15px',
            minHeight: '38px',
            alignItems: 'flex-start',
            textTransform: 'none',
            color: tabTextColorUnselected, // Theme-aware unselected text color
            '&.Mui-selected': {
              bgcolor: tabBgColorSelected, // Theme-aware selected tab background
              color: tabTextColorSelected, // Theme-aware selected tab text color
            },
            '&:not(:last-of-type)': {
              borderRight: `1px solid ${tabSeparatorColor}`, // Theme-aware separator color
            },
          }}
        />
        <Tab
          label="Content Page 2" {...a11yProps(2)}
          sx={{
            // --- Tab styling - Theme-Aware Colors ---
            minWidth: '120px',
            padding: '0 15px',
            minHeight: '38px',
            alignItems: 'flex-start',
            textTransform: 'none',
            color: tabTextColorUnselected, // Theme-aware unselected text color
            '&.Mui-selected': {
              bgcolor: tabBgColorSelected, // Theme-aware selected tab background
              color: tabTextColorSelected, // Theme-aware selected tab text color
            },
            '&:not(:last-of-type)': {
              borderRight: `1px solid ${tabSeparatorColor}`, // Theme-aware separator color
            },
          }}
        />
        <Tab
          label="Content Page 3" {...a11yProps(3)}
          sx={{
            // --- Tab styling - Theme-Aware Colors ---
            minWidth: '120px',
            padding: '0 15px',
            minHeight: '38px',
            alignItems: 'flex-start',
            textTransform: 'none',
            color: tabTextColorUnselected, // Theme-aware unselected text color
            '&.Mui-selected': {
              bgcolor: tabBgColorSelected, // Theme-aware selected tab background
              color: tabTextColorSelected, // Theme-aware selected tab text color
            },
            '&:not(:last-of-type)': {
              borderRight: `1px solid ${tabSeparatorColor}`, // Theme-aware separator color
            },
          }}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Typography>
          Content of Image Page will go here.
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography>
          Content of Content Page 1 will go here.
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>
          Content of Content Page 2 will go here.
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography>
          Content of Content Page 3 will go here.
        </Typography>
      </TabPanel>
    </Box>
  );
};

export default ContentViewTabs;