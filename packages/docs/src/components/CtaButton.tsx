/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ReactNode } from 'react';
import { pipe } from 'remeda';
import { Link } from 'waku';
import { and, not, on, or } from '@/css';

export default function CtaButton({
  children,
  color,
  to,
}: {
  children: ReactNode;
  color: 'pink' | 'blue';
  to: string;
}) {
  const pinkClassName = 'a';
  const pink = `&.${pinkClassName}` satisfies Parameters<typeof on>[0];
  const blue = not(pink);

  return (
    <Link
      className={color === 'pink' ? pinkClassName : undefined}
      style={pipe(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBlock: '1rem',
          paddingInline: '2rem',
          fontWeight: 400,
          whiteSpace: 'nowrap',
          color: 'var(--color-fd-background)',
          textDecoration: 'none',
          backgroundColor: 'var(--color-fd-accent-foreground)',
          borderColor: 'var(--color-fd-accent-foreground)',
          borderStyle: 'solid',
          borderWidth: 2,
          borderRadius: 10,
          scale: '1',
          transitionDuration: '0.2s',
          transitionProperty: 'scale, color, background-color',
        },
        on(pink, {
          backgroundColor: 'var(--color-fd-primary)',
          borderColor: 'var(--color-fd-primary)',
        }),
        on(and(blue, or('&:hover', '&:focus-visible')), {
          color: 'var(--color-fd-accent-foreground)',
          backgroundColor:
            'color-mix(in srgb, var(--color-fd-accent-foreground) 10%, transparent)',
        }),
        on(and(pink, or('&:hover', '&:focus-visible')), {
          color: 'var(--color-fd-primary)',
          backgroundColor:
            'color-mix(in srgb, var(--color-fd-primary) 10%, transparent)',
        }),
        on('&:hover', {
          textDecoration: 'none',
          scale: '1.02',
        }),
        on('&:active', {
          scale: '0.98',
          transitionDuration: '0.05s',
        }),
      )}
      to={to}
    >
      {children}
    </Link>
  );
}
