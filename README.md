# Content Compendium

**Version: 1.0.0 (Phase 1 - Core Functionality Achieved)**

**Author: Michael Hunt (StarUnderscore.com)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Project Description:**

Content Compendium is a desktop application designed to help you efficiently aggregate and preview content from your project folders. It allows you to select a project folder, navigate its structure in a clear tree view, and easily combine the content of multiple files into a single, scrollable preview. **This is especially useful for streamlining your prompting workflows when working on file-system based projects, allowing you to quickly gather and utilize project context.** Phase 1 focuses on providing the core functionality for file selection, tree navigation, and aggregated code preview, particularly useful for developers, writers, and anyone who needs to quickly review and compile content from project files.

**Key Features (Phase 1):**

*   **Effortless Project Folder Selection:**  Use the "Browse Folders..." button to easily select your project's root directory via a native file dialog.
*   **Intuitive Directory Tree View:** Explore your project's folder and file structure using a clear, interactive tree view, powered by MUI TreeView.
*   **Selective File Aggregation:** Checkboxes are enabled only for files within the tree.  Select multiple files to aggregate their content. Folders remain clearly organized without checkboxes.
*   **Combined Code Preview:** View the aggregated content of all selected files in a dedicated "Code Preview" panel.  Each file's content is displayed in a distinct code block, clearly separated and ready for review or copying.
*   **Cross-Platform Desktop Application:** Built with Electron, Content Compendium is designed to run seamlessly on Windows, macOS, and Linux.

**Getting Started (Development):**

1.  **Prerequisites:** Ensure you have Node.js and npm (Node Package Manager) installed on your system.

2.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd content-compendium
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Run in Development Mode:**
    ```bash
    npm run electron-dev
    ```
    This command starts the Next.js development server for the user interface and the Electron application backend concurrently. The application will typically open automatically after a short delay.

**Key Technologies & Dependencies:**

*   **Next.js:**  A React framework used to build the application's user interface, providing a modern and component-based architecture.
*   **Electron:**  A framework for creating cross-platform desktop applications using web technologies (HTML, CSS, JavaScript).
*   **Material UI (MUI):**  A popular React UI component library (@mui/material, @mui/icons-material, @mui/x-tree-view) providing pre-built, visually appealing, and accessible UI elements.
*   **Node.js Modules (core):**  Utilizes standard Node.js modules like `fs` (file system) and `path` for interacting with the local file system within the Electron main process.
*   **concurrently:**  A utility for running multiple npm scripts concurrently, simplifying the development workflow for Next.js and Electron projects.

**License:**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

**LICENSE.md (MIT License):**