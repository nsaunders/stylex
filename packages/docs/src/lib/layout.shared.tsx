import type { BaseLayoutProps } from '@/components/layout/shared';
import LogoBold from '@/components/LogoBold';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <LogoBold
          style={{
            ...{ '--fg1': 'var(--color-fd-card-foreground)' },
            height: 36,
          }}
        />
      ),
    },
    githubUrl: 'https://github.com/facebook/stylex',
    links: [
      {
        type: 'main',
        text: 'Docs',
        url: '/docs/learn',
        active: 'nested-url',
      },
      {
        type: 'main',
        text: 'API',
        url: '/docs/api',
        active: 'nested-url',
      },
      {
        type: 'main',
        text: 'Blog',
        url: '/blog',
        active: 'nested-url',
      },
      {
        type: 'main',
        text: 'Playground',
        url: '/playground',
        active: 'nested-url',
      },
    ],
  };
}
