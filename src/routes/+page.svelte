<script lang="ts">
  import { onMount } from 'svelte'
  import { categories, currentPage, defaultImage, host, runQuery, searchFilters, siteName, translations } from '$lib/store'
  import Products from '$lib/Products.svelte'
  import type { Page, Product, ProductResult, ResultInfo } from '$lib/types'

  export let data: Page

  $currentPage = {
    canonical: host,
    description: data.description,
    image: defaultImage,
    ldjson: `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{name:'Home',item:'${host}',position:1}]}${'<'}/script>`,
    metaTitle: `${siteName} | Käytetyt IKEA-tuotteet`,
    title: siteName,
  }

  const pageSize = 20
  let loading = false
  let page = 1
  let searchFiltersOpen = false
  let state: 'new' | 'old' | 'premium' = 'new'

  const orderOptions = [
    { label: 'Nouseva', value: 'asc' },
    { label: 'Laskeva', value: 'desc' },
  ]
  const sortOptions = [
    { label: 'Julkaistu', value: 'created' },
    { label: 'Päivitetty', value: 'modified' },
    { label: 'Hinta', value: 'shop_price' },
    { label: 'Otsikko', value: 'title' },
  ]

  const priceOptions = [50, 100, 200, 400, 600, 800, 1000, 1250, 1500]

  let products: Product[] = []
  let productMeta: ResultInfo = {}

  const fetchProducts = async () => {
    loading = true
    let search = ''

    if ($searchFilters?.category) {
      search += `&categoryId=${$searchFilters.category}`
    }

    if ($searchFilters?.price) {
      search += `&price=${$searchFilters.price}`
    }

    if ($searchFilters?.search) {
      search += `&search=${$searchFilters.search.toLowerCase().replace(/[^a-z 0-9-]/gi, '')}`
    }

    if ($searchFilters?.type) {
      search += `&typeId=${$searchFilters.type}`
    }

    const results = (await runQuery(`products?pageNumber=${page}&pageSize=${pageSize}&order=${$searchFilters.order}&sort=${$searchFilters.sort}${search}`)) as ProductResult

    productMeta = results.query

    if (page === 1) {
      products = results.data
    } else {
      products = products.concat(results.data)
    }

    loading = false
  }

  const fetchMoreProducts = async () => {
    page++
    await fetchProducts()
  }

  const changeState = (value: 'new' | 'old' | 'premium' = 'new') => {
    if (state === value && !searchFiltersOpen) {
      return
    }

    state = value
    page = 1

    searchFiltersOpen = false

    $searchFilters = {
      ...$searchFilters,
      category: '',
      price: 0,
      search: '',
      type: '',
    }

    if (value === 'new') {
      $searchFilters.sort = 'created'
      $searchFilters.order = 'desc'
    } else {
      $searchFilters.sort = 'modified'
      $searchFilters.order = 'asc'
    }

    fetchProducts()
  }

  onMount(() => {
    fetchProducts()
  })
</script>

<div id="hero" class="relative">
  <img class="block h-full object-cover w-full" src="/images/ikea-kitchen-table-set-1366.webp" srcset="/images/ikea-kitchen-table-set-414.webp 414w, /images/ikea-kitchen-table-set-768.webp 768w, /images/ikea-kitchen-table-set-1366.webp 1366w, /images/ikea-kitchen-table-set-2000.webp 2000w" sizes="(max-width:414px) 414px, (max-width:768px) 768px, (max-width:1366px) 1366px, 2000px" alt="IKEA dining table set" loading="lazy" decoding="async" />

  <div id="captionGradient" class="absolute h-full left-0 top-0 w-full">
    <div id="caption" class="absolute bottom-10 left-0 w-full">
      <div class="font-content leading-tight max-w-screen-md mx-auto px-6 text-center">
        <h1 class="mb-4 mt-0 px-6 text-6xl text-white">{siteName}</h1>
        <div class="font-bold text-2xl text-gray-100">{@html data.content}</div>

        <div id="frontActionButtons" class="mt-10">
          <button on:click={() => changeState('new')} class="btn border border-solid border-gray-300" class:btn-primary={state === 'new' && !searchFiltersOpen}>Uusimmat</button>
          <button on:click={() => changeState('old')} class="btn border border-solid border-gray-300" class:btn-primary={state === 'old' && !searchFiltersOpen}>Vielä kerkeät</button>
          <button on:click={() => (searchFiltersOpen = !searchFiltersOpen)} class="btn border border-solid border-gray-300" class:btn-primary={searchFiltersOpen}>Haun valinnat</button>
        </div>
      </div>
    </div>
  </div>
