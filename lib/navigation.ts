import type { MouseEvent } from 'react';

/** Leave browser shortcuts (new tab/window) to the anchor's real href. */
export const isPlainNavigationClick = (event: MouseEvent<HTMLAnchorElement>): boolean =>
  !event.defaultPrevented && event.button === 0
  && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
