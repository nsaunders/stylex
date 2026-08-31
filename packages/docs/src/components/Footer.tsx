/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import { GithubIcon, TwitterIcon } from 'lucide-react';
import { pipe } from 'remeda';
import Bluesky from './icons/Bluesky';
import MetaOpenSource from './icons/MetaOpenSource';
import Link from 'fumadocs-core/link';
import { on, or } from '@/css';

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

const footerLinks = {
  develop: [
    { label: 'Learn', href: '/docs/learn' },
    { label: 'API', href: '/docs/api' },
  ],
  explore: [
    { label: 'Playground', href: '/playground' },
    { label: 'Blog', href: '/blog' },
  ],
  participate: [
    {
      label: 'GitHub',
      href: 'https://github.com/facebook/stylex',
      external: true,
    },
    { label: 'Acknowledgements', href: '/docs/acknowledgements' },
  ],
  legal: [
    {
      label: 'Privacy',
      href: 'https://opensource.fb.com/legal/privacy/',
      external: true,
    },
    {
      label: 'Terms',
      href: 'https://opensource.fb.com/legal/terms/',
      external: true,
    },
  ],
};

export default function Footer({
  noBorderTop = false,
}: {
  noBorderTop?: boolean;
}) {
  const borderedClassName = 'a';
  const bordered = `&.${borderedClassName}` satisfies Parameters<typeof on>[0];
  const externalClassName = 'b';
  const external = `&.${externalClassName}` satisfies Parameters<typeof on>[0];

  return (
    <footer
      className={noBorderTop ? undefined : borderedClassName}
      style={pipe(
        {
          backgroundColor: 'var(--color-fd-background)',
          transitionDuration: '300ms',
          transitionProperty: 'background-color, border-color',
        },
        on(bordered, {
          borderTopColor: 'var(--color-fd-border)',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
        }),
      )}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingTop: 48,
          paddingRight: 32,
          paddingBottom: 32,
          paddingLeft: 32,
        }}
      >
        <div
          style={pipe(
            {
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 32,
              width: '100%',
              maxWidth: 1280,
            },
            on('@media (min-width: 768px)', {
              gridTemplateColumns: 'repeat(4, 1fr)',
            }),
          )}
        >
          <div>
            <h4
              style={{
                marginBottom: 16,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-fd-foreground)',
                textAlign: 'center',
              }}
            >
              Develop
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'center',
                padding: 0,
                margin: 0,
                listStyle: 'none',
              }}
            >
              {footerLinks.develop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={pipe(
                      {
                        fontSize: '0.875rem',
                        color: 'var(--color-fd-muted-foreground)',
                        textDecoration: 'none',
                        transitionDuration: '150ms',
                        transitionProperty: 'color',
                      },
                      on('&:hover', {
                        color: 'var(--color-fd-foreground)',
                      }),
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                marginBottom: 16,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-fd-foreground)',
                textAlign: 'center',
              }}
            >
              Explore
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'center',
                padding: 0,
                margin: 0,
                listStyle: 'none',
              }}
            >
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={pipe(
                      {
                        fontSize: '0.875rem',
                        color: 'var(--color-fd-muted-foreground)',
                        textDecoration: 'none',
                        transitionDuration: '150ms',
                        transitionProperty: 'color',
                      },
                      on('&:hover', {
                        color: 'var(--color-fd-foreground)',
                      }),
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                marginBottom: 16,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-fd-foreground)',
                textAlign: 'center',
              }}
            >
              Participate
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'center',
                padding: 0,
                margin: 0,
                listStyle: 'none',
              }}
            >
              {footerLinks.participate.map((link) => (
                <li key={link.label}>
                  <Link
                    className={link.external ? externalClassName : undefined}
                    href={link.href}
                    style={pipe(
                      {
                        fontSize: '0.875rem',
                        color: 'var(--color-fd-muted-foreground)',
                        textDecoration: 'none',
                        transitionDuration: '150ms',
                        transitionProperty: 'color',
                      },
                      on(external, {
                        display: 'inline-flex',
                        gap: 4,
                        alignItems: 'center',
                      }),
                      on('&:hover', {
                        color: 'var(--color-fd-foreground)',
                      }),
                    )}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.label}
                    {link.external && (
                      <ExternalLinkIcon style={{ width: 12, height: 12 }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                marginBottom: 16,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-fd-foreground)',
                textAlign: 'center',
              }}
            >
              Legal
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'center',
                padding: 0,
                margin: 0,
                listStyle: 'none',
              }}
            >
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    className={link.external ? externalClassName : undefined}
                    href={link.href}
                    style={pipe(
                      {
                        fontSize: '0.875rem',
                        color: 'var(--color-fd-muted-foreground)',
                        textDecoration: 'none',
                        transitionDuration: '150ms',
                        transitionProperty: 'color',
                      },
                      on(external, {
                        display: 'inline-flex',
                        gap: 4,
                        alignItems: 'center',
                      }),
                      on('&:hover', {
                        color: 'var(--color-fd-foreground)',
                      }),
                    )}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.label}
                    {link.external && (
                      <ExternalLinkIcon style={{ width: 12, height: 12 }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          href="https://opensource.fb.com"
          rel="noopener noreferrer"
          style={pipe(
            {
              marginTop: 16,
              opacity: 0.5,
              transitionTimingFunction: 'ease-in-out',
              transitionDuration: '150ms',
              transitionProperty: 'opacity',
            },
            on(or('&:focus-visible', '&:hover'), {
              opacity: 1,
            }),
          )}
          target="_blank"
        >
          <MetaOpenSource style={{ height: 68 }} />
        </Link>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 1080,
          }}
        >
          <span
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-fd-muted-foreground)',
            }}
          >
            Copyright © {new Date().getFullYear()} Meta Platforms, Inc.
          </span>

          <div style={{ flexGrow: 1, minWidth: 32 }} />

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link
              href="https://github.com/facebook/stylex"
              rel="noopener noreferrer"
              style={pipe(
                {
                  padding: 8,
                  color: 'var(--color-fd-muted-foreground)',
                  transitionDuration: '150ms',
                  transitionProperty: 'color',
                },
                on('&:hover', {
                  color: 'var(--color-fd-foreground)',
                }),
              )}
              target="_blank"
            >
              <GithubIcon style={{ width: 20, height: 20 }} />
            </Link>
            <Link
              href="https://x.com/stylexjs"
              rel="noopener noreferrer"
              style={pipe(
                {
                  padding: 8,
                  color: 'var(--color-fd-muted-foreground)',
                  transitionDuration: '150ms',
                  transitionProperty: 'color',
                },
                on('&:hover', {
                  color: 'var(--color-fd-foreground)',
                }),
              )}
              target="_blank"
            >
              <TwitterIcon style={{ width: 20, height: 20 }} />
            </Link>
            <Link
              href="https://bsky.app/profile/stylexjs.bsky.social"
              rel="noopener noreferrer"
              style={pipe(
                {
                  padding: 8,
                  color: 'var(--color-fd-muted-foreground)',
                  transitionDuration: '150ms',
                  transitionProperty: 'color',
                },
                on('&:hover', {
                  color: 'var(--color-fd-foreground)',
                }),
              )}
              target="_blank"
            >
              <Bluesky style={{ width: 20, height: 20 }} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
