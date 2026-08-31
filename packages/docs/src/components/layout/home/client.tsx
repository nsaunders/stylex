/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';
import {
  type ComponentProps,
  type CSSProperties,
  Fragment,
  useState,
} from 'react';
import Link from 'fumadocs-core/link';
import { BaseLinkItem, type LinkItemType } from '../shared/index';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../../navigation-menu';
import { and, not, on, or } from '@/css';
import { pipe } from 'remeda';

type Style = CSSProperties & {
  cornerShape?: string;
};

export function Navbar({
  className,
  style,
  disableShadowBlur,
  ...props
}: ComponentProps<'header'> & { disableShadowBlur?: boolean }) {
  const [value, setValue] = useState('');
  const compactShadowClassName = 'a';
  const compactShadow = `&.${compactShadowClassName}` satisfies Parameters<
    typeof on
  >[0];

  return (
    <NavigationMenu asChild onValueChange={setValue} value={value}>
      <>
        <div style={{ height: 56 }} />
        <header
          id="nd-nav"
          {...props}
          className={className}
          style={mergeStyles(
            {
              position: 'fixed',
              insetInline: 0,
              top: 0,
              zIndex: 10,
              height: 56 + 16,
              padding: 8,
            },
            style,
          )}
        >
          <div
            className={disableShadowBlur ? compactShadowClassName : undefined}
            style={mergeStyles(
              {
                position: 'absolute',
                insetInlineStart: -8,
                insetInlineEnd: -8,
                top: -8,
                bottom: -32,
                pointerEvents: 'none',
                backdropFilter: 'blur(32px)',
                maskImage: 'linear-gradient(to bottom, white 30%, transparent)',
              },
              pipe({}, on(compactShadow, { bottom: -8 })),
            )}
          />
          <div
            className={disableShadowBlur ? compactShadowClassName : undefined}
            style={mergeStyles(
              {
                position: 'absolute',
                insetInlineStart: -8,
                insetInlineEnd: -8,
                top: -8,
                bottom: -32,
                pointerEvents: 'none',
                backgroundColor: 'var(--color-fd-background)',
                maskImage:
                  'linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 50%, transparent)',
              },
              pipe({}, on(compactShadow, { bottom: -8 })),
            )}
          />
          <div
            style={mergeStyles({
              position: 'absolute',
              inset: 8,
              overflow: 'hidden',
              pointerEvents: 'none',
              borderColor: 'var(--color-fd-border)',
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: 20,
              cornerShape: 'squircle',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            })}
          >
            <div
              style={{
                position: 'absolute',
                insetInlineStart: -8,
                insetInlineEnd: -8,
                top: -8,
                bottom: -32,
                pointerEvents: 'none',
                backdropFilter: 'blur(16px) saturate(600%)',
              }}
            />
          </div>

          <NavigationMenuList asChild>
            <nav
              className={className}
              style={mergeStyles(
                {
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 'var(--max-w-fd-container)',
                  height: 14 * 4,
                  paddingInline: 4 * 4,
                  marginInline: 'auto',
                },
                {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 4 * 4,
                  alignItems: 'center',
                  paddingInline: 4 * 4,
                },
                style,
              )}
            >
              {props.children}
            </nav>
          </NavigationMenuList>
          <div
            style={mergeStyles({
              position: 'absolute',
              inset: 9,
              zIndex: 10,
              overflow: 'hidden',
              pointerEvents: 'none',
              backgroundColor: 'transparent',
              borderRadius: 19,
              cornerShape: 'squircle',
              backdropFilter: 'blur(20px) saturate(1000%)',
              maskImage:
                'linear-gradient(to bottom, white, transparent 16%, transparent 84%, white)',
            })}
          />
        </header>
      </>
    </NavigationMenu>
  );
}

