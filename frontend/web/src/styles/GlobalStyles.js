import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* CSS Custom Properties */
  :root {
    /* Light theme colors */
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --bg-tertiary: #e9ecef;
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --text-tertiary: #adb5bd;
    --border-color: #dee2e6;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    
    /* Brand colors */
    --primary: #007bff;
    --primary-dark: #0056b3;
    --primary-light: #66b3ff;
    --secondary: #6c757d;
    --success: #28a745;
    --danger: #dc3545;
    --warning: #ffc107;
    --info: #17a2b8;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    
    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-full: 9999px;
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Z-index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
  }

  /* Dark theme */
  .dark {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --bg-tertiary: #3d3d3d;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --text-tertiary: #808080;
    --border-color: #404040;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }

  /* RTL support */
  [dir="rtl"] {
    text-align: right;
  }

  [dir="rtl"] .text-left {
    text-align: right !important;
  }

  [dir="rtl"] .text-right {
    text-align: left !important;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  p {
    margin-bottom: var(--spacing-md);
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--primary-dark);
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Utility classes */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  .d-none { display: none; }
  .d-block { display: block; }
  .d-inline { display: inline; }
  .d-inline-block { display: inline-block; }
  .d-flex { display: flex; }
  .d-grid { display: grid; }

  .justify-content-start { justify-content: flex-start; }
  .justify-content-center { justify-content: center; }
  .justify-content-end { justify-content: flex-end; }
  .justify-content-between { justify-content: space-between; }
  .justify-content-around { justify-content: space-around; }

  .align-items-start { align-items: flex-start; }
  .align-items-center { align-items: center; }
  .align-items-end { align-items: flex-end; }
  .align-items-stretch { align-items: stretch; }

  .flex-column { flex-direction: column; }
  .flex-row { flex-direction: row; }
  .flex-wrap { flex-wrap: wrap; }
  .flex-nowrap { flex-wrap: nowrap; }

  .gap-1 { gap: var(--spacing-xs); }
  .gap-2 { gap: var(--spacing-sm); }
  .gap-3 { gap: var(--spacing-md); }
  .gap-4 { gap: var(--spacing-lg); }
  .gap-5 { gap: var(--spacing-xl); }

  .m-0 { margin: 0; }
  .m-1 { margin: var(--spacing-xs); }
  .m-2 { margin: var(--spacing-sm); }
  .m-3 { margin: var(--spacing-md); }
  .m-4 { margin: var(--spacing-lg); }
  .m-5 { margin: var(--spacing-xl); }

  .p-0 { padding: 0; }
  .p-1 { padding: var(--spacing-xs); }
  .p-2 { padding: var(--spacing-sm); }
  .p-3 { padding: var(--spacing-md); }
  .p-4 { padding: var(--spacing-lg); }
  .p-5 { padding: var(--spacing-xl); }

  .rounded { border-radius: var(--radius-md); }
  .rounded-sm { border-radius: var(--radius-sm); }
  .rounded-lg { border-radius: var(--radius-lg); }
  .rounded-xl { border-radius: var(--radius-xl); }
  .rounded-full { border-radius: var(--radius-full); }

  .shadow { box-shadow: var(--shadow); }
  .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
  .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

  .text-primary { color: var(--primary); }
  .text-secondary { color: var(--text-secondary); }
  .text-success { color: var(--success); }
  .text-danger { color: var(--danger); }
  .text-warning { color: var(--warning); }
  .text-info { color: var(--info); }

  .bg-primary { background-color: var(--primary); }
  .bg-secondary { background-color: var(--bg-secondary); }
  .bg-success { background-color: var(--success); }
  .bg-danger { background-color: var(--danger); }
  .bg-warning { background-color: var(--warning); }
  .bg-info { background-color: var(--info); }

  /* Responsive utilities */
  @media (max-width: 768px) {
    .container {
      padding: 0 var(--spacing-sm);
    }
    
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.5rem; }
  }

  /* Loading animation */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Fade animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-fade-out {
    animation: fadeOut 0.3s ease-in-out;
  }

  /* Slide animations */
  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideInDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slide-in-up {
    animation: slideInUp 0.3s ease-out;
  }

  .animate-slide-in-down {
    animation: slideInDown 0.3s ease-out;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--text-tertiary);
    border-radius: var(--radius-full);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
  }

  /* Selection styles */
  ::selection {
    background-color: var(--primary);
    color: white;
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`;

export default GlobalStyles;
