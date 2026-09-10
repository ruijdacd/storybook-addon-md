import { create } from 'storybook/theming';

const preference = window.matchMedia('(prefers-color-scheme: dark)');
const themes = {
  light: create({
    base: 'light',
    appContentBg: '#ffffff',
    textColor: '#1f2328',
    colorSecondary: '#0969da',
    appBorderColor: '#d1d9e0',
    fontBase:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
  }),
  dark: create({
    base: 'dark',
    appContentBg: '#0d1117',
    textColor: '#f0f6fc',
    colorSecondary: '#4493f8',
    appBorderColor: '#3d444d',
    fontBase:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
  }),
};

export const getSystemTheme = () => themes[preference.matches ? 'dark' : 'light'];

export function subscribeToSystemTheme(listener: () => void) {
  preference.addEventListener('change', listener);

  return () => preference.removeEventListener('change', listener);
}
