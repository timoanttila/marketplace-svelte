<script lang="ts">
  import dayjs from 'dayjs'
  import { goto } from '$app/navigation'
  import { runQuery, user } from '$lib/store'
  import { toastMessage } from '$lib/toast'
  import TextInput from '$lib/TextInput.svelte'
  import UserMenu from '$lib/UserMenu.svelte'

  let body = { email: $user.email, password: '' }
  let loading = false

  const handleSubmit = async () => {
    if (!body.email) {
      toastMessage('Sähköpostiosoite on pakollinen tieto.', 2)
      return
    }

    loading = true

    runQuery('users/update', 'PUT', body, $user.token).then((results) => {
      loading = false

      if (results?.user && results?.message) {
        toastMessage(results.message, 1)
        goto('/oma')
      } else {
        const error = results.error ? results.error : 'Something went wrong.'
        toastMessage(error, 2)
      }
    })
  }
</script>

<UserMenu state="user" title="Käyttäjätiedot" />

<form on:submit={handleSubmit} class="font-content gap-4 grid max-w-screen-lg mt-10 mx-auto">
  <div class="bg-white border border-gray-400 border-solid p-4 lg:rounded-lg">
    <div class="gap-4 grid md:grid-cols-2">
      <TextInput label="Sähköpostiosoite" maxlength={100} minlength={6} name="email" bind:value={$user.email} />
      <TextInput label="Salasana" maxlength={20} minlength={8} name="password" type="password" bind:value={body.password} required={false} />
    </div>

    <p>ID: {$user.id}, luotu: {dayjs($user.created).format('DD.MM.YY HH:mm')}, päivitetty: {dayjs($user.updated).format('DD.MM.YY HH:mm')}</p>
  </div>

  <div class="text-right px-4">
    <button class="btn btn-primary" type="submit" disabled={loading || !body.email}>Päivitä käyttäjätiedot</button>
  </div>
</form>
