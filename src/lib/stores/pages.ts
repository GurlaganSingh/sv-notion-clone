import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

export type BlockType = 'paragraph' | 'heading' | 'todo' | 'bulleted';

export type Block = {
  id: string;
  type: BlockType;
  text: string;
  checked?: boolean;
};

export type Page = {
  id: string;
  title: string;
  blocks: Block[];
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = 'notion-mini.pages.v1';

function generateId(): string {
  if (browser && 'randomUUID' in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

function now(): number {
  return Date.now();
}

function createInitialData(): Page[] {
  const firstPageId = generateId();
  return [
    {
      id: firstPageId,
      title: 'Getting started',
      createdAt: now(),
      updatedAt: now(),
      blocks: [
        { id: generateId(), type: 'heading', text: 'Welcome to your notes' },
        { id: generateId(), type: 'paragraph', text: 'This is a minimal Notion-like editor with blocks.' },
        { id: generateId(), type: 'bulleted', text: 'Create pages from the sidebar' },
        { id: generateId(), type: 'bulleted', text: 'Add and edit blocks inline' },
        { id: generateId(), type: 'todo', text: 'Try the checkbox block', checked: false }
      ]
    }
  ];
}

function loadFromStorage(): Page[] | null {
  if (!browser) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Page[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(pages: Page[]): void {
  if (!browser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch {
    // ignore
  }
}

export const pages = writable<Page[]>(loadFromStorage() ?? createInitialData());

pages.subscribe((value) => {
  saveToStorage(value);
});

export function getFirstPageId(): string | null {
  const list = get(pages);
  return list.length > 0 ? list[0].id : null;
}

export function findPage(id: string | undefined | null): Page | null {
  if (!id) return null;
  const list = get(pages);
  return list.find((p) => p.id === id) ?? null;
}

export function createPage(title = 'Untitled'): Page {
  const newPage: Page = {
    id: generateId(),
    title,
    blocks: [
      { id: generateId(), type: 'heading', text: title },
      { id: generateId(), type: 'paragraph', text: '' }
    ],
    createdAt: now(),
    updatedAt: now()
  };
  pages.update((list) => [newPage, ...list]);
  return newPage;
}

export function deletePage(id: string): void {
  pages.update((list) => list.filter((p) => p.id !== id));
}

export function renamePage(id: string, title: string): void {
  pages.update((list) =>
    list.map((p) => (p.id === id ? { ...p, title, updatedAt: now() } : p))
  );
}

export function addBlock(pageId: string, type: BlockType = 'paragraph', afterBlockId?: string): Block | null {
  const newBlock: Block = { id: generateId(), type, text: '' };
  pages.update((list) =>
    list.map((p) => {
      if (p.id !== pageId) return p;
      const blocks = [...p.blocks];
      if (afterBlockId) {
        const index = blocks.findIndex((b) => b.id === afterBlockId);
        const insertAt = index >= 0 ? index + 1 : blocks.length;
        blocks.splice(insertAt, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }
      return { ...p, blocks, updatedAt: now() };
    })
  );
  return newBlock;
}

export function updateBlock(pageId: string, blockId: string, updates: Partial<Block>): void {
  pages.update((list) =>
    list.map((p) => {
      if (p.id !== pageId) return p;
      const blocks = p.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b));
      return { ...p, blocks, updatedAt: now() };
    })
  );
}

export function deleteBlock(pageId: string, blockId: string): void {
  pages.update((list) =>
    list.map((p) => {
      if (p.id !== pageId) return p;
      const blocks = p.blocks.filter((b) => b.id !== blockId);
      return { ...p, blocks, updatedAt: now() };
    })
  );
}

export function moveBlock(pageId: string, blockId: string, direction: 'up' | 'down'): void {
  pages.update((list) =>
    list.map((p) => {
      if (p.id !== pageId) return p;
      const blocks = [...p.blocks];
      const index = blocks.findIndex((b) => b.id === blockId);
      if (index === -1) return p;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= blocks.length) return p;
      const [b] = blocks.splice(index, 1);
      blocks.splice(target, 0, b);
      return { ...p, blocks, updatedAt: now() };
    })
  );
}
