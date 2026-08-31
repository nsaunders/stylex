/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type { CSSProperties } from 'react';
import { LogoText, viewBox } from './Logo';
import { animationNames } from '@/css';

const ANIM_DURATION = '6s';
const STAGGER = '-2.5s';

export default function StylexAnimatedLogo({
  style,
}: {
  style: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <svg style={style} viewBox={viewBox}>
        <LogoText />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          aspectRatio: '1',
          borderRadius: '50%',
          transform:
            'rotate3d(0, 13.1, -4.5, -138deg) translate(-18%, 10%) scale(1.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 2,
            borderColor: 'var(--color-fd-card-foreground)',
            borderStyle: 'solid',
            borderTopColor: 'var(--color-fd-card-foreground)',
            borderTopWidth: 8,
            borderLeftColor: 'var(--color-fd-card-foreground)',
            borderLeftWidth: 8,
            borderRadius: '50%',
            maskImage: 'linear-gradient(145deg, white 30%, transparent 65%)',
            rotate: '-78deg',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            animationName: animationNames.logoRotate,
            animationDuration: ANIM_DURATION,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: STAGGER,
          }}
        >
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              width: 20,
              height: 20,
              borderColor: 'var(--color-fd-background)',
              borderStyle: 'solid',
              borderWidth: 2,
              borderRadius: '50%',
              animationDuration: ANIM_DURATION,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              right: 28,
              bottom: 28,
              backgroundImage:
                'radial-gradient(#E5F9FF 0%, #B2EEFE 21.605%, #5ED9FB 57.356%, #5DD1F1 77.207%, #55C4E3 100%)',
              animationName: animationNames.logoFadeSecondary,
              animationDelay: '-2.8s',
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          aspectRatio: '1',
          borderRadius: '50%',
          transform:
            'rotate3d(0, 14.8, -4.4, 130deg) translate(-7%, 1%) scale(1.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 2,
            borderColor: 'var(--color-fd-card-foreground)',
            borderStyle: 'solid',
            borderTopColor: 'var(--color-fd-card-foreground)',
            borderTopWidth: 8,
            borderLeftColor: 'var(--color-fd-card-foreground)',
            borderLeftWidth: 8,
            borderRadius: '50%',
            maskImage: 'linear-gradient(125deg, white 30%, transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            animationName: animationNames.logoRotate,
            animationDuration: ANIM_DURATION,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              width: 20,
              height: 20,
              borderColor: 'var(--color-fd-background)',
              borderStyle: 'solid',
              borderWidth: 2,
              borderRadius: '50%',
              animationDuration: ANIM_DURATION,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              bottom: 28,
              left: 28,
              backgroundImage:
                'radial-gradient(#FCD5FD 0%, #FD9EFF 19.619%, #F53BFA 51.352%, #E22FE6 82.291%, #CF28D4 100%)',
              animationName: animationNames.logoFade,
            }}
          />
        </div>
      </div>
    </div>
  );
}
