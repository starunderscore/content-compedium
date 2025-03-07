// components/MarkdownContentView.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const MarkdownContentView = ({ filesContent }) => { // ✅ Receive filesContent prop (array)
  console.log("[MarkdownContentView] filesContent prop received:", filesContent); // Log filesContent

  return (
    <Container maxWidth="md" sx={{ mt: 4, bgcolor: '#f9f9f9', p: 3, borderRadius: 1 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Content Preview:
      </Typography>

      {filesContent && filesContent.length > 0 ? ( // ✅ Conditional rendering for filesContent array
        filesContent.map((fileData, index) => ( // ✅ Map through filesContent to render multiple code blocks
          <Box key={index} sx={{ // Use index as key for each Box in the list
            bgcolor: '#e0e0e0', // Light grey background for code block
            borderRadius: 1,
            overflow: 'auto', // Enable scroll if content overflows
            p: 2, // Padding inside code block
            marginBottom: 2, // Margin below code block
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>```{fileData.filePath}</Typography> {/* Filename header */}
            <pre style={{ margin: 0 }}> {/* Reset default pre margins */}
              <code style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap', // Keep white space and wrap lines
                display: 'block', // Ensure code block fills container width
              }}>
                {fileData.content} {/* File content */}
              </code>
            </pre>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>```</Typography> {/* Filename header */}
          </Box>
        ))
      ) : ( // ✅ Updated placeholder text for multi-select
        <Typography>Select files to view their combined content.</Typography>
      )}
    </Container>
  );
};

export default MarkdownContentView;