/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';

import { Search } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { on, or } from '@/css';
import type { ComponentProps } from 'react';
import { pipe } from 'remeda';

export function LargeSearchToggle({
  hideIfDisabled,
  className,
  style,
  ...props
}: ComponentProps<'button'> & {
  hideIfDisabled?: boolean;
}) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const { text } = useI18n();
  if (hideIfDisabled && !enabled) return null;

  return (
    <button
      className={className}
      data-search-full=""
      type="button"
      {...props}
      onClick={() => {
        setOpenSearch(true);
      }}
      style={{
        ...pipe(
          {
            // '  text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground'
            display: 'inline-flex',
            gap: 2 * 4,
            alignItems: 'center',
            width: '100%',
            minWidth: 90,
            padding: 1.5 * 4,
            paddingInlineStart: 2.5 * 4,

            fontSize: `${14 / 16}rem`,
            color: 'var(--color-fd-muted-foreground)',
            outline: 'none',

            backgroundColor: 'transparent',
            borderColor: 'var(--color-fd-border)',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: '9999px',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',

            transitionDuration: '150ms',
            transitionProperty: 'color, background-color, border-color',
          },
          on(or('&:hover', '&:focus-visible'), {
            color: 'var(--color-fd-foreground)',
            backgroundColor:
              'color-mix(in oklab, var(--color-fd-primary) 5%, transparent)',
            borderColor: 'var(--color-fd-primary)',
          }),
        ),
        ...style,
      }}
    >
      <Search style={{ width: 16, height: 16 }} />
      <span
        style={pipe({}, on('@container (width < 240px)', { display: 'none' }))}
      >
        {text.search}
      </span>
      <div
        style={{
          display: 'inline-flex',
          gap: 0.5 * 4,
          marginInlineStart: 'auto',
        }}
      >
        {hotKey.map((k, i) => (
          <kbd
            key={i}
            style={{
              paddingInline: 1.5 * 4,
              backgroundColor: 'var(--color-fd-background)',
              borderColor: 'var(--color-fd-border)',
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: 8,
            }}
          >
            {k.display}
          </kbd>
        ))}
      </div>
    </button>
  );
}
