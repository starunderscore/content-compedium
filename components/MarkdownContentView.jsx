// components/MarkdownContentView.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar'; // ✅ Import Snackbar
import Alert from '@mui/material/Alert';       // ✅ Import Alert

const MarkdownContentView = ({ filesContent }) => {
  const theme = useTheme();
  console.log('theme', theme, theme.palette.mode);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);    // ✅ Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = React.useState('');  // ✅ Snackbar message state
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success'); // ✅ Snackbar severity state ('success' or 'error')

  const handleCopyToClipboard = () => {
    if (!filesContent || filesContent.length === 0) {
      console.log("No content to copy.");
      return;
    }

    // ✅ UPDATED: Add Markdown code block delimiters (backticks ```)
    const aggregatedText = filesContent.map(fileData =>
      `\`\`\`${fileData.filePath}\`\`\`\n${fileData.content}\n\`\`\`` // Wrap filepath and content in ```
    ).join('\n\n'); // Separate file blocks with double newlines

    navigator.clipboard.writeText(aggregatedText)
      .then(() => {
        console.log("Content copied to clipboard!");
        setSnackbarMessage('Content copied to clipboard (with code blocks)!'); // ✅ Updated Snackbar message
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        setSnackbarMessage('Failed to copy content to clipboard!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = (event, reason) => { // ✅ Handle Snackbar close
    if (reason === 'clickaway') {
      return; // Prevent closing on clickaway (optional - you can remove this if you want clickaway to close it)
    }
    setSnackbarOpen(false); // Close Snackbar
  };

  return (
    <Container maxWidth="md" sx={{ bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200], p: 3, borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Content Preview:
        </Typography>
        {filesContent && filesContent.length !== 0 && (
          <Button variant="contained" onClick={handleCopyToClipboard} size="small">
            Copy All
          </Button>
        )}
      </Box>

      {filesContent && filesContent.length > 0 ? (
        filesContent.map((fileData, index) => (
          <Box key={index} sx={{
            bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
            borderRadius: 1,
            overflow: 'auto',
            p: 2,
            marginBottom: 2,
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>```{fileData.filePath}</Typography>
            <pre style={{ margin: 0 }}>
              <code style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                display: 'block',
              }}>
                {fileData.content}
              </code>
            </pre>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>```</Typography>
          </Box>
        ))
      ) : (
        <Typography>Select files to view their combined content.</Typography>
      )}

      <Snackbar // ✅ Snackbar Component
        open={snackbarOpen}
        autoHideDuration={3000} // 3 seconds duration
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Position at bottom right
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}> {/* Alert inside Snackbar */}
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MarkdownContentView;