export function NavbarLinkItem({
  item,
  className,
  style,
}: {
  item: LinkItemType;
  className?: string;
  style?: CSSProperties;
}) {
  const mainClassName = 'a';
  const main = and(`&.${mainClassName}`, not('&.c')) satisfies Parameters<
    typeof on
  >[0];
  const buttonClassName = 'b';
  const button = and(`&.${buttonClassName}`, not('&.c')) satisfies Parameters<
    typeof on
  >[0];
  const iconClassName = 'c';
  const icon = `&.${iconClassName}` satisfies Parameters<typeof on>[0];

  if (item.type === 'custom')
    return (
      <div className={className} style={style}>
        {item.children}
      </div>
    );

  if (item.type === 'menu') {
    const children = item.items.map((child, j) => {
      if (child.type === 'custom') {
        return <Fragment key={j}>{child.children}</Fragment>;
      }

      const {
        banner = child.icon ? (
          <div
            style={mergeStyles({
              // w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4
              width: 'fit-content',
              padding: 4,
              backgroundColor: 'var(--color-fd-muted)',
              borderColor: 'var(--color-fd-border)',
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: '8px',
              '--svg-size': '4px',
            })}
          >
            {child.icon}
          </div>
        ) : null,
        className: menuLinkClassName,
        style: menuLinkStyle,
        ...rest
      } = child.menu ?? {};

      return (
        <NavigationMenuLink asChild key={`${j}-${child.url}`}>
          <Link
            external={child.external}
            href={child.url}
            {...rest}
            className={menuLinkClassName}
            style={mergeStyles(
              pipe(
                {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2 * 4,
                  padding: 3 * 4,
                  backgroundColor: 'var(--bg-fd-card)',
                  borderColor: 'var(--color-fd-border)',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderRadius: '8px',
                  transitionProperty: 'background-color, color',
                },
                on('&:hover', {
                  color: 'var(--text-fd-primary)',
                  backgroundColor:
                    'color-mix(in oklab, var(--color-fd-accent) 80%, transparent)',
                }),
              ),
              menuLinkStyle,
            )}
          >
            {rest.children ?? (
              <>
                {banner}
                <p
                  style={{
                    // 'text-[15px] font-medium'
                    fontSize: `${15 / 16}rem`,
                    fontWeight: 500,
                  }}
                >
                  {child.text}
                </p>
                <p
                  style={pipe(
                    {
                      fontSize: `${12 / 16}rem`,
                      color: 'var(--text-fd-muted-foreground)',
                    },
                    on('&:empty', { display: 'none' }),
                  )}
                >
                  {child.description}
                </p>
              </>
            )}
          </Link>
        </NavigationMenuLink>
      );
    });

    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger
          className={className}
          style={mergeStyles(
            { '--svg-size': '4px' },
            pipe(
              {
                display: 'inline-flex',
                gap: 1 * 4,
                alignItems: 'center',
                padding: 2 * 4,
                color: 'var(--color-fd-secondary-foreground)',
                borderRadius: 8,
                cornerShape: 'squircle',
              },
              on(or('&:where([data-active=true])', '&:hover'), {
                color: 'var(--color-fd-primary)',
              }),
            ),
            { borderRadius: '8px' },
            style,
          )}
        >
          {item.url ? (
            <Link external={item.external} href={item.url}>
              {item.text}
            </Link>
          ) : (
            item.text
          )}
        </NavigationMenuTrigger>
        <NavigationMenuContent
          style={pipe(
            {
              // "grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3"
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 2 * 4,
              padding: 4 * 4,
            },
            on('@media (min-width: 1024px)', {
              gridTemplateColumns: 'repeat(3, 1fr)',
            }),
            on(and('@media (min-width: 768px)', '@media (max-width: 1024px)'), {
              gridTemplateColumns: 'repeat(2, 1fr)',
            }),
          )}
        >
          {children}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <BaseLinkItem
          aria-label={item.type === 'icon' ? item.label : undefined}
          className={
            [
              className,
              item.type === 'main'
                ? mainClassName
                : item.type === 'button'
                  ? buttonClassName
                  : item.type === 'icon'
                    ? iconClassName
                    : undefined,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
          item={item}
          style={mergeStyles(
            pipe(
              { '--svg-size': '4px' },
              on(main, {
                display: 'inline-flex',
                gap: 1 * 4,
                alignItems: 'center',
                padding: 2 * 4,
                color: 'var(--color-fd-secondary-foreground)',
                borderRadius: 8,
                cornerShape: 'squircle',
              }),
              on(and(main, or('&:where([data-active=true])', '&:hover')), {
                color: 'var(--color-fd-primary)',
              }),
              on(or(button, icon), {
                // 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring'
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                fontSize: `${14 / 16}rem`,
                fontWeight: 500,
                outline: 'none',
                borderRadius: 8,
                boxShadow: 'none',
                transitionTimingFunction: 'ease-in-out',
                transitionDuration: '0.1s',
                transitionProperty: 'background-color',
              }),
              on(and(or(button, icon), '&:focus-visible'), {
                boxShadow: '0 0 0 2px var(--color-fd-primary)',
              }),
              on(button, {
                gap: 1.5 * 4,
                color: 'var(--color-fd-secondary-foreground)',
                backgroundColor: 'var(--color-fd-secondary)',
                borderColor: 'var(--color-fd-accent)',
                borderStyle: 'solid',
                borderWidth: 1,
              }),
              on(and(button, '&:hover'), {
                color: 'var(--color-fd-accent-foreground)',
                backgroundColor: 'var(--color-fd-accent)',
              }),
              on(icon, {
                padding: 12,
                color: 'var(--color-fd-foreground)',
                backgroundColor: 'transparent',
                '--svg-size': '20px',
              }),
              on(and(icon, '&:hover'), {
                color: 'var(--color-fd-primary)',
              }),
            ),
            style,
          )}
        >
          {item.type === 'icon' ? item.icon : item.text}
        </BaseLinkItem>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export const Menu = NavigationMenuItem;

export function MenuLinkItem({
  item,
  className,
  style,
}: {
  item: LinkItemType;
  className?: string;
  style?: CSSProperties;
}) {
  const mainClassName = 'a';
  const main = `&.${mainClassName}` satisfies Parameters<typeof on>[0];
  const iconClassName = 'b';
  const icon = `&.${iconClassName}` satisfies Parameters<typeof on>[0];
  const buttonClassName = 'c';
  const button = `&.${buttonClassName}` satisfies Parameters<typeof on>[0];

  if (item.type === 'custom')
    return (
      <div
        className={className}
        style={mergeStyles({ display: 'grid' }, style)}
      >
        {item.children}
      </div>
    );

  if (item.type === 'menu') {
    const header = (
      <>
        {item.icon}
        {item.text}
      </>
    );

    return (
      <div
        className={className}
        style={mergeStyles(
          {
            display: 'flex',
            flexDirection: 'column',
            // mb-4 flex flex-col
            marginBottom: 4 * 4,
          },
          style,
        )}
      >
        <p
          style={{
            // "mb-1 text-sm text-fd-muted-foreground"
            marginBottom: 1 * 4,
            fontSize: `${12 / 16}rem`,
            color: 'var(--text-fd-muted-foreground)',
          }}
        >
          {item.url ? (
            <NavigationMenuLink asChild>
              <Link external={item.external} href={item.url}>
                {header}
              </Link>
            </NavigationMenuLink>
          ) : (
            header
          )}
        </p>
        {item.items.map((child, i) => (
          <MenuLinkItem item={child} key={i} />
        ))}
      </div>
    );
  }

  return (
    <NavigationMenuLink asChild>
      <BaseLinkItem
        aria-label={item.type === 'icon' ? item.label : undefined}
        className={
          [
            className,
            item.type == null || item.type === 'main'
              ? mainClassName
              : item.type === 'icon'
                ? iconClassName
                : item.type === 'button'
                  ? buttonClassName
                  : undefined,
          ]
            .filter(Boolean)
            .join(' ') || undefined
        }
        item={item}
        style={mergeStyles(
          pipe(
            { display: 'inline-flex', alignItems: 'center' },
            on(and(main, '&:where([data-active=true])'), {
              fontWeight: 500,
              color: 'var(--text-fd-primary)',
            }),
            on(main, {
              // 'inline-flex items-center gap-2 py-1.5 transition-colors hover:text-fd-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-fd-primary [&_svg]:size-4'
              gap: 2 * 4,
              padding: 1.5 * 4,
              transitionProperty: 'color, background-color, border-color',
              '--svg-size': '4px',
            }),
            on(and(main, '&:hover'), {
              color:
                'color-mix(in oklab, var(--color-fd-popover-foreground) 50%, transparent)',
            }),
            on(or(icon, button), {
              // 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring'
              justifyContent: 'center',
              padding: 8,
              fontSize: `${14 / 16}rem`,
              fontWeight: 500,
              outline: 'none',
              borderRadius: 8,
              boxShadow: 'none',
              transitionTimingFunction: 'ease-in-out',
              transitionDuration: '0.1s',
              transitionProperty: 'background-color',
            }),
            on(and(or(icon, button), '&:focus-visible'), {
              boxShadow: '0 0 0 2px var(--color-fd-primary)',
            }),
            on(icon, {
              padding: 12,
              color: 'var(--color-fd-foreground)',
              backgroundColor: 'transparent',
              '--svg-size': '20px',
            }),
            on(and(icon, '&:hover'), {
              color: 'var(--color-fd-primary)',
            }),
            on(button, {
              // gap-1.5 [&_svg]:size-4
              gap: 1.5 * 4,
              color: 'var(--color-fd-secondary-foreground)',
              backgroundColor: 'var(--color-fd-secondary)',
              borderColor: 'var(--color-fd-accent)',
              borderStyle: 'solid',
              borderWidth: 1,
              '--svg-size': '4px',
            }),
            on(and(button, '&:hover'), {
              color: 'var(--color-fd-accent-foreground)',
              backgroundColor: 'var(--color-fd-accent)',
            }),
          ),
          style,
        )}
      >
        {item.icon}
        {item.type === 'icon' ? undefined : item.text}
      </BaseLinkItem>
    </NavigationMenuLink>
  );
}

export function MenuTrigger({
  enableHover = false,
  ...props
}: ComponentProps<typeof NavigationMenuTrigger> & {
  /**
   * Enable hover to trigger
   */
  enableHover?: boolean;
}) {
  return (
    <NavigationMenuTrigger
      {...props}
      onPointerMove={enableHover ? undefined : (e) => e.preventDefault()}
    >
      {props.children}
    </NavigationMenuTrigger>
  );
}

export function MenuContent({
  style,
  ...props
}: ComponentProps<typeof NavigationMenuContent>) {
  return (
    <NavigationMenuContent
      {...props}
      style={mergeStyles(
        {
          // "flex flex-col p-4"
          display: 'flex',
          flexDirection: 'column',
          padding: 4 * 4,
        },
        style,
      )}
    >
      {props.children}
    </NavigationMenuContent>
  );
}

function mergeStyles(
  ...styles: Array<Style | CSSProperties | false | undefined>
): Style {
  const result: Style = {};

  for (const style of styles) {
    if (style) Object.assign(result, style);
  }

  return result;
}
