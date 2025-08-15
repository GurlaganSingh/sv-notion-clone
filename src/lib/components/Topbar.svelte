<script lang="ts">
  import { ChevronDown, Clock } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { findPage } from '$lib/stores/pages';

  let title = $state('Untitled');

  $effect(() => {
    const isPage = $page.url.pathname.startsWith('/p/');
    title = isPage ? (findPage($page.params.id)?.title ?? 'Untitled') : 'Home';
  });
</script>

<div class="h-12 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur flex items-center gap-2 px-3">
  <button class="text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded px-2 py-1 text-sm inline-flex items-center gap-1">
    <span>{title}</span>
    <ChevronDown size={16} />
  </button>
  <div class="ml-auto text-neutral-500 inline-flex items-center gap-1 text-xs">
    <Clock size={14} />
    Edited just now
  </div>
</div>
