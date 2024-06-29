<script lang="ts">
  import Price from '$lib/Price.svelte'
  import type { Product } from '$lib/types'
  export let products: Product[]
  export let loading: boolean = false
</script>

{#if Array.isArray(products) && products[0]}
  <div class="gap-6 grid max-w-screen-xl mx-auto products px-4" role="feed" aria-busy={loading}>
    {#each products as product, index}
      <div class="bg-white border border-gray-300 border-solid rounded-xl shadow-xl" aria-posinset={index + 1} aria-setsize={products.length} aria-labelledby={`title-${index}`}>
        <a class="block no-underline" href={`/p/${product.slug}`} aria-labelledby={`title-${index}`}>
          <div id={`type-${index}`} class="grid h-16 items-center px-4 text-color uppercase">
            <h3 id={`title-${index}`} class="font-content m-0 text-black text-lg text-center">{product.title}</h3>
          </div>

          <div class="aspect-square">
            <img id={`image-${index}`} class="block h-full object-cover w-full" src={`${product.image?.url.split('.').pop() ? product.image?.url : '/images/noimg.jpg'}`} alt={product.image?.alt} width={300} height={300} aria-hidden="true" />
          </div>

          <div class="font-content p-4 text-gray-800">
            <div id={`city-${index}`} class="flex justify-between uppercase">
              <div>{product.zip} {product.area}</div>
              <div>{product.type.title}</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-color text-left">
                <div id={`category-${index}`}>{product.category.title}</div>
                <div id={`condition-${index}`}>{product.condition.title}</div>
              </div>

              <div class="product-price text-2xl text-right">
                <strong id={`price-${index}`}><Price value={product.price} /> €</strong>
              </div>
            </div>
          </div>
        </a>
      </div>
    {/each}
  </div>
{/if}
