<script lang="ts">
  import type { Basic } from '$lib/types'
  export let values: Basic[]
</script>

{#if Array.isArray(values)}
  {#each values as value}
    <option value={value.slug || value.id}>{value.title}</option>
  {/each}
{/if}
