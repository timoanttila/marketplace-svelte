<script lang="ts">
  export let label: string
  export let maxlength: number = 50
  export let minlength: number = 2
  export let name: string
  export let type: string = 'text'
  export let value: string = ''
  export let required: boolean = true

  const handleInput = (e: any) => {
    value = e.target.value
  }
</script>

<label class="form-control">
  <span class="leading-normal">
    {label}
    {#if required}<sup class="leading-none text-red-600">*</sup>{/if}
  </span>
  <input on:change={handleInput} {value} id={`form-${name}`} class="bg-white input input-bordered w-full" {name} {type} {minlength} {maxlength} {required} />
</label>
