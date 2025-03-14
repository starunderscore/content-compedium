// components/treesidebar/TreeViewWorkspaceItem.jsx
import React from 'react';
import { ListItem, ListItemButton, ListItemText, Collapse, List, IconButton, Box, Checkbox, Menu, MenuItem, Divider, Typography } from '@mui/material'; // Import Typography
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const TreeViewWorkspaceItem = ({
  item,
  level,
  parentItem,
  expandedItems,
  handleItemClick,
  handleVisibilityToggle,
  workspaceMenuAnchorEl,
  handleWorkspaceMenuOpen,
  handleWorkspaceMenuClose,
  handleRemoveFolder,
  handleCheckAllInWorkspace,
  handleUncheckAllInWorkspace,
}) => {
  const theme = useTheme();
  const isExpanded = expandedItems ? expandedItems.includes(item.id) : false;
  const hasChildren = item.children && item.children.length > 0;
  const isWorkspace = item.type === 'workspace';
  const isFolder = item.type === 'folder';
  const isFile = item.type === 'file';
  let indent = 0;
  let leadingIcon = null;

  if (isFile && level > 1) {
    indent = level * 3;
  } else {
    indent = level * 2;
  }

  if (isWorkspace) {
    leadingIcon = (
      <IconButton
        aria-label="toggle workspace visibility"
        size="small"
        sx={{ mr: 0.5, ml: 1, opacity: item.visible ? 1 : 0.5 }}
        onClick={() => handleVisibilityToggle(item.id, !item.visible)} // Pass workspace ID
      >
        <VisibilityIcon color="action" fontSize="small" />
      </IconButton>
    );
  } else if (item.name === "Checkpoints" && isFolder) {
    leadingIcon = <FlagIcon sx={{ mr: 0.5, color: theme.palette.primary.main }} />;
  } else if (isFolder) {
    leadingIcon = <FolderIcon sx={{ mr: 0.5 }} />;
  } else if (isFile && parentItem && parentItem.name === "Checkpoints") {
    leadingIcon = null;
  } else if (isFile) {
    leadingIcon = <InsertDriveFileIcon sx={{ mr: 0.5, fontSize: 'small' }} />;
  }

  return (
    <React.Fragment key={item.id}>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => hasChildren ? handleItemClick(item.id) : {}} // Use item.id for toggling expansion
          sx={{ pl: indent, pr: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          disabled={item.visible === false}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {hasChildren && (isExpanded ? <ExpandLess sx={{ mr: 0.5 }} /> : <ExpandMore sx={{ mr: 0.5 }} />)}
            {isFile && parentItem && parentItem.name !== "Checkpoints" && <Checkbox size="small" disabled={item.visible === false} sx={{ mr: 0.5 }} />}
            {leadingIcon}
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{ variant: isWorkspace ? 'subtitle1' : 'body2' }}
              sx={{ opacity: item.visible ? 1 : 0.5 }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {isWorkspace && (
              <React.Fragment>
                <IconButton
                  aria-label="workspace actions"
                  size="small"
                  onClick={handleWorkspaceMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon color="action" fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={workspaceMenuAnchorEl}
                  open={Boolean(workspaceMenuAnchorEl)}
                  onClose={handleWorkspaceMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleWorkspaceMenuClose}>Add New Folder</MenuItem>
                  <MenuItem disabled={!item.children?.find(child => child.name === 'Folders')?.children?.length > 0} onClick={handleWorkspaceMenuClose}>Save Checkpoint</MenuItem> {/* Conditionally disabled */}
                  <Divider />
                  <MenuItem onClick={() => handleCheckAllInWorkspace(item.name)}>Check Everything</MenuItem>
                  <MenuItem onClick={() => handleUncheckAllInWorkspace(item.name)}>Uncheck Everything</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleWorkspaceMenuClose}>Delete Workspace</MenuItem>
                </Menu>
              </React.Fragment>
            )}
            {isFolder && parentItem && (parentItem.name === "Folders" || parentItem.name === "Checkpoints") && (
              <IconButton
                aria-label="remove folder"
                size="small"
                sx={{ ml: 1 }}
                onClick={() => handleRemoveFolder(item.name)}
              >
                <CloseIcon color="action" fontSize="small" />
              </IconButton>
            )}
            {isFile && parentItem && parentItem.name === "Checkpoints" && (
              <IconButton
                aria-label="remove checkpoint"
                size="small"
                sx={{ ml: 1 }}
                onClick={() => handleRemoveFolder(item.name)}
              >
                <CloseIcon color="action" fontSize="small" />
              </IconButton>
            )}
          </Box>
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              child.type === 'folder' && child.children && child.children.length === 0 ? (
                <ListItem key={`${child.id}-empty`} disablePadding sx={{ pl: indent + 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    No items.
                  </Typography>
                </ListItem>
              ) : (
                <TreeViewWorkspaceItem
                  key={child.id || child.name} // Use child.id if available, otherwise name
                  item={child}
                  level={level + 1}
                  parentItem={item}
                  expandedItems={expandedItems}
                  handleItemClick={handleItemClick}
                  handleVisibilityToggle={handleVisibilityToggle}
                  workspaceMenuAnchorEl={workspaceMenuAnchorEl}
                  handleWorkspaceMenuOpen={handleWorkspaceMenuOpen}
                  handleWorkspaceMenuClose={handleWorkspaceMenuClose}
                  handleRemoveFolder={handleRemoveFolder}
                  handleCheckAllInWorkspace={handleCheckAllInWorkspace}
                  handleUncheckAllInWorkspace={handleUncheckAllInWorkspace}
                />
              )
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
};

export default TreeViewWorkspaceItem;