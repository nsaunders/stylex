/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  Fragment,
  type ReactNode,
  useEffectEvent,
} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import scrollIntoView from 'scroll-into-view-if-needed';
import { ChevronRight, Hash, Search } from 'lucide-react';
import { useRouter } from 'waku';
import { liteClient, type SearchForHitsOptions } from 'algoliasearch/lite';
import type {
  HighlightedText,
  ReactSortedResult,
  SortedResult,
} from 'fumadocs-core/search';
import { I18nLabel, useI18n } from 'fumadocs-ui/contexts/i18n';
import type {
  SearchLink,
  SharedProps,
  TagItem,
} from 'fumadocs-ui/contexts/search';
import { animationNames, on, or } from '@/css';
import { pipe } from 'remeda';

type SearchItem =
  | (ReactSortedResult & { external?: boolean })
  | {
      id: string;
      type: 'action';
      node: ReactNode;
      onSelect: () => void;
    };

// eslint-disable-next-line no-useless-concat
const appId = '94L' + 'A' + 'F81A4P';
// Public API key it is safe to commit it
const apiKey = 'd7b1348f1d8a68c1c5a868c54536759c';
const indexName = 'stylexjs';
const client = liteClient(appId, apiKey);

// DocSearch hit structure from Algolia
type DocSearchHit = {
  objectID: string;
  url: string;
  url_without_anchor?: string;
  anchor?: string;
  content: string | null;
  type:
    | 'lvl0'
    | 'lvl1'
    | 'lvl2'
    | 'lvl3'
    | 'lvl4'
    | 'lvl5'
    | 'lvl6'
    | 'content';
  hierarchy: {
    lvl0: string | null;
    lvl1: string | null;
    lvl2: string | null;
    lvl3: string | null;
    lvl4: string | null;
    lvl5: string | null;
    lvl6: string | null;
  };
};

// Convert absolute URLs to relative paths and normalize
function toRelativeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Normalize: remove trailing slash from pathname (but keep root /)
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    return pathname + parsed.hash;
  } catch {
    // If it's already a relative URL, normalize it
    let path = url;
    // Split path and hash
    const hashIndex = path.indexOf('#');
    let hash = '';
    if (hashIndex !== -1) {
      hash = path.slice(hashIndex);
      path = path.slice(0, hashIndex);
    }
    // Remove trailing slash
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path + hash;
  }
}

// Transform DocSearch results to fumadocs format
function transformDocSearchResults(hits: DocSearchHit[]): SortedResult[] {
  const results: SortedResult[] = [];
  // Track seen URLs to prevent duplicates (normalized full URL with anchor)
  const seenUrls = new Set<string>();
  // Track seen page URLs (without anchor) for page-level deduplication
  const seenPageUrls = new Set<string>();

  for (const hit of hits) {
    const fullUrl = toRelativeUrl(hit.url);
    const baseUrl = toRelativeUrl(hit.url_without_anchor || hit.url);

    // Skip the blog index page (but not individual blog posts)
    if (baseUrl.includes('/blog')) {
      continue;
    }

    // Skip if we've already seen this exact URL
    if (seenUrls.has(fullUrl)) {
      continue;
    }

    // Build breadcrumbs from hierarchy (all non-null levels)
    const breadcrumbs = [
      hit.hierarchy.lvl0,
      hit.hierarchy.lvl1,
      hit.hierarchy.lvl2,
      hit.hierarchy.lvl3,
      hit.hierarchy.lvl4,
      hit.hierarchy.lvl5,
      hit.hierarchy.lvl6,
    ].filter((level): level is string => level != null);

    // Get the page title (usually lvl1, fallback to lvl0)
    const pageTitle = hit.hierarchy.lvl1 || hit.hierarchy.lvl0 || 'Untitled';

    // If this is a page-level hit (lvl0 or lvl1) and we haven't seen this page yet
    if (
      (hit.type === 'lvl0' || hit.type === 'lvl1') &&
      !seenPageUrls.has(baseUrl)
    ) {
      seenPageUrls.add(baseUrl);
      seenUrls.add(fullUrl);
      results.push({
        type: 'page',
        id: hit.objectID,
        url: baseUrl,
        content: pageTitle,
        // For pages, breadcrumbs are just lvl0 (the section/category)
        breadcrumbs: hit.hierarchy.lvl0 ? [hit.hierarchy.lvl0] : [],
      });
    } else if (hit.type === 'content' && hit.content) {
      // Content-level hit - show with page context
      seenUrls.add(fullUrl);
      results.push({
        type: 'text',
        id: hit.objectID,
        url: fullUrl,
        content: hit.content,
        // Include full breadcrumb trail for context
        breadcrumbs,
      });
    } else if (
      hit.type.startsWith('lvl') &&
      hit.type !== 'lvl0' &&
      hit.type !== 'lvl1'
    ) {
      // Heading-level hit (lvl2, lvl3, lvl4, etc.)
      seenUrls.add(fullUrl);
      const headingText =
        hit.hierarchy[hit.type as keyof typeof hit.hierarchy] ?? pageTitle;
      results.push({
        type: 'heading',
        id: hit.objectID,
        url: fullUrl,
        content: headingText,
        // Include breadcrumbs up to (but not including) the current heading level
        breadcrumbs: breadcrumbs.slice(0, -1),
      });
    }
  }

  return results;
}

