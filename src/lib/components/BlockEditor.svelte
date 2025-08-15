<script lang="ts">
  import type { Block, BlockType } from '$lib/stores/pages';
  import { updateBlock, deleteBlock } from '$lib/stores/pages';
  import { createEventDispatcher } from 'svelte';
  import { CheckSquare, Circle, GripVertical, List, Type } from 'lucide-svelte';

  const dispatch = createEventDispatcher<{ enter: string; backspaceAtStart: string }>();

  let { pageId, block }: { pageId: string; block: Block } = $props();
  let isFocused = false;

  function onInput(event: InputEvent) {
    const target = event.target as HTMLElement;
    updateBlock(pageId, block.id, { text: target.innerText });
  }

  function onKeyDown(event: KeyboardEvent) {
    const selection = window.getSelection();
    const atStart = selection && selection.anchorOffset === 0;

    if (event.key === 'Enter') {
      event.preventDefault();
      dispatch('enter', block.id);
    } else if (event.key === 'Backspace' && atStart && block.text.length === 0) {
      event.preventDefault();
      dispatch('backspaceAtStart', block.id);
    }
  }

  function toggleTodo() {
    if (block.type !== 'todo') return;
    updateBlock(pageId, block.id, { checked: !block.checked });
  }

  function setType(type: BlockType) {
    if (type === block.type) return;
    updateBlock(pageId, block.id, { type });
  }
</script>

<div class="group relative flex items-start gap-2">
  <button class="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-neutral-600 hover:text-neutral-300 mt-1" title="Drag">
    <GripVertical size={16} />
  </button>

  {#if block.type === 'todo'}
    <button
      class="mt-1 size-5 rounded border border-neutral-700 bg-neutral-900 inline-flex items-center justify-center text-neutral-400 hover:text-neutral-200"
      on:click={toggleTodo}
      aria-label="Toggle todo"
    >
      {#if block.checked}
        <CheckSquare size={14} />
      {/if}
    </button>
  {/if}

  <div class="flex-1">
    <div
      class:font-semibold={block.type === 'heading'}
      class:text-2xl={block.type === 'heading'}
      class="min-h-6 outline-none focus:outline-none px-1 py-0.5 rounded cursor-text"
      contenteditable
      spellcheck={false}
      on:input={onInput}
      on:keydown={onKeyDown}
      on:focus={() => (isFocused = true)}
      on:blur={() => (isFocused = false)}
    >{block.text}</div>
  </div>

  <div class="opacity-0 group-hover:opacity-100 transition-opacity">
    <div class="inline-flex gap-1">
      <button class="p-1 rounded hover:bg-neutral-800 text-neutral-400" title="Text" on:click={() => setType('paragraph')}>
        <Type size={16} />
      </button>
      <button class="p-1 rounded hover:bg-neutral-800 text-neutral-400" title="Heading" on:click={() => setType('heading')}>
        <Circle size={16} />
      </button>
      <button class="p-1 rounded hover:bg-neutral-800 text-neutral-400" title="Bullet" on:click={() => setType('bulleted')}>
        <List size={16} />
      </button>
      <button class="p-1 rounded hover:bg-neutral-800 text-neutral-400" title="Todo" on:click={() => setType('todo')}>
        <CheckSquare size={16} />
      </button>
    </div>
  </div>
</div>

<style>
  [contenteditable]:empty::before {
    content: attr(placeholder);
    color: rgb(115,115,115);
  }
</style>
