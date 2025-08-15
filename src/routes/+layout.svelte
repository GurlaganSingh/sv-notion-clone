<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    import '../app.css';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import Topbar from '$lib/components/Topbar.svelte';

    let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen grid grid-cols-[288px_1fr] grid-rows-[48px_1fr]">
    <aside class="row-span-2 hidden md:block"><Sidebar /></aside>
    <header class="col-start-2"><Topbar /></header>
    <main class="col-start-2 p-6">
        {@render children?.()}
    </main>
</div>
