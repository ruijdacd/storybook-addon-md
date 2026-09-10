import { useSyncExternalStore, type PropsWithChildren } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { getSystemTheme, subscribeToSystemTheme } from './theme';

export function SystemDocsContainer(props: PropsWithChildren<DocsContainerProps>) {
  const theme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme);

  return <DocsContainer {...props} theme={theme} />;
}
