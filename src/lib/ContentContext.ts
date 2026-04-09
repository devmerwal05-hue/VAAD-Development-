import { useContext } from 'react';
import { ContentContext, type ContentContextType, type ContentGetter } from './content-context';

export function useContent(): ContentContextType & { c: ContentGetter } {
  const ctx = useContext(ContentContext);
  return {
    ...ctx,
    c: ctx.getContentValue,
  };
}
