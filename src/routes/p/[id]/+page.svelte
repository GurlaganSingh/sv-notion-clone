<script lang="ts">
  import { page } from '$app/stores';
  import { pages, addBlock, deleteBlock, findPage, renamePage } from '$lib/stores/pages';
  import BlockEditor from '$lib/components/BlockEditor.svelte';

  let currentPage = $state(findPage($page.params.id));

  $effect(() => {
    // re-run on page param or store changes
    $pages;
    currentPage = findPage($page.params.id);
  });

  function onEnter(afterId: string) {
    if (!currentPage) return;
    const b = addBlock(currentPage.id, 'paragraph', afterId);
  }

  function onBackspaceAtStart(blockId: string) {
    if (!currentPage) return;
    deleteBlock(currentPage.id, blockId);
  }

  function onTitleInput(event: InputEvent) {
    if (!currentPage) return;
    const target = event.target as HTMLElement;
    renamePage(currentPage.id, target.innerText || 'Untitled');
  }
</script>

{#if !currentPage}
  <div class="text-neutral-400">Page not found</div>
{:else}
  <section class="max-w-3xl mx-auto space-y-6">
    <div
      class="text-3xl font-semibold tracking-tight outline-none focus:outline-none px-1"
      contenteditable
      spellcheck={false}
      on:input={onTitleInput}
    >{currentPage.title}</div>

    <div class="space-y-1">
      {#each currentPage.blocks as block (block.id)}
        <div>
          {#if block.type === 'bulleted'}
            <div class="flex gap-2">
              <div class="text-neutral-600 select-none">•</div>
              <div class="flex-1">
                <BlockEditor pageId={currentPage.id} {block} on:enter={(e) => onEnter(e.detail)} on:backspaceAtStart={(e) => onBackspaceAtStart(e.detail)} />
              </div>
            </div>
          {:else}
            <BlockEditor pageId={currentPage.id} {block} on:enter={(e) => onEnter(e.detail)} on:backspaceAtStart={(e) => onBackspaceAtStart(e.detail)} />
          {/if}
        </div>
      {/each}
    </div>
  </section>
{/if}
