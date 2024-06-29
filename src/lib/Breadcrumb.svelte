<script lang="ts">
  import type { BreadcrumbItem } from '$lib/types'

  export let breadcrumb: BreadcrumbItem[]
  $: ldjson = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":${JSON.stringify(breadcrumb)}}${'<'}/script>`
</script>

<svelte:head>
  {@html ldjson}
</svelte:head>

{#if Array.isArray(breadcrumb)}
  <ol id="breadcrumb" class="p-0" vocab="https://schema.org/" typeof="BreadcrumbList">
    {#each breadcrumb as page (page.item)}
      <li property="itemListElement" typeof="ListItem">
        <a href={page.item} property="item" typeof="WebPage">
          <span property="name">{page.name}</span>
        </a>
        <meta property="position" content={String(page.position)} />
      </li>
    {/each}
  </ol>
{/if}
