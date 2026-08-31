/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import {
  type BaseLayoutProps,
  getLinks,
  type LinkItemType,
  type NavOptions,
} from '../shared/index';
import { LargeSearchToggle } from '../../search-toggle';
import { ThemeToggle } from '../../theme-toggle';
import Link from 'fumadocs-core/link';
import { Navbar, NavbarLinkItem } from './client';
import SidebarToggle from './SidebarToggle';
import { on, or } from '@/css';
import { pipe } from 'remeda';

export interface HomeLayoutProps extends BaseLayoutProps {
  nav?: Partial<
    NavOptions & {
      /**
       * Open mobile menu when hovering the trigger
       */
      enableHoverToOpen?: boolean;
    }
  >;
  disableShadowBlur?: true;
}

export function HomeLayout({
  nav = {},
  links,
  githubUrl,
  i18n,
  showSidebarToggle = true,
  style,
  children,
  disableShadowBlur,
  ...rest
}: HomeLayoutProps & HTMLAttributes<HTMLElement>) {
  return (
    <main
      id="nd-home-layout"
      {...rest}
      style={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        ...style,
      }}
    >
      {nav.enabled !== false &&
        (nav.component ?? (
          <Header
            disableShadowBlur={disableShadowBlur}
            githubUrl={githubUrl}
            i18n={i18n}
            links={links}
            nav={nav}
            showSidebarToggle={showSidebarToggle}
          />
        ))}
      {children}
    </main>
  );
}

export function Header({
  nav = {},
  links,
  githubUrl,
  showSidebarToggle = true,
  disableShadowBlur,
}: HomeLayoutProps) {
  const finalLinks = useMemo(
    () => getLinks(links, githubUrl),
    [links, githubUrl],
  );

  const navItems = finalLinks.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all'),
  );
  const iconClassName = 'c';
  const icon = `&.${iconClassName}` satisfies Parameters<typeof on>[0];
  const firstClassName = 'a';
  const first = `&.${firstClassName}` satisfies Parameters<typeof on>[0];
  const lastClassName = 'b';
  const last = `&.${lastClassName}` satisfies Parameters<typeof on>[0];

  return (
    <Navbar disableShadowBlur={disableShadowBlur}>
      {showSidebarToggle && <SidebarToggle />}
      <Link
        href={nav.url ?? '/'}
        style={{
          display: 'inline-flex',
          gap: 2.5 * 4,
          alignItems: 'center',
          fontWeight: 600,
        }}
      >
        {nav.title}
      </Link>
      {nav.children}
      <ul
        style={pipe(
          {
            display: 'flex',
            flexDirection: 'row',
            gap: 2 * 4,
            alignItems: 'center',
          },
          on('@media (max-width: 760px)', { display: 'none' }),
        )}
      >
        {navItems
          .filter((item) => !isSecondary(item))
          .map((item, i) => (
            <NavbarLinkItem
              item={item}
              key={i}
              style={pipe(
                {
                  fontSize: '1rem',
                  lineHeight: 1.4,
                  outline: 'none',
                  boxShadow: 'none',
                },
                on('&:focus-visible', {
                  boxShadow: '0 0 0 2px var(--color-fd-primary)',
                }),
              )}
            />
          ))}
      </ul>
      <div style={{ flexGrow: 1 }} />
      <ul
        style={pipe(
          {
            display: 'flex',
            flexDirection: 'row',
            gap: 2 * 4,
            alignItems: 'center',
            marginInline: -8,
          },
          on(or('&:empty', '@media (max-width: 360px)'), {
            display: 'none',
          }),
        )}
      >
        {navItems.filter(isSecondary).map((item, i) => (
          <NavbarLinkItem
            className={
              item.type === 'icon'
                ? [
                    iconClassName,
                    i === 0 ? firstClassName : undefined,
                    i === navItems.length - 1 ? lastClassName : undefined,
                  ]
                    .filter(Boolean)
                    .join(' ')
                : undefined
            }
            item={item}
            key={i}
            style={pipe(
              {},
              on(icon, { marginInlineStart: -4, marginInlineEnd: -4 }),
              on(first, { marginInlineStart: 0 }),
              on(last, { marginInlineEnd: 0 }),
            )}
          />
        ))}
      </ul>
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          flexBasis: 120,
          flexDirection: 'row',
          gap: 1.5 * 4,
          alignItems: 'center',
          justifyContent: 'end',
          maxWidth: 240,
          containerType: 'inline-size',
        }}
      >
        <LargeSearchToggle />
      </div>
      <ThemeToggle />
    </Navbar>
  );
}

function isSecondary(item: LinkItemType): boolean {
  if ('secondary' in item && item.secondary != null) return item.secondary;

  return item.type === 'icon';
}
