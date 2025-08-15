<script lang="ts">
  import { createPage, getFirstPageId } from '$lib/stores/pages';

  function goToFirst() {
    const first = getFirstPageId();
    if (first) {
      window.location.href = `/p/${first}`;
    } else {
      const p = createPage();
      window.location.href = `/p/${p.id}`;
    }
  }

  function createAndOpen() {
    const p = createPage();
    window.location.href = `/p/${p.id}`;
  }
</script>

<section class="max-w-3xl mx-auto space-y-6">
  <h1 class="text-3xl font-semibold tracking-tight">Welcome</h1>
  <p class="text-neutral-300">Minimal Notion-like notes. Your data stays in your browser.</p>
  <div class="flex gap-3">
    <button class="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 rounded px-4 py-2" on:click={goToFirst}>Open first page</button>
    <button class="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 rounded px-4 py-2" on:click={createAndOpen}>New page</button>
  </div>
</section>
