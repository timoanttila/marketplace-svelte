<script lang="ts">
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { categories, currentPage, lang, runQuery, translations, user, width } from '$lib/store'
  import Header from '$lib/Header.svelte'
  import translationContent from '$lib/translations.json'
  import type { CategoryResults, TranslationData } from '$lib/types'
  import '$lib/app.css'

  onMount(async () => {
    $translations = (translationContent as any)[$lang] as TranslationData

    runQuery('categories').then((results: CategoryResults) => {
      $categories = results
    })
  })

  if (browser) {
    user.useLocalStorage()
  }
</script>

<svelte:window bind:innerWidth={$width} />

<svelte:head>
  {#if $currentPage?.title}
    <title>{$currentPage.metaTitle ?? $currentPage.title}</title>
    <meta name="twitter:title" property="og:title" content={$currentPage.title} />
    <meta name="twitter:description" property="og:description" content={$currentPage.description} />
    <meta name="canonical" property="og:url" content={$currentPage.canonical} />
    <meta name="twitter:image" property="og:image" content={$currentPage.image} />
    {#if $currentPage.description}
      <meta name="description" content={$currentPage.description} />
    {/if}
    {#if $currentPage.created}
      <meta content={$currentPage.created} name="pubdate" property="og:pubdate" />
      <meta content={$currentPage.created} property="article:published_time" />
      <meta content={$currentPage.updated} name="revised" property="article:modified_time" />
    {/if}
    {#if $currentPage?.ldjson}
      {@html $currentPage.ldjson}
    {/if}
    {#if $currentPage?.noindex}
      <meta name="robots" content="noindex,nofollow" />
    {/if}
  {/if}
  <link rel="sitemap" type="application/xml" title="Sitemap" href="https://api.aeki.fi/sitemap" />
</svelte:head>

<div id="wrap" class="flex flex-col min-h-screen">
  <Header />
  <main id="content" class="grow">
    {#if $translations && $categories}
      <slot />
    {/if}
  </main>

  <footer class="font-content bg-gray-800 block py-2 text-center text-white">
    <small class="text-sm">Created by <a class="text-white" href="https://timoanttila.com/">Timo Anttila</a>, <a class="text-white" href="https://tuspe.com/">Tuspe Design Oy</a></small><br />
  </footer>
</div>
