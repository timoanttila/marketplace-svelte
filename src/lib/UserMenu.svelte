<script lang="ts">
  export let state: 'edit' | 'messages' | 'products' | 'user' = 'products'
  export let title: string
</script>

<div class="leading-tight max-w-screen-md mx-auto my-10 text-center">
  <div class="font-content text-gray-600 text-lg uppercase">Oma profiili</div>
  <h1 class="font-title m-0 text-5xl">{title}</h1>
</div>

<div id="userButtons" class="gap-2 grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 font-content max-w-screen-lg mb-6 mx-auto px-4">
  <a href="/oma" class="btn" class:btn-primary={state === 'products'}>Omat ilmoitukset</a>
  <a href="/oma/ilmoitus" class="btn" class:btn-primary={state === 'edit'}>Uusi ilmoitus</a>
  <a href="/oma/viestit" class="btn" class:btn-primary={state === 'messages'}>Viestit</a>
  <a href="/oma/info" class="btn" class:btn-primary={state === 'user'}>Käyttäjätiedot</a>
  <a href="/logout" class="btn">Kirjaudu ulos</a>
</div>
