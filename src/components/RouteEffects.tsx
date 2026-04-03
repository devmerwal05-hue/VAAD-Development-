import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    // When rendered inside the admin preview iframe, notify the parent window
    // so the admin can sync its active section to the preview navigation.
    if (window.parent === window) return;

    try {
      window.parent.postMessage(
        {
          type: 'VAAD_PREVIEW_LOCATION',
          pathname: location.pathname,
          hash: location.hash,
        },
        window.location.origin,
      );
    } catch {
      // Ignore cross-origin / blocked frames.
    }
  }, [location.pathname, location.hash]);

  return null;
}
