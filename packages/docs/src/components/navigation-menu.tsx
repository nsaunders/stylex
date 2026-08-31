/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';

import * as Primitive from '@radix-ui/react-navigation-menu';
import { on, pseudoElementProperty } from '@/css';
import type { ComponentProps } from 'react';
import { pipe } from 'remeda';

const NavigationMenu = Primitive.Root;

const NavigationMenuList = Primitive.List;

const NavigationMenuItem = ({
  className,
  style,
  children,
  ref,
  ...props
}: ComponentProps<typeof Primitive.NavigationMenuItem>) => (
  <Primitive.NavigationMenuItem
    ref={ref}
    {...props}
    className={className}
    style={{ listStyleType: 'none', ...style }}
  >
    {children}
  </Primitive.NavigationMenuItem>
);

const NavigationMenuTrigger = ({
  className,
  style,
  children,
  ref,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) => (
  <Primitive.Trigger
    ref={ref}
    {...props}
    className={className}
    style={{
      ...pipe(
        {},
        on('&:where([data-state=open])', {
          backgroundColor:
            'color-mix(in oklab, var(--color-fd-accent) 50%, transparent)',
        }),
      ),
      ...style,
    }}
  >
    {children}
  </Primitive.Trigger>
);

const NavigationMenuContent = ({
  className,
  style,
  ref,
  ...props
}: ComponentProps<typeof Primitive.Content>) => (
  <Primitive.Content
    ref={ref}
    {...props}
    className={className}
    data-navigation-menu-content=""
    style={{
      [pseudoElementProperty("-webkit-scrollbar", "width")]: "5px",
      [pseudoElementProperty("-webkit-scrollbar", "height")]: "5px",
      [pseudoElementProperty("-webkit-scrollbar-corner", "display")]: "none",
      [pseudoElementProperty("-webkit-scrollbar-thumb", "background-color")]: "var(--color-fd-border)",
      [pseudoElementProperty("-webkit-scrollbar-thumb", "border-radius")]: "5px",
      [pseudoElementProperty("-webkit-scrollbar-track", "background-color")]: "transparent",
      position: 'absolute',
      insetInline: 0,
      top: 0,
      maxHeight: '80svh',
      overflow: 'auto',
      ...style,
    }}
  />
);
NavigationMenuContent.displayName = Primitive.Content.displayName;

const NavigationMenuLink = Primitive.Link;

const NavigationMenuViewport = ({
  className,
  style,
  ref,
  ...props
}: ComponentProps<typeof Primitive.Viewport>) => (
  <div
    ref={ref}
    style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    }}
  >
    <Primitive.Viewport
      {...props}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: 'var(--radix-navigation-menu-viewport-height)',
        overflow: 'hidden',
        transformOrigin: 'top center',
        transitionDuration: '300ms',
        transitionProperty: 'width, height',
        ...style,
      }}
    />
  </div>
);
NavigationMenuViewport.displayName = Primitive.Viewport.displayName;

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
};
