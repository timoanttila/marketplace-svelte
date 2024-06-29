<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import { runQuery, user } from '$lib/store'
  import { toastMessage } from '$lib/toast'
  import TextInput from '$lib/TextInput.svelte'

  onMount(() => {
    if ($user?.token) {
      goto('/oma')
    }
  })

  interface UserLogin {
    email: string
    password: string
  }

  let state: 'login' | 'reset' | 'verification' = 'login'
  let bodyDefault: UserLogin = { email: '', password: '' }
  let body: UserLogin = bodyDefault
  let loading: boolean = false
  let botCheck: string = ''

  const login = async (type: 'token' | 'new') => {
    if (botCheck) {
      toastMessage('Emme tykkää boteista.', 2)
      return
    }

    if (!body.email || !body.password) {
      toastMessage('Täytä kaikki kentät.', 2)
      return
    }

    if (type === 'new' && body.password.length < 8) {
      toastMessage('Salasana on liian lyhyt.', 2)
      return
    }

    loading = true

    runQuery(`users/${type}`, 'post', body)
      .then((res) => {
        if (res.token) {
          $user = res
          goto('/oma')
        } else {
          const error = res.error ? res.error : 'Kirjautuminen ei onnistunut.'
          toastMessage(error, 2)
        }
      })
      .finally(() => {
        loading = false
      })
  }

  const resetPassword = async () => {
    if (botCheck) {
      return
    }

    if (!body.email) {
      toastMessage('Täytä kaikki kentät.', 2)
      return
    }

    loading = true

    runQuery('users/reset', 'post', { email: body.email })
      .then((res) => {
        if (res.message) {
          toastMessage(res.message, 1)
        } else {
          const error = res.error ? res.error : 'Salasanaa ei voi palauttaa.'
          toastMessage(error, 2)
        }
      })
      .finally(() => {
        loading = false
      })
  }
</script>

{#if browser}
  <SvelteToast />
{/if}

<div class="mt-10 px-4">
  <div class="leading-tight max-w-screen-md mx-auto text-center">
    <div class="font-content text-gray-600 text-lg uppercase">Oma profiili</div>
    <h1 class="font-title mb-10 mt-0 text-5xl">Kirjautuminen</h1>
  </div>

  <form on:submit|preventDefault class="bg-white border border-gray-400 border-solid font-content max-w-md mx-auto p-6 rounded-lg">
    {#if state === 'reset'}
      <p class="mb-6">Jos sinulla on voimassa oleva käyttäjätunnus sähköpostiosoitteella, lähetämme sinulle sähköpostin tämän lomakkeen täyttämisen jälkeen. Sähköpostissa on linkki, jota sinun on klikattava salasanan vaihtamisen viimeistelyä varten.</p>
    {/if}

    <div class="gap-4 grid">
      <TextInput label="Sähköposti" maxlength={100} minlength={6} name="user" type="email" bind:value={body.email} required={true} />

      {#if state !== 'reset'}
        <TextInput label="Salasana" maxlength={30} minlength={8} name="password" type="password" bind:value={body.password} required={true} />
      {/if}
    </div>

    <input name="confirmEmail" type="email" bind:value={botCheck} hidden />

    <div id="form-actions" class="flex justify-between mt-6">
      {#if state === 'login'}
        <button on:click={() => login('new')} class="bg-primary btn p text-white xs:w-36">Luo tunnus</button>
        <button on:click={() => login('token')} disabled={loading} class="btn btn-primary p text-white xs:w-36">Kirjaudu</button>
      {:else if state === 'reset'}
        <button on:click={() => (state = 'login')} class="bg-black btn p text-white xs:w-36">Kirjaudu</button>
        <button on:click={() => resetPassword()} disabled={loading} class="bg-primary btn p text-white xs:w-36">Resetoi</button>
      {/if}
    </div>
  </form>

  {#if state === 'login'}
    <div class="mt-3 text-center"><button on:click={() => (state = 'reset')} class="btn-ghost h-10 px-6 rounded-full">Unohtuiko salasana?</button></div>
  {/if}
</div>
