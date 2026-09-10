import type { ComponentType, ReactNode } from 'react';

export interface MarkdownDocument {
  source: string;
  markdown: string;
  metadata: Record<string, unknown>;
}

export interface LayoutProps {
  documents: MarkdownDocument[];
  title: string;
  attached: boolean;
  children: ReactNode;
  examples: ReactNode;
}

export interface Presentation {
  Layout?: ComponentType<LayoutProps>;
  MarkdownRenderer?: ComponentType<MarkdownDocument>;
}
