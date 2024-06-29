<script lang="ts">
  import dayjs from 'dayjs'
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import { onMount } from 'svelte'
  import { runQuery, translations, user } from '$lib/store'
  import UserMenu from '$lib/UserMenu.svelte'
  import type { Product, ProductResult } from '$lib/types'

  $: products = <Product[]>[]

  const fetchProducts = async () => {
    await runQuery(`products?userId=${$user.id}`).then((results: ProductResult) => {
      products = results.data
    })
  }

  onMount(() => {
    fetchProducts()
  })
</script>

{#if $translations}
  <UserMenu state="products" title="Omat ilmoitukset" />

  <div class="bg-white max-w-screen-lg mb-10 mx-auto overflow-x-auto p-6">
    {#if Array.isArray(products) && products[0]}
      <table class="border-collapse min-w-full" rules="rows" style="width:600px">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="p-2">Tuote</th>
            <th class="p-2">Kuvia</th>
            <th class="p-2">Hinta</th>
            <th class="p-2">Tyyppi</th>
            <th class="p-2">Muokattu</th>
            <th class="p-2">Voimassa</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each products as product}
            <tr>
              <td class="px-2 py-3"><a class="border-0 h-full no-underline p-0 text-black hover:text-primary w-full" href={`/oma/ilmoitus?id=${product.id}`}><strong>{product.title} &rarr;</strong></a></td>
              <td class="px-2 py-3 w-16">{product.imageCount}</td>
              <td class="px-2 py-3 w-20">{product.price}</td>
              <td class="px-2 py-3 w-24">{product.type.title}</td>
              <td class="px-2 py-3 w-24">{dayjs(product.updated).format('DD.MM.YYYY')}</td>
              <td class="px-2 py-3 w-24">{dayjs(product.valid).format('DD.MM.YYYY')}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <SvelteToast />
{/if}
