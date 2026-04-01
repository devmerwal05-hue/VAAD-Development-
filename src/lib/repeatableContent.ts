import type { ContentItem } from './content-context';

export interface IndexedContentGroup {
  fields: Record<string, ContentItem>;
  index: number;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getIndexedContentGroups(content: ContentItem[], section: string, prefix: string) {
  const matcher = new RegExp(`^${escapeRegExp(prefix)}_(\\d+)_(.+)$`);
  const groups = new Map<number, Record<string, ContentItem>>();

  for (const item of content) {
    if (item.section !== section) continue;

    const match = item.key.match(matcher);
    if (!match) continue;

    const index = Number.parseInt(match[1], 10);
    const fieldKey = match[2];
    const existingGroup = groups.get(index) || {};
    existingGroup[fieldKey] = item;
    groups.set(index, existingGroup);
  }

  return [...groups.entries()]
    .map(([index, fields]) => ({ index, fields }))
    .sort((left, right) => left.index - right.index);
}

export function getIndexedContentCount(content: ContentItem[], section: string, prefix: string, primaryField = 'name') {
  const groups = getIndexedContentGroups(content, section, prefix);
  return groups.reduce((count, group) => (group.fields[primaryField] ? Math.max(count, group.index) : count), 0);
}

