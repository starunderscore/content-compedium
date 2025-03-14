// components/AIPromptModal.js
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from "@mui/material/styles";

const AIPromptModal = ({ open, onClose }) => {
  const theme = useTheme()
  const aiPromptText = `
  You are an AI assistant designed to create content for Slop Press typing games.  Please format your responses using the Slop Press Markdown typing game standard.

**Slop Press Typing Game Standard:**

1.  **Slide Separators:** Use \`##\` (H2 Markdown headers) to separate each slide in the typing game. Each H2 header will represent the title of a new slide.

2.  **Typing Game Text:**  Enclose the text that the user will type within special Markdown code blocks using \`\`\`typing.  Only text inside these \`\`\`typing blocks will be part of the typing game. Text outside these blocks will be treated as regular slide content (e.g., titles, instructions, explanations) and will not be typeable in the game.

**Example Markdown Structure:**

\`\`\`markdown
## Slide Title 1: Introduction

This is some introductory text for the first slide, explaining the topic. It will not be part of the typing game.

\`\`\`typing
This is the text the user will type on slide 1.  Focus on accuracy and speed!
\`\`\`

## Slide Title 2:  Next Concept

More explanatory text for slide 2.

\`\`\`typing
Here is the typing text for the second slide.  It could be a fact, a quote, code, etc.
\`\`\`

... (More slides following the same structure) ...
`; // Your AI Prompt Text -  Define your desired prompt here

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPromptText);
    // You can add a visual confirmation to the user here if desired (e.g., a snackbar)
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600, // Wider modal for better readability
    maxHeight: '80%', // Limit modal height for long prompts
    overflow: 'auto', // Enable scrolling if content overflows
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="ai-prompt-modal-title"
      aria-describedby="ai-prompt-modal-description"
    >
      <Box sx={modalStyle}>
        <Box sx={{ mt: 4, color: 'textSecondary' }}>
          <Typography id="ai-prompt-modal-title" variant="h4" component="h2" sx={{ marginBottom: "15px" }}>
            Instructions
          </Typography>
          <Typography variant="body2">
            Use "Browse Folders..." to select your project's root folder.
            <br />
            Content Compendium will remember your last selected folder.
          </Typography>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AIPromptModal;