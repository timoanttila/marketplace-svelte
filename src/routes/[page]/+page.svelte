<script lang="ts">
  import { currentPage, host, siteName } from '$lib/store'
  import type { BreadcrumbItem, Page } from '$lib/types'
  export let data: Page

  $: canonical = ''
  $: ldjson = ''

  $: if (data.id) {
    canonical = `${host}${data.slug}`

    const breadcrumb: BreadcrumbItem[] = [
      {
        name: 'Ilmoitukset',
        item: host,
        position: 1,
      },
      {
        name: data.title,
        item: canonical,
        position: 2,
      },
    ]

    ldjson = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":${JSON.stringify(breadcrumb)}}${'<'}/script>`

    $currentPage = {
      canonical,
      description: data.description,
      image: `${host}images/ikea-kitchen-table-set-1366.webp`,
      ldjson,
      metaTitle: `${data.title} | ${siteName}`,
      title: data.title,
    }
  }
</script>

<div class="max-w-screen-lg mx-auto">
  <h1 class="mb-6 font-title uppercase">{data.title}</h1>
  <div class="font-content mb-10">{@html data.content ?? data.description}</div>

  {#if data.children}
    {#each data.children as faq}
      <details id={faq.slug} class="bg-white font-content border border-gray-400 border-solid mt-2">
        <summary class="p-4"><h2 class="leading-tight inline-block m-0 text-normal">{faq.title}</h2></summary>
        <div class="leading-normal p-4">{@html faq.content}</div>
      </details>
    {/each}
  {/if}
</div>
