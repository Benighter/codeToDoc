# codeToDoc

A modern web application that converts code files to beautiful documents in various formats including PDF, Word, HTML, and plain text.

## Features

- **Multiple Export Formats**: Convert your code to PDF, Word documents, HTML, or plain text
- **Syntax Highlighting**: Beautiful syntax highlighting for over 20 programming languages
- **Theme Options**: Choose from multiple syntax highlighting themes
- **Document Customization**: Add titles, author information, and customize the appearance
- **Drag & Drop Interface**: Simple and intuitive user interface

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Drag and drop a code file onto the upload area or click "Browse Files" to select a file
2. The application will automatically detect the language based on the file extension
3. Customize the document settings:
   - Document title
   - Author name
   - Programming language
   - Syntax highlighting theme
   - Export format
4. Click "Export" to generate and download your document

## Supported Languages

The application supports syntax highlighting for a wide range of programming languages, including:

- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- PHP
- Ruby
- Go
- Rust
- Swift
- Kotlin
- HTML/CSS
- SQL
- Bash
- JSON/YAML
- Markdown
- And many more!

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create an optimized production build in the `build` folder that you can deploy to any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author
Bennet Nkolele  
- GitHub: [Benighter](https://github.com/Benighter)  
- LinkedIn: [Bennet Nkolele](https://www.linkedin.com/in/bennet-nkolele-321285249/)  
- Portfolio: [My Work](https://react-personal-portfolio-alpha.vercel.app/)

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [Material-UI](https://mui.com/)
- Syntax highlighting powered by [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- PDF generation using [jsPDF](https://github.com/MrRio/jsPDF) and [html2canvas](https://github.com/niklasvh/html2canvas)
