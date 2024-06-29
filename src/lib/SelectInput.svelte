<script lang="ts">
  import type { Option } from '$lib/types'

  export let label: string
  export let name: string
  export let options: Option[]
  export let required: boolean = true
  export let value: string = ''
</script>

{#if Array.isArray(options) && options.length}
  <label class="form-control">
    <span class="leading-normal">
      {label}
      {#if required}<sup class="leading-none text-red-600">*</sup>{/if}
    </span>
    <select bind:value id={`form-${name}`} class="bg-white select select-bordered w-full" {name} {required}>
      {#each options as item (item.value)}
        <option value={item.value}>{item.label}</option>
      {/each}
    </select>
  </label>
{/if}
