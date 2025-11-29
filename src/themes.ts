// Theme system for ArmorEditor
export interface Theme {
  name: string;
  colors: {
    background: string;
    text: string;
    border: string;
    toolbar: string;
    button: string;
    buttonHover: string;
    selection: string;
    accent: string;
  };
  fonts: {
    primary: string;
    monospace: string;
  };
}

export const themes: Record<string, Theme> = {
  light: {
    name: 'Light',
    colors: {
      background: '#ffffff',
      text: '#333333',
      border: '#e1e5e9',
      toolbar: '#f8f9fa',
      button: '#ffffff',
      buttonHover: '#e9ecef',
      selection: '#007cba',
      accent: '#007cba'
    },
    fonts: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      monospace: 'Monaco, Menlo, "Ubuntu Mono", monospace'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      background: '#1a1a1a',
      text: '#e1e1e1',
      border: '#404040',
      toolbar: '#2d2d2d',
      button: '#404040',
      buttonHover: '#505050',
      selection: '#0ea5e9',
      accent: '#0ea5e9'
    },
    fonts: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      monospace: 'Monaco, Menlo, "Ubuntu Mono", monospace'
    }
  },
  minimal: {
    name: 'Minimal',
    colors: {
      background: '#fefefe',
      text: '#2c2c2c',
      border: '#f0f0f0',
      toolbar: '#fbfbfb',
      button: 'transparent',
      buttonHover: '#f5f5f5',
      selection: '#6366f1',
      accent: '#6366f1'
    },
    fonts: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      monospace: 'JetBrains Mono, Monaco, monospace'
    }
  }
};

export function applyTheme(container: HTMLElement, theme: Theme) {
  const style = `
    --ae-bg: ${theme.colors.background};
    --ae-text: ${theme.colors.text};
    --ae-border: ${theme.colors.border};
    --ae-toolbar: ${theme.colors.toolbar};
    --ae-button: ${theme.colors.button};
    --ae-button-hover: ${theme.colors.buttonHover};
    --ae-selection: ${theme.colors.selection};
    --ae-accent: ${theme.colors.accent};
    --ae-font-primary: ${theme.fonts.primary};
    --ae-font-mono: ${theme.fonts.monospace};
  `;
  
  container.style.cssText += style;
}
