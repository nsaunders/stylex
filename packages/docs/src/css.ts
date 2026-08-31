/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createHooks } from '@css-hooks/react';

declare module 'react' {
  // eslint-disable-next-line no-unused-vars
  interface CSSProperties {
    '--fd-animated-height'?: string;
    '--svg-size'?: string;
  }
}

const hooks = createHooks(
  ...([768, 1024] as const).map((x) => `@media (min-width: ${x}px)` as const),
  ...([360, 420, 460, 760, 768, 1024] as const).map(
    (x) => `@media (max-width: ${x}px)` as const,
  ),
  '@container (width < 240px)',
  '&:active',
  '&:where([data-active=true])',
  '&:empty',
  '&:focus-visible',
  '&:hover',
  '&::placeholder',
  '&:where([data-state=closed])',
  '&:where([data-state=open])',
  '&.a',
  '&.b',
  '&.c',
);

export const { and, not, on, or } = hooks;

type AnimationName =
  | 'logoRotate'
  | 'logoFade'
  | 'logoFadeSecondary'
  | 'typing'
  | 'typingWord'
  | 'searchPulse'
  | 'searchDialogIn'
  | 'searchDialogOut';

export const animationNames = new Proxy({} as { [P in AnimationName]: P }, {
  get: (_, propertyName) => propertyName,
});

const pseudoElementProperties = {
  '-webkit-scrollbar': ['width', 'height'],
  '-webkit-scrollbar-corner': ['display'],
  '-webkit-scrollbar-thumb': ['background-color', 'border-radius'],
  '-webkit-scrollbar-track': ['background-color'],
} as const;

export const pseudoElementProperty = <
  PseudoElement extends keyof typeof pseudoElementProperties,
>(
  pseudoElement: PseudoElement,
  property: (typeof pseudoElementProperties)[PseudoElement][number],
) => `--${pseudoElement}_${property}`;

const additionalStyleSheet = String.raw`
:root {
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --color-fd-background: light-dark(hsl(0, 0%, 100%), hsl(0, 0%, 7%));
  --color-fd-foreground: light-dark(hsl(0, 0%, 3.9%), hsl(0, 0%, 92%));
  --color-fd-muted-foreground: light-dark(hsl(0, 0%, 45.1%), hsla(0, 0%, 70%, 0.8));
  --color-fd-popover: light-dark(hsl(0, 0%, 98%), hsl(0, 0%, 11.6%));
  --color-fd-popover-foreground: light-dark(hsl(0, 0%, 15.1%), hsl(0, 0%, 86.9%));
  --color-fd-card-foreground: light-dark(hsl(0, 0%, 3.9%), hsl(0, 0%, 98%));
  --color-fd-border: light-dark(hsla(0, 0%, 80%, 0.55), hsla(0, 0%, 30%, 0.25));
  --color-fd-primary: light-dark(hsl(266, 58%, 61.8%), hsl(270, 72%, 77%));
  --color-fd-secondary: light-dark(hsl(0, 0%, 93.1%), hsl(0, 0%, 12.9%));
  --color-fd-secondary-foreground: light-dark(hsl(0, 0%, 9%), hsl(0, 0%, 70%));
  --color-fd-accent: light-dark(hsl(222, 16%, 83%), hsl(222, 16%, 23%));
  --color-fd-accent-foreground: light-dark(hsl(222, 67%, 58%), hsl(222, 87%, 78%));
  --color-fd-overlay: light-dark(transparent, hsla(0, 0%, 0%, 0.2));
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border-width: 0;
    border-style: solid;
  }

  html,
  :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--font-sans);
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--color-fd-background);
  }

  a {
    color: inherit;
    text-decoration: inherit;
    touch-action: manipulation;
  }

  button {
    touch-action: manipulation;
  }
}

@keyframes ${animationNames.logoRotate} {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes ${animationNames.logoFade} {
  0%,
  45% {
    opacity: 1;
    transform: scale(1);
  }

  55%,
  90% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@keyframes ${animationNames.logoFadeSecondary} {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  10%,
  58% {
    opacity: 1;
    transform: scale(1);
  }

  68%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@keyframes ${animationNames.typing} {
  37% {
    grid-template-columns: 1fr;
    border-inline-end-color: transparent;
  }

  40% {
    grid-template-columns: 1fr;
    border-inline-end-color: var(--color-fd-accent-foreground);
  }

  49%,
  51% {
    grid-template-columns: 0fr;
    border-inline-end-color: var(--color-fd-accent-foreground);
  }

  60% {
    grid-template-columns: 1fr;
    border-inline-end-color: var(--color-fd-accent-foreground);
  }

  63% {
    grid-template-columns: 1fr;
    border-inline-end-color: transparent;
  }
}

@keyframes ${animationNames.typingWord} {
  0%,
  20% {
    display: inline;
    font-size: 1em;
    opacity: 1;
  }

  20.001%,
  100% {
    display: none;
    font-size: 0.1em;
    opacity: 0;
  }
}

@keyframes ${animationNames.searchPulse} {
  50% {
    opacity: 0.5;
  }
}

@keyframes ${animationNames.searchDialogIn} {
  from {
    opacity: 0;
    scale: 1.06;
  }

  to {
    scale: 1;
  }
}

@keyframes ${animationNames.searchDialogOut} {
  from {
    scale: 1;
  }

  to {
    opacity: 0;
    scale: 1.04;
  }
}

@layer base {
${Object.entries(pseudoElementProperties)
  .map(
    ([pseudoElement, properties]) =>
      `::${pseudoElement} { ${properties.map((property) => `${property}: var(${pseudoElementProperty(pseudoElement as keyof typeof pseudoElementProperties, property)})`).join('; ')} }`,
  )
  .join('\n')}
}
`;

export function styleSheet(): string {
  return `${hooks.styleSheet()}\n${additionalStyleSheet}`;
}
