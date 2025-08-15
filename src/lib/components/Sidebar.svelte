<script lang="ts">
  import { FileText, Plus, Search, Settings } from 'lucide-svelte';
  import { pages, createPage, type Page } from '$lib/stores/pages';
  import { page } from '$app/stores';

  let query = $state('');
  let currentId = $state<string | null>(null);

  $effect(() => {
    currentId = $page.url.pathname.startsWith('/p/') ? $page.params.id : null;
  });

  function onCreate() {
    const p = createPage();
    // navigate by setting href, relying on link's default behavior
    window.location.href = `/p/${p.id}`;
  }

  function filtered(list: Page[]): Page[] {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((p) => p.title.toLowerCase().includes(q));
  }
</script>

<div class="h-full w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col">
  <div class="h-12 flex items-center px-3 text-neutral-300 text-sm border-b border-neutral-800">
    Workspace
  </div>

  <div class="p-3">
    <label class="relative block">
      <span class="absolute left-2 top-1.5 text-neutral-500">
        <Search size={16} />
      </span>
      <input
        class="w-full bg-neutral-800 border border-neutral-700 rounded px-7 py-1.5 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600"
        placeholder="Search"
        type="search"
        bind:value={query}
      />
    </label>
  </div>

  <nav class="px-2 space-y-1 overflow-auto scrollbar-thin scrollbar-dark">
    {#each filtered($pages) as page (page.id)}
      <a
        class="flex items-center gap-2 px-2 py-1.5 rounded text-neutral-300 hover:bg-neutral-800 {currentId === page.id ? 'bg-neutral-800/70' : ''}"
        href={`/p/${page.id}`}
      >
        <FileText size={16} class="text-neutral-400" />
        <span class="text-sm">{page.title}</span>
      </a>
    {/each}
  </nav>

  <div class="mt-auto p-2 border-t border-neutral-800 flex items-center gap-2">
    <button class="flex-1 inline-flex items-center justify-center gap-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded px-3 py-1.5" on:click={onCreate}>
      <Plus size={16} /> New page
    </button>
    <button class="p-2 rounded hover:bg-neutral-800 text-neutral-400" aria-label="Settings">
      <Settings size={18} />
    </button>
  </div>
</div>
