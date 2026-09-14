import type { ComponentProps, CSSProperties, MouseEvent, ReactNode } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import type { StorybookTheme } from 'storybook/theming';
import { useTheme } from 'storybook/theming';
import { addons } from 'storybook/preview-api';
import { NAVIGATE_URL } from 'storybook/internal/core-events';
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

const calloutLabels = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

function Blockquote({ children, ...props }: ComponentProps<'blockquote'>) {
  const [first, ...rest] = Children.toArray(children);
  const paragraph =
    isValidElement<{ children?: ReactNode }>(first) && first.type === 'p' ? first : undefined;
  const items = Children.toArray(paragraph?.props.children);
  const split = items.findIndex((item) => typeof item !== 'string');
  const leading = items.slice(0, split === -1 ? items.length : split).join('');
  const marker = /^\[!(note|tip|important|warning|caution)\](\n|$)/i.exec(leading);

  if (!paragraph || !marker || (!marker[2] && split !== -1)) {
    return <blockquote {...props}>{children}</blockquote>;
  }

  const type = marker[1].toLowerCase() as keyof typeof calloutLabels;
  const remainder = leading.slice(marker[0].length);
  const trailing = split === -1 ? [] : items.slice(split);
  const content =
    remainder || trailing.length
      ? [
          cloneElement(paragraph, undefined, ...(remainder ? [remainder] : []), ...trailing),
          ...rest,
        ]
      : rest;

  return (
    <div className="storybook-addon-md-callout" data-callout={type}>
      <p className="storybook-addon-md-callout-label">{calloutLabels[type]}</p>
      {content}
    </div>
  );
}

function navigate(event: MouseEvent<HTMLDivElement>) {
  const anchor = (event.target as Element).closest('a');
  const href = anchor?.getAttribute('href');

  if (
    !anchor ||
    !href?.startsWith('?path=') ||
    !event.currentTarget.contains(anchor) ||
    anchor.target === '_blank' ||
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  )
    return;

  event.preventDefault();
  addons.getChannel().emit(NAVIGATE_URL, href);
}

export function DefaultMarkdownRenderer({ markdown }: MarkdownDocument) {
  return (
    <Markdown
      options={{
        disableParsingRawHTML: true,
        overrides: { code: CodeOrSourceMdx, ...HeadersMdx, a: 'a', blockquote: Blockquote },
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
  const dark = theme.base === 'dark';
  const defaults = {
    '--sbmd-native-color': theme.color.defaultText,
    '--sbmd-native-link-color': theme.color.secondary,
    '--sbmd-native-font-family': theme.typography.fonts.base,
    '--sbmd-native-monospace-font-family': theme.typography.fonts.mono,
    '--sbmd-native-border-color': theme.appBorderColor,
    '--sbmd-native-code-background': theme.background.content,
    '--sbmd-native-callout-note-color': theme.color.secondary,
    '--sbmd-native-callout-tip-color': dark ? theme.color.positive : theme.color.positiveText,
    '--sbmd-native-callout-important-color': dark
      ? `color-mix(in srgb, ${theme.color.purple}, white 45%)`
      : theme.color.purple,
    '--sbmd-native-callout-warning-color': dark ? theme.color.warning : theme.color.warningText,
    '--sbmd-native-callout-caution-color': dark ? theme.color.negative : theme.color.negativeText,
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
          <div className="storybook-addon-md" key={document.source} onClick={navigate}>
            <Renderer {...document} />
          </div>
        ))}
      </Layout>
    </div>
  );
}
