import { addons } from 'storybook/manager-api';
import { getSystemTheme, subscribeToSystemTheme } from './theme';

const updateTheme = () => addons.setConfig({ theme: getSystemTheme() });

updateTheme();
subscribeToSystemTheme(updateTheme);
