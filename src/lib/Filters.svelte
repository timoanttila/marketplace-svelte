<script lang="ts">
  import { onMount } from 'svelte'
  import { runQuery, searchFilters, translations } from '$lib/store'

  interface Result {
    types: { id: string; keyword: string }[]
    categories: { id: string; keyword: string }[]
  }

  let data: Result | null = null
  const fetchProducts = async () => {
    $searchFilters = {
      category: '',
      search: '',
      type: '',
    }

    data = await runQuery('categories')
  }

  onMount(() => {
    fetchProducts()
  })
</script>

{#if data?.categories && $translations}
  <div class="gap-4 grid grid-cols-5 max-w-screen-md mx-auto">
    <label class="font-content form-control">
      <span class="label">{$translations['LABEL_TYPE']}</span>
      <select bind:value={searchFilters.type} class="select select-primary">
        <option value="">{$translations['LABEL_ALL']}</option>
        {#each data.types as type}
          <option value={type.id}>{$translations[type.keyword]}</option>
        {/each}
      </select>
    </label>

    <label class="font-content form-control">
      <span class="label">{$translations['LABEL_CATEGORY']}</span>
      <select bind:value={searchFilters.category} class="select select-primary">
        <option value="">{$translations['LABEL_ALL']}</option>
        {#each data.categories as category}
          <option value={category.id}>{$translations[category.keyword]}</option>
        {/each}
      </select>
    </label>

    <label class="font-content col-span-2 form-control">
      <span class="label">{$translations['LABEL_KEYWORD']}</span>
      <input bind:value={searchFilters.search} class="input input-primary" maxlength="50" minlength="3" placeholder={$translations['PLACEHOLDER_KEYWORD']} type="search" />
    </label>

    <div class="flex items-end">
      <button on:click={() => searchQuery()} class="btn btn-primary w-full">Rajaa</button>
    </div>
  </div>
{/if}
