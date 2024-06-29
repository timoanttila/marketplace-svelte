<script lang="ts">
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import { goto } from '$app/navigation'
  import { user } from '$lib/store'

  $: if (!$user?.token) {
    goto('/login')
  }
</script>

<svelte:head>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<slot />
<SvelteToast />
