<script lang="ts">
  import { Menu } from 'lucide-svelte'
  import { siteName, user, width } from '$lib/store'

  let menuOpen: boolean = $width > 750 ? true : false

  const menu = [
    {
      title: 'Ilmoitukset',
      slug: '',
    },
    {
      title: 'Sivustosta',
      slug: 'sivustosta',
    },
  ]
</script>

<header id="head" class="bg-primary block fixed left-0 min-h-12 top-0 w-screen z-50">
  <div class="content flex font-content items-center leading-tight max-w-screen-xl mx-auto px-4 relative uppercase">
    <a id="site-brand" class="inline-block text-3xl" href="/" rel="home" title="Back to front page">
      <strong>{siteName}</strong>
    </a>

    <button on:click={() => (menuOpen = !menuOpen)} id="menu-toggler" class="absolute bg-transparent border-0 h-12 p-0 right-2 text-white top-0 w-12 z-50" aria-controls="menu" aria-haspopup="true" aria-expanded={menuOpen} disabled={$width > 750}>
      <Menu size={38} />
    </button>

    <nav id="menu" class="bg-primary" class:active={menuOpen}>
      <ul class="leading-tight m-0 p-0">
        {#each menu as page}
          <li class="inline-block">
            <a class="block px-4 py-2" href={`/${page.slug ?? ''}`} on:click={() => (menuOpen = false)}>
              <span>{page.title}</span>
            </a>
          </li>
        {/each}

        <li class="inline-block">
          <a class="block px-4 py-2" href={`/${$user?.id ? 'oma' : 'login'}`} on:click={() => (menuOpen = false)}>
            <span>{$user?.id ? 'Omat ilmoitukset' : 'Kirjaudu'}</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>
