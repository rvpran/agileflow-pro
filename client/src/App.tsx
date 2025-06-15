import Board from './components/Board';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#36B37E',
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
    grey: {
      50: '#f4f5f7',
      100: '#ebecf0',
      200: '#dfe1e6',
      300: '#c1c7d0',
      400: '#b3bac5',
      500: '#a5adba',
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 600,
      color: '#172b4d',
    },
    h6: {
      fontWeight: 600,
      color: '#5e6c84',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      '[data-dnd-kit-drag-overlay]': {
        zIndex: '99999 !important',
        position: 'fixed !important',
        top: '0 !important',
        left: '0 !important',
        pointerEvents: 'none !important',
        transform: 'none !important',
      },
      '.dnd-dragging': {
        zIndex: '99999 !important',
        position: 'relative !important',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3) !important',
      },
      '[data-dnd-kit-droppable]': {
        position: 'relative',
        zIndex: '1',
      },
    }}
  />
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <ErrorBoundary>
        <Board />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
