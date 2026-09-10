import type { CSSProperties } from 'react';
import type { StorybookTheme } from 'storybook/theming';
import { useTheme } from 'storybook/theming';
import type { MarkdownDocument, LayoutProps, Presentation } from './types.js';
import {
  Markdown,
  Title,
  Primary,
  Controls,
  Stories,
  CodeOrSourceMdx,
  HeadersMdx,
} from '@storybook/addon-docs/blocks';

export type { MarkdownDocument, LayoutProps, Presentation } from './types.js';

export function DefaultMarkdownRenderer({ markdown }: MarkdownDocument) {
  return (
    <Markdown
      options={{
        disableParsingRawHTML: true,
        overrides: { code: CodeOrSourceMdx, ...HeadersMdx, a: 'a' },
      }}
    >
      {markdown}
    </Markdown>
  );
}

export function DefaultLayout({ documents, title, attached, children, examples }: LayoutProps) {
  const tags = [
    ...new Set(
      documents.flatMap(({ metadata }) =>
        Array.isArray(metadata.tags) ? (metadata.tags as string[]) : [],
      ),
    ),
  ];

  const statuses = [
    ...new Set(
      documents.flatMap(({ metadata }) =>
        typeof metadata.status === 'string' ? [metadata.status] : [],
      ),
    ),
  ];

  return (
    <>
      <div className="storybook-addon-md-title">
        {attached ? <Title /> : <h1>{title.split('/').at(-1)}</h1>}
      </div>

      {(tags.length > 0 || statuses.length > 0) && (
        <ul className="storybook-addon-md-tags" aria-label="Documentation tags">
          {tags.map((tag) => (
            <li className="storybook-addon-md-tag" key={`tag:${tag}`}>
              {tag}
            </li>
          ))}

          {statuses.map((status) => (
            <li className="storybook-addon-md-tag" data-status={status} key={`status:${status}`}>
              {status}
            </li>
          ))}
        </ul>
      )}

      {children}
      {examples}
    </>
  );
}

export function Documentation({
  documents,
  title,
  attached = false,
  presentation = {},
}: {
  documents: MarkdownDocument[];
  title: string;
  attached?: boolean;
  presentation?: Presentation;
}) {
  const theme = useTheme() as StorybookTheme;
  const defaults = {
    '--sbmd-native-color': theme.color.defaultText,
    '--sbmd-native-link-color': theme.color.secondary,
    '--sbmd-native-font-family': theme.typography.fonts.base,
    '--sbmd-native-monospace-font-family': theme.typography.fonts.mono,
    '--sbmd-native-border-color': theme.appBorderColor,
    '--sbmd-native-code-background': theme.background.content,
  } as CSSProperties;
  const Layout = presentation.Layout ?? DefaultLayout;
  const Renderer = presentation.MarkdownRenderer ?? DefaultMarkdownRenderer;
  const examples = attached ? (
    <>
      <Primary />
      <Controls />
      <Stories includePrimary={false} />
    </>
  ) : null;

  return (
    <div className="storybook-addon-md-page" style={defaults}>
      <Layout documents={documents} title={title} attached={attached} examples={examples}>
        {documents.map((document) => (
          <div className="storybook-addon-md" key={document.source}>
            <Renderer {...document} />
          </div>
        ))}
      </Layout>
    </div>
  );
}
