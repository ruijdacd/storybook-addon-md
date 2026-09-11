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

export function DefaultLayout({
  documents,
  title,
  attached,
  children,
  examples,
  heading,
  tagFields = [],
}: LayoutProps) {
  const tags = [
    ...new Set(
      documents.flatMap(({ metadata }) =>
        ['tags', ...tagFields].flatMap((field) => {
          const value = metadata[field];
          return (Array.isArray(value) ? value : [value]).filter(
            (item): item is string => typeof item === 'string' && Boolean(item.trim()),
          );
        }),
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
        {attached ? <Title /> : (heading ?? <h1>{title.split('/').at(-1)}</h1>)}
      </div>

      {(tags.length > 0 || statuses.length > 0) && (
        <ul className="storybook-addon-md-tags" aria-label="Documentation tags">
          {tags
            .filter((tag) => !statuses.includes(tag))
            .map((tag) => (
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
  tagFields = [],
}: {
  documents: MarkdownDocument[];
  title: string;
  attached?: boolean;
  presentation?: Presentation;
  tagFields?: string[];
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
  const first = documents[0];
  const heading =
    !attached && first?.heading ? <Renderer {...first} markdown={first.heading} /> : undefined;
  const examples = attached ? (
    <>
      <Primary />
      <Controls />
      <Stories includePrimary={false} />
    </>
  ) : null;

  return (
    <div className="storybook-addon-md-page" style={defaults}>
      <Layout
        documents={documents}
        title={title}
        attached={attached}
        examples={examples}
        heading={heading}
        tagFields={tagFields}
      >
        {documents.map((document) => (
          <div className="storybook-addon-md" key={document.source}>
            <Renderer {...document} />
          </div>
        ))}
      </Layout>
    </div>
  );
}
