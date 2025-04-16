import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Paper, Grid, 
  AppBar, Toolbar, FormControl, InputLabel, Select, MenuItem,
  TextField, Divider, CircularProgress, Snackbar, Alert,
  Card, CardContent, IconButton, Tooltip, ThemeProvider, 
  CssBaseline, createTheme, useMediaQuery
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PdfIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  FileCopy as FileCopyIcon,
  GitHub as GitHubIcon,
  ColorLens as ColorLensIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { 
  atomDark, 
  materialLight, 
  dracula, 
  solarizedlight, 
  tomorrow 
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// Available themes for syntax highlighting
const codeThemes = {
  'atomDark': atomDark,
  'materialLight': materialLight,
  'dracula': dracula,
  'solarizedlight': solarizedlight,
  'tomorrow': tomorrow
};

// Available export formats
const exportFormats = [
  { value: 'pdf', label: 'PDF Document (.pdf)', icon: <PdfIcon /> },
  { value: 'docx', label: 'Word Document (.docx)', icon: <FileCopyIcon /> },
  { value: 'txt', label: 'Text File (.txt)', icon: <FileCopyIcon /> },
  { value: 'html', label: 'HTML Document (.html)', icon: <CodeIcon /> }
];

// Author links
const authorLinks = {
  github: "https://github.com/Benighter",
  linkedin: "https://www.linkedin.com/in/bennet-nkolele-321285249/",
  portfolio: "https://react-personal-portfolio-alpha.vercel.app/"
};

function App() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [showPasteOption, setShowPasteOption] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [theme, setTheme] = useState('atomDark');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [documentTitle, setDocumentTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [lineNumbers, setLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : useMediaQuery('(prefers-color-scheme: dark)');
  });
  
  const codeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Create theme based on dark mode preference
  const appTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)'
          }
        }
      }
    }
  });

  // Toggle between file upload and paste options
  const togglePasteOption = () => {
    setShowPasteOption(!showPasteOption);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle direct code paste
  const handleCodePaste = (e) => {
    const pastedContent = e.target.value;
    setFileContent(pastedContent);
    setFileName('pasted-html.html');
    setDocumentTitle('HTML Document');
    setLanguage('html');
    
    // Auto-generate preview when content changes
    if (pastedContent.trim().length > 0) {
      // Small delay to ensure content is set
      setTimeout(() => generateHtmlPreview(), 100);
    }
  };

  // Generate HTML preview
  const generateHtmlPreview = () => {
    if (!fileContent || language !== 'html') {
      setNotification({
        open: true,
        message: 'Please paste valid HTML code first',
        severity: 'warning'
      });
      return;
    }

    try {
      // Create a blob from the HTML content
      const htmlBlob = new Blob([fileContent], { type: 'text/html' });
      // Create a URL for the blob
      const htmlUrl = URL.createObjectURL(htmlBlob);
      setHtmlPreview(htmlUrl);
      
      setNotification({
        open: true,
        message: 'HTML preview generated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating HTML preview:', error);
      setNotification({
        open: true,
        message: 'Error generating HTML preview',
        severity: 'error'
      });
    }
  };

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (htmlPreview) {
        URL.revokeObjectURL(htmlPreview);
      }
    };
  }, [htmlPreview]);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('.file-drop-area').classList.remove('active');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection from input
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // Process the selected file
  const handleFile = (file) => {
    setLoading(true);
    setFile(file);
    setFileName(file.name);
    setDocumentTitle(file.name.split('.')[0]);
    
    // Detect language from file extension
    const extension = file.name.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'html': 'html',
      'css': 'css',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'sh': 'bash',
      'json': 'json',
      'xml': 'xml',
      'yml': 'yaml',
      'yaml': 'yaml',
      'md': 'markdown',
      'sql': 'sql'
    };
    
    if (languageMap[extension]) {
      setLanguage(languageMap[extension]);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setLoading(false);
    };
    reader.onerror = () => {
      setNotification({
        open: true,
        message: 'Error reading file',
        severity: 'error'
      });
      setLoading(false);
    };
    reader.readAsText(file);
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('.file-drop-area').classList.add('active');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('.file-drop-area').classList.remove('active');
  };

  // Export to PDF
  const exportToPdf = async () => {
    // If we have an HTML preview, capture that instead of the code
    let elementToCapture;
    let isHtmlIframe = false;
    
    if (htmlPreview && language === 'html') {
      try {
        const iframe = document.querySelector('iframe');
        elementToCapture = iframe.contentWindow.document.body;
        isHtmlIframe = true;
      } catch (error) {
        console.error('Error accessing iframe content:', error);
        elementToCapture = codeRef.current;
      }
    } else {
      elementToCapture = codeRef.current;
    }
    if (!fileContent) {
      setNotification({
        open: true,
        message: 'Please upload a file first',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const title = documentTitle || fileName.split('.')[0];
      const author = authorName || 'Generated by codeToDoc';
      
      // Create PDF with different settings based on content type
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add metadata (invisible in the PDF)
      pdf.setProperties({
        title: title,
        author: author,
        subject: 'HTML Document',
        creator: 'codeToDoc'
      });
      
      // For HTML content, don't add headers - just the content
      // For code content, add the headers as before
      if (!isHtmlIframe) {
        // Add title and author
        pdf.setFontSize(20);
        pdf.text(title, 20, 20);
        
        if (author) {
          pdf.setFontSize(12);
          pdf.text(`Author: ${author}`, 20, 30);
        }
        
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
        pdf.text(`Language: ${language}`, 20, 45);
        
        // Add horizontal line
        pdf.line(20, 50, 190, 50);
      }
      
      // For HTML content, we need to handle multi-page content
      if (isHtmlIframe) {
        // Get the full height of the HTML content
        const fullHeight = elementToCapture.scrollHeight;
        const fullWidth = elementToCapture.scrollWidth;
        
        // Set up canvas with full dimensions
        const canvas = document.createElement('canvas');
        canvas.width = fullWidth * 2; // Higher resolution
        canvas.height = fullHeight * 2;
        const ctx = canvas.getContext('2d');
        
        // Create a temporary iframe to render the full content
        const tempIframe = document.createElement('iframe');
        tempIframe.style.position = 'absolute';
        tempIframe.style.left = '-9999px';
        tempIframe.style.width = `${fullWidth}px`;
        tempIframe.style.height = `${fullHeight}px`;
        tempIframe.src = htmlPreview;
        document.body.appendChild(tempIframe);
        
        // Wait for iframe to load
        await new Promise(resolve => {
          tempIframe.onload = resolve;
          // Fallback if onload doesn't trigger
          setTimeout(resolve, 1000);
        });
        
        try {
          // Use html2canvas on the full content
          const renderedCanvas = await html2canvas(tempIframe.contentWindow.document.body, {
            scale: 2,
            logging: false,
            useCORS: true,
            width: fullWidth,
            height: fullHeight,
            windowWidth: fullWidth,
            windowHeight: fullHeight
          });
          
          // Draw the rendered content to our canvas
          ctx.drawImage(renderedCanvas, 0, 0);
          
          // Get image data
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate dimensions for PDF (A4 page is 210×297 mm)
          const pdfWidth = 210;
          const pdfHeight = 297;
          const imgWidth = pdfWidth - 40; // 20mm margins on each side
          const imgHeight = canvas.height * imgWidth / canvas.width;
          
          // For HTML content, use full page with minimal margins
          const topMargin = 10; // Minimal top margin (10mm)
          
          // If content is taller than a single page, split across multiple pages
          if (imgHeight > (pdfHeight - 20)) { // Just 10mm margins top and bottom
            const pageHeight = pdfHeight - 20;
            let heightLeft = imgHeight;
            let position = topMargin; // Starting position
            let page = 1;
            
            // Add first page
            pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Add subsequent pages as needed
            while (heightLeft > 0) {
              position = 10; // Top margin for subsequent pages
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 20, position - (pageHeight * page), imgWidth, imgHeight);
              heightLeft -= pageHeight;
              page++;
            }
          } else {
            // Content fits on a single page
            pdf.addImage(imgData, 'PNG', 20, topMargin, imgWidth, imgHeight);
          }
        } finally {
          // Clean up temporary iframe
          document.body.removeChild(tempIframe);
        }
      } else {
        // Regular code content - use standard approach
        const canvas = await html2canvas(elementToCapture, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        // Add code image to PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 170;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // For code content, position after the header (55mm from top)
        pdf.addImage(imgData, 'PNG', 20, 55, imgWidth, imgHeight);
      }
      
      // Save PDF
      pdf.save(`${title}.pdf`);
      
      setNotification({
        open: true,
        message: 'PDF exported successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      setNotification({
        open: true,
        message: 'Error exporting to PDF',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Export to other formats
  const exportToOtherFormat = () => {
    if (!fileContent) {
      setNotification({
        open: true,
        message: 'Please upload a file first',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const title = documentTitle || fileName.split('.')[0];
      
      switch (exportFormat) {
        case 'txt':
          // Export as plain text
          const textBlob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
          saveAs(textBlob, `${title}.txt`);
          break;
          
        case 'html':
          // Export as HTML with syntax highlighting
          const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${title}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  margin-bottom: 20px;
                }
                .code-container {
                  border-radius: 8px;
                  overflow: hidden;
                }
                pre {
                  margin: 0;
                  padding: 16px;
                  overflow: auto;
                  background-color: #282c34;
                  color: #abb2bf;
                  border-radius: 8px;
                  font-family: 'Courier New', Courier, monospace;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 0.8em;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${title}</h1>
                ${authorName ? `<p>Author: ${authorName}</p>` : ''}
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
                <p>Language: ${language}</p>
              </div>
              <div class="code-container">
                <pre><code>${fileContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
              </div>
              <div class="footer">
                <p>Generated by codeToDoc</p>
              </div>
            </body>
            </html>
          `;
          const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
          saveAs(htmlBlob, `${title}.html`);
          break;
          
        case 'docx':
          // For DOCX, we'll create a simple HTML and let the browser handle the conversion
          // This is a simplified approach - in a real app, you might want to use a library like docx.js
          const docContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                  xmlns:w='urn:schemas-microsoft-com:office:word' 
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
              <meta charset="UTF-8">
              <title>${title}</title>
              <!--[if gte mso 9]>
              <xml>
                <w:WordDocument>
                  <w:View>Print</w:View>
                  <w:Zoom>100</w:Zoom>
                </w:WordDocument>
              </xml>
              <![endif]-->
              <style>
                body {
                  font-family: 'Calibri', sans-serif;
                  line-height: 1.5;
                }
                .code {
                  font-family: 'Courier New', monospace;
                  background-color: #f5f5f5;
                  padding: 10px;
                  border: 1px solid #ddd;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              ${authorName ? `<p>Author: ${authorName}</p>` : ''}
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <p>Language: ${language}</p>
              <div class="code">${fileContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              <p>Generated by codeToDoc</p>
            </body>
            </html>
          `;
          const docBlob = new Blob([docContent], { type: 'application/vnd.ms-word;charset=utf-8' });
          saveAs(docBlob, `${title}.docx`);
          break;
          
        default:
          throw new Error('Unsupported export format');
      }
      
      setNotification({
        open: true,
        message: `Exported to ${exportFormat.toUpperCase()} successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error(`Error exporting to ${exportFormat}:`, error);
      setNotification({
        open: true,
        message: `Error exporting to ${exportFormat.toUpperCase()}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle export button click
  const handleExport = () => {
    if (exportFormat === 'pdf') {
      exportToPdf();
    } else {
      exportToOtherFormat();
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" className="app-header" color="primary">
          <Toolbar>
            <CodeIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              codeToDoc
            </Typography>
            
            {/* Dark mode toggle */}
            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton color="inherit" onClick={toggleDarkMode} sx={{ mr: 1 }}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            {/* Author links */}
            <Tooltip title="View Portfolio">
              <IconButton color="inherit" component="a" href={authorLinks.portfolio} target="_blank" sx={{ mr: 1 }}>
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="LinkedIn Profile">
              <IconButton color="inherit" component="a" href={authorLinks.linkedin} target="_blank" sx={{ mr: 1 }}>
                <LinkedInIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="GitHub Repository">
              <IconButton color="inherit" component="a" href={authorLinks.github} target="_blank">
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            {/* File Upload Area */}
            <Grid item xs={12}>
              {!fileContent ? (
                <Paper 
                  className="file-drop-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  elevation={3}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    borderRadius: '12px', 
                    borderStyle: 'dashed', 
                    borderWidth: '2px', 
                    borderColor: 'primary.main',
                    background: darkMode ? 'rgba(33, 150, 243, 0.05)' : 'rgba(33, 150, 243, 0.02)'
                  }}
                >
                  {!showPasteOption ? (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 70, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h5" gutterBottom fontWeight="bold">
                        Drag & Drop your code file here
                      </Typography>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        or
                      </Typography>
                      <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                        <Button 
                          variant="contained" 
                          onClick={() => fileInputRef.current.click()}
                          startIcon={<CloudUploadIcon />}
                          size="large"
                        >
                          Browse Files
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={togglePasteOption}
                          size="large"
                        >
                          Paste HTML Instead
                        </Button>
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
                        Supports various programming languages (.js, .py, .java, .c, .cpp, etc.)
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CodeIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                      <Typography variant="h5" gutterBottom>
                        Paste your HTML code here
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={10}
                        placeholder="<html>\n  <head>\n    <title>Your HTML</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>"
                        onChange={handleCodePaste}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          onClick={() => {
                            if (fileContent) {
                              generateHtmlPreview();
                              setShowPasteOption(false);
                            } else {
                              setNotification({
                                open: true,
                                message: 'Please paste some HTML code first',
                                severity: 'warning'
                              });
                            }
                          }}
                          disabled={!fileContent}
                        >
                          Preview HTML
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={togglePasteOption}
                        >
                          Upload File Instead
                        </Button>
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Paste your HTML code directly to convert it to PDF or other formats
                      </Typography>
                    </>
                  )}
                </Paper>
              ) : (
                <Box>
                  {/* Settings Panel */}
                  <Paper className="settings-panel" elevation={3} sx={{ p: 3, borderRadius: '12px', mb: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          <SettingsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Document Settings
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Document Title"
                          value={documentTitle}
                          onChange={(e) => setDocumentTitle(e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Author Name"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Language</InputLabel>
                          <Select
                            value={language}
                            label="Language"
                            onChange={(e) => {
                              setLanguage(e.target.value);
                              // Reset HTML preview if language is changed from html
                              if (e.target.value !== 'html' && htmlPreview) {
                                setHtmlPreview(null);
                              }
                            }}
                          >
                            <MenuItem value="javascript">JavaScript</MenuItem>
                            <MenuItem value="python">Python</MenuItem>
                            <MenuItem value="java">Java</MenuItem>
                            <MenuItem value="csharp">C#</MenuItem>
                            <MenuItem value="cpp">C++</MenuItem>
                            <MenuItem value="php">PHP</MenuItem>
                            <MenuItem value="ruby">Ruby</MenuItem>
                            <MenuItem value="go">Go</MenuItem>
                            <MenuItem value="rust">Rust</MenuItem>
                            <MenuItem value="typescript">TypeScript</MenuItem>
                            <MenuItem value="swift">Swift</MenuItem>
                            <MenuItem value="kotlin">Kotlin</MenuItem>
                            <MenuItem value="html">HTML</MenuItem>
                            <MenuItem value="css">CSS</MenuItem>
                            <MenuItem value="sql">SQL</MenuItem>
                            <MenuItem value="bash">Bash</MenuItem>
                            <MenuItem value="json">JSON</MenuItem>
                            <MenuItem value="yaml">YAML</MenuItem>
                            <MenuItem value="markdown">Markdown</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Theme</InputLabel>
                          <Select
                            value={theme}
                            label="Theme"
                            onChange={(e) => setTheme(e.target.value)}
                            startAdornment={<ColorLensIcon sx={{ mr: 1, ml: -0.5 }} />}
                          >
                            <MenuItem value="atomDark">Atom Dark</MenuItem>
                            <MenuItem value="materialLight">Material Light</MenuItem>
                            <MenuItem value="dracula">Dracula</MenuItem>
                            <MenuItem value="solarizedlight">Solarized Light</MenuItem>
                            <MenuItem value="tomorrow">Tomorrow</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Export Format</InputLabel>
                          <Select
                            value={exportFormat}
                            label="Export Format"
                            onChange={(e) => setExportFormat(e.target.value)}
                          >
                            {exportFormats.map((format) => (
                              <MenuItem key={format.value} value={format.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {format.icon}
                                  <Box sx={{ ml: 1 }}>{format.label}</Box>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<DownloadIcon />}
                          onClick={handleExport}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} /> : `Export as ${exportFormat.toUpperCase()}`}
                        </Button>

                        <Button
                          sx={{ ml: 2 }}
                          variant="outlined"
                          onClick={() => {
                            setFile(null);
                            setFileContent('');
                            setFileName('');
                            if (htmlPreview) {
                              URL.revokeObjectURL(htmlPreview);
                              setHtmlPreview(null);
                            }
                          }}
                        >
                          Upload Different File
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Code Preview */}
                  <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Code Preview
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Filename: {fileName}
                    </Typography>
                    <Box className="code-container" ref={codeRef} sx={{ mt: 2, borderRadius: '8px', overflow: 'hidden' }}>
                      {language === 'html' ? (
                        <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                          <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight="bold">HTML Preview</Typography>
                            {htmlPreview ? (
                              <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => setHtmlPreview(null)}
                              >
                                Show Code
                              </Button>
                            ) : (
                              <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={generateHtmlPreview}
                              >
                                Generate Preview
                              </Button>
                            )}
                          </Box>
                          <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
                            {htmlPreview ? (
                              <>
                                <iframe 
                                  src={htmlPreview} 
                                  title="HTML Preview" 
                                  style={{ width: '100%', height: '100%', border: 'none', overflow: 'auto' }}
                                  sandbox="allow-same-origin allow-scripts"
                                />
                                <Box sx={{ 
                                  position: 'absolute', 
                                  bottom: 0, 
                                  left: 0, 
                                  right: 0, 
                                  p: 1, 
                                  bgcolor: 'rgba(255,255,255,0.8)', 
                                  borderTop: '1px solid #ddd',
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}>
                                  <Button 
                                    size="small" 
                                    variant="contained" 
                                    onClick={() => {
                                      const win = window.open('', '_blank');
                                      win.document.write(fileContent);
                                      win.document.close();
                                    }}
                                  >
                                    Open in New Tab
                                  </Button>
                                </Box>
                              </>
                            ) : (
                              <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body1" color="textSecondary">
                                  Click "Generate Preview" to render the HTML
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <SyntaxHighlighter
                          language={language}
                          style={codeThemes[theme]}
                          showLineNumbers={lineNumbers}
                          customStyle={{
                            fontSize: `${fontSize}px`,
                            margin: 0,
                            borderRadius: '8px'
                          }}
                        >
                          {fileContent}
                        </SyntaxHighlighter>
                      )}
                    </Box>
                  </Paper>
                </Box>
              )}
            </Grid>

            {/* Feature Cards */}
            {!fileContent && (
              <Grid item xs={12}>
                <Box sx={{ mt: 5, mb: 3 }}>
                  <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
                    Features
                  </Typography>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ height: '100%', borderRadius: '12px' }} elevation={3}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom fontWeight="bold">
                            <PdfIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Multiple Export Formats
                          </Typography>
                          <Typography variant="body2">
                            Export your code to PDF, Word documents, plain text, or HTML with syntax highlighting preserved.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ height: '100%', borderRadius: '12px' }} elevation={3}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom fontWeight="bold">
                            <ColorLensIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Syntax Highlighting
                          </Typography>
                          <Typography variant="body2">
                            Beautiful syntax highlighting for over 20 programming languages with multiple theme options.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ height: '100%', borderRadius: '12px' }} elevation={3}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom fontWeight="bold">
                            <SettingsIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Customization Options
                          </Typography>
                          <Typography variant="body2">
                            Customize your document with titles, author information, and different styling options.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ height: '100%', borderRadius: '12px' }} elevation={3}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom fontWeight="bold">
                            <CodeIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            HTML Preview & Export
                          </Typography>
                          <Typography variant="body2">
                            Paste HTML code, preview it in the browser, and download the rendered result as PDF or other formats.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>

        {/* Footer */}
        <Box 
          component="footer" 
          className="footer" 
          sx={{ 
            py: 3, 
            mt: 'auto',
            backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
            borderTop: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="textSecondary" align="center">
              © {new Date().getFullYear()} codeToDoc | All rights reserved
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              Developed by <a href={authorLinks.github} target="_blank" rel="noopener noreferrer" style={{ color: appTheme.palette.primary.main, textDecoration: 'none' }}>Bennet Nkolele</a>
            </Typography>
          </Container>
        </Box>

        {/* Notifications */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            sx={{ width: '100%', borderRadius: '8px' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
