/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { pipe } from 'remeda';
import StylexAnimatedLogo from '@/components/StylexAnimatedLogo';
import CtaButton from '@/components/CtaButton';
import TypingWord from '@/components/TypingWord';
import Footer from '@/components/Footer';
import { on } from '@/css';

export default function Home() {
  return (
    <>
      <title>StyleX — styling system for ambitious interfaces</title>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 56px)',
          padding: 32,
          color: 'var(--color-fd-foreground)',
          backgroundColor: 'var(--color-fd-background)',
        }}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2vh',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '40vh',
          }}
        >
          <h1
            style={{
              position: 'relative',
              zIndex: 0,
              boxSizing: 'border-box',
              paddingBlock: '5px',
              paddingInline: 32,
              margin: 0,
              overflow: 'hidden',
            }}
          >
            <StylexAnimatedLogo
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                width: '100%',
              }}
            />
          </h1>
          <p
            aria-label="The expressive, type-safe, composable, predictable, and themeable styling system for ambitious interfaces"
            style={{
              paddingInline: 24,
              margin: 0,
              fontSize: 'clamp(1.2rem, 1.2rem + 1vw, 2rem)',
              fontWeight: 200,
              color: 'var(--color-fd-foreground)',
              textAlign: 'center',
            }}
          >
            <span aria-hidden="true">
              The <TypingWord />{' '}
              <br
                aria-hidden="true"
                style={pipe(
                  { display: 'none' },
                  on('@media (max-width: 460px)', { display: 'block' }),
                )}
              />
              styling system for{' '}
              <br
                aria-hidden="true"
                style={pipe(
                  { display: 'none' },
                  on('@media (max-width: 768px)', { display: 'block' }),
                )}
              />
              ambitious interfaces
            </span>
          </p>
          <div style={{ flexGrow: 1, maxHeight: 64 }} />
          <section
            style={pipe(
              {
                display: 'grid',
                flexDirection: 'row',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
              },
              on('@media (max-width: 460px)', {
                flexDirection: 'column',
                gridTemplateColumns: '1fr',
              }),
            )}
          >
            <CtaButton color="pink" to="/docs/learn/">
              Get Started
            </CtaButton>
            <CtaButton color="blue" to="/docs/learn/thinking-in-stylex/">
              Thinking in StyleX
            </CtaButton>
          </section>
          <div style={{ flexGrow: 1, maxHeight: 64 }} />
        </section>
      </main>
      <Footer />
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  };
};
