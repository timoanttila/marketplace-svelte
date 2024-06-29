<script lang="ts">
  export let value: number | string
</script>

<span>{Math.round(Number(value) * 100) / 100}</span>