// Custom search function for DocSearch-formatted Algolia index
async function searchAlgoliaDocSearch(
  query: string,
): Promise<SortedResult[] | 'empty'> {
  if (query.trim().length === 0) {
    return 'empty';
  }

  const result = await client.searchForHits({
    requests: [
      {
        indexName,
        query,
        distinct: 5,
        hitsPerPage: 20,
      } as SearchForHitsOptions,
    ],
  });

  const hits = result.results[0]?.hits as unknown as DocSearchHit[];
  if (!hits || hits.length === 0) {
    return [];
  }

  return transformDocSearchResults(hits);
}

export type SearchDialogProps = SharedProps & {
  links?: SearchLink[];
  type?: 'fetch' | 'static';
  defaultTag?: string;
  tags?: TagItem[];
  api?: string;
  delayMs?: number;
  footer?: ReactNode;
  allowClear?: boolean;
};

export function SearchDialog({
  open,
  onOpenChange,
  // type = 'fetch',
  defaultTag,
  tags = [],
  // api = '/api/search',
  // delayMs,
  allowClear = false,
  links = [],
  footer,
}: SearchDialogProps) {
  const { text } = useI18n();
  const router = useRouter();
  const [tag, setTag] = useState(defaultTag);

  // Custom search state management for DocSearch-formatted Algolia index
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState<{
    isLoading: boolean;
    data?: SortedResult[] | 'empty';
    error?: Error;
  }>({ isLoading: false, data: 'empty' });

  // Debounced search effect
  useEffect(() => {
    if (search.trim().length === 0) {
      setQuery({ isLoading: false, data: 'empty' });
      return;
    }

    setQuery((prev) => ({ ...prev, isLoading: true }));

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchAlgoliaDocSearch(search);
        setQuery({ isLoading: false, data: results });
      } catch (error) {
        setQuery({ isLoading: false, error: error as Error });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    setTag(defaultTag);
  }, [defaultTag]);

  const defaultItems = useMemo<SearchItem[] | null>(() => {
    if (links.length === 0) {
      return null;
    }
    return links.map(([name, href]) => ({
      type: 'page',
      id: name,
      content: name,
      url: href,
    }));
  }, [links]);

  const items = useMemo(() => {
    if (query.data === 'empty') {
      return defaultItems;
    }
    if (!query.data) {
      return null;
    }
    return query.data as SearchItem[];
  }, [defaultItems, query.data]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const itemsRef = useRef<SearchItem[] | null>(null);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const listViewportRef = useRef<HTMLDivElement | null>(null);

  const onOpenItem = useCallback(
    (item: SearchItem) => {
      if (item.type === 'action') {
        item.onSelect();
        onOpenChange(false);
        return;
      }
      if (item.external) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
        onOpenChange(false);
        return;
      }
      const [pathname, hash] = item.url.split('#');
      const url = [pathname?.replaceAll('%20', '-'), hash].join('#');

      router.push(url);
      onOpenChange(false);
    },
    [onOpenChange, router],
  );

  useEffect(() => {
    itemsRef.current = items;
    if (items && items.length > 0) {
      setActiveId(items[0]?.id ?? null);
    } else {
      setActiveId(null);
    }
  }, [items]);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    const currentItems = itemsRef.current;
    if (!currentItems || currentItems.length === 0 || e.isComposing) {
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      let index = currentItems.findIndex((item) => item.id === activeId);
      if (index === -1) {
        index = 0;
      }
      index =
        e.key === 'ArrowDown'
          ? (index + 1) % currentItems.length
          : (index - 1 + currentItems.length) % currentItems.length;
      setActiveId(currentItems[index]?.id ?? null);
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      const selected = currentItems.find((item) => item.id === activeId);
      if (selected) {
        onOpenItem(selected);
        e.preventDefault();
      }
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onKeyDown]);

  useEffect(() => {
    const container = listContainerRef.current;
    const viewport = listViewportRef.current;
    if (!container || !viewport) {
      return;
    }
    const updateHeight = () => {
      container.style.setProperty(
        '--fd-animated-height',
        `${viewport.clientHeight}px`,
      );
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!listViewportRef.current || !activeId) {
      return;
    }
    const element = listViewportRef.current.querySelector<HTMLElement>(
      `[data-search-item="${activeId}"]`,
    );
    if (element) {
      scrollIntoView(element, {
        scrollMode: 'if-needed',
        block: 'nearest',
        boundary: listViewportRef.current,
      });
    }
  }, [activeId]);

  const showFooter = tags.length > 0 || footer != null;
  const activeClassName = 'a';
  const activeCondition = `&.${activeClassName}` satisfies Parameters<
    typeof on
  >[0];
  const strongClassName = 'b';
  const strong = `&.${strongClassName}` satisfies Parameters<typeof on>[0];
  const mutedClassName = 'c';
  const muted = `&.${mutedClassName}` satisfies Parameters<typeof on>[0];

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'var(--color-fd-overlay)',
            backdropFilter: 'blur(4px)',
          }}
        />
        <Dialog.Content
          style={pipe(
            {
              position: 'fixed',
              top: 16,
              left: '50%',
              zIndex: 51,
              width: 'calc(100% - 16px)',
              maxWidth: 640,
              overflow: 'hidden',
              color: 'var(--color-fd-popover-foreground)',
              backgroundColor:
                'color-mix(in oklab, var(--color-fd-popover) 35%, transparent)',
              borderColor: 'var(--color-fd-border)',
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: 12,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              transform: 'translateX(-50%)',
              animationDuration: '300ms',
              animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
            on('&:where([data-state=closed])', {
              animationName: animationNames.searchDialogOut,
            }),
            on('&:where([data-state=open])', {
              animationName: animationNames.searchDialogIn,
            }),
            on('@media (min-width: 768px)', { top: 'calc(50% - 250px)' }),
          )}
        >
          <div style={{ position: 'absolute', inset: 0, overflow: 'clip' }}>
            <div
              style={{
                position: 'absolute',
                inset: -64,
                backdropFilter: 'blur(48px) saturate(400%)',
              }}
            />
          </div>
          <Dialog.Title
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              borderWidth: 0,
              clip: 'rect(0, 0, 0, 0)',
            }}
          >
            {text.search}
          </Dialog.Title>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              padding: 12,
              borderBottomColor: 'var(--color-fd-border)',
              borderBottomStyle: 'solid',
              borderBottomWidth: 1,
            }}
          >
            <Search
              className={query.isLoading ? activeClassName : undefined}
              style={pipe(
                {
                  width: 20,
                  height: 20,
                  color: 'var(--color-fd-muted-foreground)',
                },
                on(activeCondition, {
                  animationName: animationNames.searchPulse,
                  animationDuration: '2s',
                  animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
                  animationIterationCount: 'infinite',
                }),
              )}
            />
            <input
              autoFocus
              onChange={(event) => setSearch(event.target.value)}
              placeholder={text.search}
              style={pipe(
                {
                  flexGrow: 1,
                  minWidth: 0,
                  fontSize: `${18 / 16}rem`,
                  color: 'var(--color-fd-popover-foreground)',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                },
                on('&::placeholder', {
                  color: 'var(--color-fd-muted-foreground)',
                }),
              )}
              value={search}
            />
            <button
              onClick={() => onOpenChange(false)}
              style={pipe(
                {
                  paddingBlock: 2,
                  paddingInline: 6,
                  fontFamily: 'var(--font-mono)',
                  fontSize: `${12 / 16}rem`,
                  color: 'var(--color-fd-muted-foreground)',
                  outline: 'none',
                  backgroundColor: 'var(--color-fd-background)',
                  borderColor: 'var(--color-fd-border)',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderRadius: 6,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDuration: '150ms',
                  transitionProperty: 'color, background-color, border-color',
                },
                on(or('&:focus-visible', '&:hover'), {
                  borderColor: 'var(--color-fd-primary)',
                }),
                on('&:hover', {
                  color: 'var(--color-fd-accent-foreground)',
                  backgroundColor:
                    'color-mix(in oklab, var(--color-fd-accent) 80%, transparent)',
                }),
              )}
              type="button"
            >
              ESC
            </button>
          </div>
          <div
            data-empty={items == null}
            ref={listContainerRef}
            style={{
              position: 'relative',
              '--fd-animated-height': '0px',
              height: 'var(--fd-animated-height)',
              overflow: 'hidden',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDuration: '150ms',
              transitionProperty: 'height',
            }}
          >
            <div
              className={items == null ? activeClassName : undefined}
              ref={listViewportRef}
              style={pipe(
                {
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 460,
                  padding: 4,
                  overflowY: 'auto',
                },
                on(activeCondition, { display: 'none' }),
              )}
            >
              {items && items.length === 0 && (
                <div
                  style={{
                    paddingBlock: 48,
                    fontSize: `${14 / 16}rem`,
                    color: 'var(--color-fd-muted-foreground)',
                    textAlign: 'center',
                  }}
                >
                  <I18nLabel label="searchNoResult" />
                </div>
              )}
              {items?.map((item) => {
                const active = item.id === activeId;
                if (item.type === 'action') {
                  return (
                    <button
                      aria-selected={active}
                      className={active ? activeClassName : undefined}
                      data-search-item={item.id}
                      key={item.id}
                      onClick={() => onOpenItem(item)}
                      onPointerMove={() => setActiveId(item.id)}
                      style={pipe(
                        {
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          alignItems: 'flex-start',
                          width: '100%',
                          paddingBlock: 8,
                          paddingInline: 10,
                          fontSize: `${14 / 16}rem`,
                          color: 'var(--color-fd-popover-foreground)',
                          textAlign: 'start',
                          backgroundColor: 'transparent',
                          borderRadius: 8,
                          transitionTimingFunction:
                            'cubic-bezier(0.4, 0, 0.2, 1)',
                          transitionDuration: '150ms',
                          transitionProperty: 'background-color, color',
                        },
                        on('&:hover', {
                          backgroundColor:
                            'color-mix(in oklab, var(--color-fd-accent) 45%, transparent)',
                        }),
                        on(activeCondition, {
                          color: 'var(--color-fd-accent-foreground)',
                          backgroundColor:
                            'color-mix(in oklab, var(--color-fd-accent) 45%, transparent)',
                        }),
                      )}
                      type="button"
                    >
                      {item.node}
                    </button>
                  );
                }

                const content = item.contentWithHighlights
                  ? renderHighlights(item.contentWithHighlights)
                  : item.content;

                return (
                  <button
                    aria-selected={active}
                    className={active ? activeClassName : undefined}
                    data-search-item={item.id}
                    key={item.id}
                    onClick={() => onOpenItem(item)}
                    onPointerMove={() => setActiveId(item.id)}
                    style={pipe(
                      {
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'flex-start',
                        width: '100%',
                        paddingBlock: 8,
                        paddingInline: 10,
                        fontSize: `${14 / 16}rem`,
                        color: 'var(--color-fd-popover-foreground)',
                        textAlign: 'start',
                        backgroundColor: 'transparent',
                        borderRadius: 8,
                        transitionTimingFunction:
                          'cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDuration: '150ms',
                        transitionProperty: 'background-color, color',
                      },
                      on('&:hover', {
                        backgroundColor:
                          'color-mix(in oklab, var(--color-fd-accent) 45%, transparent)',
                      }),
                      on(activeCondition, {
                        color: 'var(--color-fd-accent-foreground)',
                        backgroundColor:
                          'color-mix(in oklab, var(--color-fd-accent) 45%, transparent)',
                      }),
                    )}
                    type="button"
                  >
                    {item.breadcrumbs?.length ? (
                      <div
                        style={{
                          display: 'inline-flex',
                          gap: 4,
                          alignItems: 'center',
                          fontSize: `${10 / 16}rem`,
                          color: 'var(--color-fd-muted-foreground)',
                        }}
                      >
                        {item.breadcrumbs.map((crumb, index) => (
                          <Fragment key={index}>
                            {index > 0 && (
                              <ChevronRight
                                style={{
                                  width: 16,
                                  height: 16,
                                  color: 'var(--color-fd-muted-foreground)',
                                }}
                              />
                            )}
                            {crumb}
                          </Fragment>
                        ))}
                      </div>
                    ) : null}
                    <p
                      className={
                        item.type === 'page' || item.type === 'heading'
                          ? strongClassName
                          : mutedClassName
                      }
                      style={pipe(
                        {
                          display: 'block',
                          width: '100%',
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: 'var(--color-fd-foreground)',
                          whiteSpace: 'nowrap',
                        },
                        on(strong, { fontWeight: 500 }),
                        on(muted, {
                          color:
                            'color-mix(in oklab, var(--color-fd-popover-foreground) 80%, transparent)',
                        }),
                      )}
                    >
                      {item.type === 'heading' && (
                        <Hash
                          style={{
                            width: 16,
                            height: 16,
                            marginInlineEnd: 4,
                            color: 'var(--color-fd-muted-foreground)',
                          }}
                        />
                      )}
                      {content}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
          {showFooter && (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: 12,
                backgroundColor:
                  'color-mix(in oklab, var(--color-fd-secondary) 50%, transparent)',
              }}
            >
              {tags.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    alignItems: 'center',
                  }}
                >
                  {tags.map((tagItem) => {
                    const isActive = tagItem.value === tag;
                    return (
                      <button
                        className={isActive ? activeClassName : undefined}
                        key={tagItem.value}
                        onClick={() =>
                          setTag(
                            isActive && allowClear ? undefined : tagItem.value,
                          )
                        }
                        style={pipe(
                          {
                            paddingBlock: 2,
                            paddingInline: 8,
                            fontSize: `${12 / 16}rem`,
                            fontWeight: 500,
                            color: 'var(--color-fd-muted-foreground)',
                            backgroundColor: 'transparent',
                            borderColor: 'var(--color-fd-border)',
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderRadius: 6,
                            transitionTimingFunction:
                              'cubic-bezier(0.4, 0, 0.2, 1)',
                            transitionDuration: '150ms',
                            transitionProperty:
                              'color, background-color, border-color',
                          },
                          on('&:hover', {
                            backgroundColor: 'var(--color-fd-accent)',
                          }),
                          on(activeCondition, {
                            color: 'var(--color-fd-accent-foreground)',
                            backgroundColor: 'var(--color-fd-accent)',
                          }),
                        )}
                        type="button"
                      >
                        {tagItem.name}
                      </button>
                    );
                  })}
                </div>
              )}
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function renderHighlights(highlights: HighlightedText<ReactNode>[]) {
  return highlights.map((node, index) => {
    if (node.styles?.highlight) {
      return (
        <span
          key={index}
          style={{
            color: 'var(--color-fd-primary)',
            textDecorationLine: 'underline',
          }}
        >
          {node.content}
        </span>
      );
    }
    return <Fragment key={index}>{node.content}</Fragment>;
  });
}
