# codeToDoc


> Convert your code into beautiful, formatted documents with ease. codeToDoc transforms source code files into professional PDF documents, Word files, and more with syntax highlighting and customization options.

## 📌 Live Demo

🔗 [**Try codeToDoc Now!**](https://code-to-ovao2i6xu-benighters-projects.vercel.app) <!-- Deployed app URL -->

---


<div align="center">
  <img src="https://placeholder-for-screenshot.com/dark-mode.png" alt="Dark Mode" width="45%" />
  <img src="https://placeholder-for-screenshot.com/light-mode.png" alt="Light Mode" width="45%" />
</div>

<div align="center">
  <img src="https://placeholder-for-screenshot.com/code-preview.png" alt="Code Preview" width="45%" />
  <img src="https://placeholder-for-screenshot.com/export-options.png" alt="Export Options" width="45%" />
</div>

---

## ✨ Features

### Core Functionality
- **Multiple Export Formats** - Convert code to PDF, DOCX, TXT, and HTML
- **Syntax Highlighting** - Beautiful code highlighting for various programming languages
- **Theme Selection** - Choose from multiple syntax highlighting themes:
  - Atom Dark
  - Material Light
  - Dracula
  - Solarized Light
  - Tomorrow

### User Experience
- **Dark/Light Mode** - Toggle between dark and light UI themes
- **Drag & Drop Interface** - Simply drag your code files to upload
- **HTML Preview** - Live preview for HTML code
- **Code Pasting** - Option to directly paste code instead of uploading
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### Document Customization
- **Document Metadata** - Add custom title and author information
- **Line Numbers** - Option to include or exclude line numbers
- **Font Size Adjustment** - Customize the size of code text
- **Language Selection** - Specify the programming language for proper highlighting

---

## 🛠️ Tech Stack

- **Frontend Framework**: React
- **UI Components**: Material UI
- **Syntax Highlighting**: react-syntax-highlighter (with Prism)
- **PDF Generation**: jsPDF, html2canvas
- **File Handling**: file-saver
- **Styling**: CSS with Material UI theming

---

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Benighter/codeToDoc.git
   cd codeToDoc
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app configuration

---

## 📖 How to Use

### Converting a Code File

1. **Upload Your Code**:
   - Drag and drop your code file into the drop area
   - OR click "Browse Files" to select a file from your computer
   - OR click "Paste HTML Instead" to directly input code

2. **Configure Document Settings**:
   - Select the programming language
   - Choose a syntax highlighting theme
   - Set document title and author name
   - Adjust font size and line number preferences

3. **Preview Your Document**:
   - Review how your code will look with the selected settings
   - For HTML files, you can generate a rendered preview

4. **Export the Document**:
   - Select your desired export format (PDF, DOCX, TXT, HTML)
   - Click the "Export" button
   - Save the file to your computer

### Tips for Best Results

- For HTML documents, use the preview feature to see how the rendered page will look
- Large files may take longer to process, especially when exporting to PDF
- For optimal PDF quality, use code with reasonable line lengths
- If you're experiencing performance issues, try reducing the font size or removing line numbers

---

## 🧩 Project Structure

```
codeToDoc/
├── public/              # Static files
├── src/                 # Source files
│   ├── App.js           # Main application component
│   ├── index.js         # Entry point
│   ├── index.css        # Global styles
│   └── reportWebVitals.js
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

---

## 🛣️ Roadmap

- [ ] Add code formatting options
- [ ] Support for more export formats (Markdown, RTF)
- [ ] Batch processing for multiple files
- [ ] Code annotation features
- [ ] Custom templates for different document types
- [ ] Cloud storage integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👤 Author
Bennet Nkolele  
- GitHub: [Benighter](https://github.com/Benighter)  
- LinkedIn: [Bennet Nkolele](https://www.linkedin.com/in/bennet-nkolele-321285249/)  
- Portfolio: [My Work](https://react-personal-portfolio-alpha.vercel.app/)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgements

- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) for the amazing syntax highlighting capabilities
- [Material UI](https://mui.com/) for the beautiful UI components
- [jsPDF](https://github.com/MrRio/jsPDF) for PDF generation functionality
- Icons from [Material Icons](https://mui.com/material-ui/material-icons/)

---

💻 Built with ❤️ by [Bennet Nkolele](https://github.com/Benighter)