</div>

{#if $translations}
  {#if $categories && $searchFilters}
    <div class="gap-2 xs:gap-4 xs:grid-cols-2 md:grid-cols-4 mb-10 max-w-screen-md mx-auto px-4" class:grid={searchFiltersOpen} class:hidden={!searchFiltersOpen}>
      <label class="font-content form-control">
        <span class="label">{$translations['LABEL_SORT']}</span>
        <select bind:value={$searchFilters.sort} class="bg-white select select-primary">
          {#each sortOptions as item (item.value)}
            <option value={item.value}>{item.label}</option>
          {/each}
        </select>
      </label>

      <label class="font-content form-control">
        <span class="label">{$translations['LABEL_ORDER']}</span>
        <select bind:value={$searchFilters.order} class="bg-white select select-primary">
          {#each orderOptions as item (item.value)}
            <option value={item.value}>{item.label}</option>
          {/each}
        </select>
      </label>

      <label class="font-content form-control">
        <span class="label">{$translations['LABEL_TYPE']}</span>
        <select bind:value={$searchFilters.type} class="bg-white select select-primary">
          <option value="">{$translations['LABEL_ALL']}</option>
          {#each $categories.types as type (type.id)}
            <option value={type.id}>{type.title}</option>
          {/each}
        </select>
      </label>

      <label class="font-content form-control">
        <span class="label">{$translations['LABEL_CATEGORY']}</span>
        <select bind:value={$searchFilters.category} class="bg-white select select-primary">
          <option value="">{$translations['LABEL_ALL']}</option>
          {#each $categories.rooms as room (room.id)}
            <option value={room.id}>{room.title}</option>
          {/each}
        </select>
      </label>

      <label class="font-content form-control">
        <span class="label">{$translations['LABEL_PRICE']}</span>
        <select bind:value={$searchFilters.price} class="bg-white select select-primary">
          <option value={0}>{$translations['LABEL_ALL']}</option>
          {#each priceOptions as item}
            <option value={item}>{item}</option>
          {/each}
        </select>
      </label>

      <label class="font-content xs:col-span-2 form-control">
        <span class="label">{$translations['LABEL_KEYWORD']}</span>
        <input bind:value={$searchFilters.search} class="bg-white input input-primary" maxlength="50" minlength="3" placeholder="Kirjoita hakusana, postinumero ja kaupunki" type="search" />
      </label>

      <div class="flex items-end mt-6 md:mt-0">
        <button on:click={() => fetchProducts()} class="btn btn-primary w-full">Rajaa</button>
      </div>
    </div>
  {/if}
{/if}

<div class="my-10">
  {#if Array.isArray(products) && products.length > 0}
    <h2 class="font-title my-6 text-3xl text-center uppercase" aria-live="polite">{products.length} / {productMeta.total} ilmoitusta</h2>
    <Products {products} {loading} />

    {#if !loading && productMeta.isNext}
      <div class="mt-10 text-center">
        <button on:click={() => fetchMoreProducts()} class="btn btn-primary">Lisää ilmoituksia</button>
      </div>
    {/if}
  {:else}
    <p class="text-center">Ei tuotteita / ilmoituksia.</p>
  {/if}
</div>
