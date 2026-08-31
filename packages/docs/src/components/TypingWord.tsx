/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import { animationNames } from '@/css';

const WORDS = [
  'expressive',
  'type-safe',
  'composable',
  'predictable',
  'themeable',
];

export default function TypingWord() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-grid',
        gridTemplateColumns: '1fr',
        overflow: 'hidden',
        fontWeight: 600,
        verticalAlign: 'top',
        color: 'var(--color-fd-primary)',
        borderInlineEndColor: 'transparent',
        borderInlineEndStyle: 'solid',
        borderInlineEndWidth: 1,
        animationName: animationNames.typing,
        animationDuration: `${TIME}s`,
        animationTimingFunction: 'ease-out',
        animationDelay: `${TIME / 2}s`,
        animationIterationCount: 'infinite',
      }}
    >
      {WORDS.map((word, index) => (
        <span
          key={word}
          style={{
            gridArea: '1 / 1',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            animationName: animationNames.typingWord,
            animationDuration: `${TIME * WORDS.length}s`,
            animationTimingFunction: `steps(${WORDS.length})`,
            animationDelay: `${TIME * (index - WORDS.length)}s`,
            animationIterationCount: 'infinite',
          }}
        >
          {word}
          <span
            style={{
              position: 'absolute',
              top: -9999,
              left: -9999,
              fontSize: '0.01em',
              opacity: 0.0001,
            }}
          >
            {index < WORDS.length - 2
              ? ', '
              : index === WORDS.length - 2
                ? ' and '
                : ''}
          </span>
        </span>
      ))}
    </span>
  );
}

const TIME = 8;
