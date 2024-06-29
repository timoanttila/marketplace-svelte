<script lang="ts">
  import { goto } from '$app/navigation'
  import { api, categories, runQuery, user } from '$lib/store'
  import SelectInput from '$lib/SelectInput.svelte'
  import TextInput from '$lib/TextInput.svelte'
  import UserMenu from '$lib/UserMenu.svelte'
  import { toastMessage } from '$lib/toast'
  import type { Product } from '$lib/types'

  export let data: Product | undefined

  let body = {
    title: data?.title ?? '',
    price: data?.price ?? '',
    zip: data?.zip ?? '',
    phone: data?.phone ?? '',
    room: data?.category?.id ?? '',
    type: data?.type?.id ?? '',
    condition: data?.condition?.id ?? '',
    description: data?.content ?? '',
    delete: false,
  }

  let check = { info: false, rules: data?.id ? true : false }
  let loading = false
  let fileInput: HTMLInputElement

  const handleSubmit = async () => {
    if (body.delete) {
      if (!data?.id) {
        return
      }

      // Send JSON data to your backend using runQuery
      await runQuery(`products/${data.id}`, 'DELETE', null, $user.token).then((results) => {
        if (results?.message) {
          toastMessage(results.message, 1)
          goto('/oma')
        } else {
          const error = results.error ?? 'Ongelma tuotteen poistamisessa'
          toastMessage(error, 2)
        }
      })
      return
    }

    // Create a FormData object for the form
    const formData = new FormData()

    // Append selected files to the FormData
    for (const file of fileInput.files) {
      formData.append('image-files[]', file)
    }

    loading = true

    try {
      // Prepare method and endpoint
      const method = data?.id ? 'PUT' : 'POST'
      const endpoint = data?.id ? `products/${data.id}` : 'products'

      // Send JSON data to your backend using runQuery
      const response = await runQuery(endpoint, method, body, $user.token)

      if (!response.error && response?.id) {
        // Send files to the separate endpoint
        await fetch(`${api}upload.php?productId=${response.id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${$user.token}`,
          },
          body: formData,
        })

        // Message to the user
        toastMessage(response.message, 1)

        // Reset the body values
        body = {
          title: '',
          price: '',
          zip: '',
          phone: '',
          room: '',
          type: '',
          condition: '',
          description: '',
          delete: false,
        }

        // Reset the file input
        fileInput.value = ''

        goto('/oma')
      } else {
        const error = response.error ?? 'Ongelma tuotteen tietojen käsittelyssä..'
        toastMessage(error, 2)
      }
    } catch (error) {
      console.error(error)
      toastMessage('An error occurred while submitting the form', 2)
    } finally {
      loading = false
    }
  }
</script>

<UserMenu state="edit" title="Ilmoituksen hallinta" />

{#if $categories}
  <form method="post" on:submit|preventDefault={handleSubmit} enctype="multipart/form-data" class="font-content gap-4 grid max-w-screen-lg my-10 mx-auto">
    <div class="bg-white border border-gray-400 border-solid gap-4 grid p-4 lg:rounded-lg">
      <div class="gap-4 grid xs:grid-cols-2 md:grid-cols-3">
        <div class="xs:col-span-2">
          <TextInput label="Tuotetta kuvaava otsikko" maxlength={60} minlength={6} name="title" bind:value={body.title} />
        </div>

        <label class="form-control">
          <span class="leading-normal">
            Hinta <sup class="leading-none text-red-600">*</sup>
          </span>
          <input bind:value={body.price} id="form-price" class="bg-white input input-bordered w-full" name="price" type="number" min={0} step={1} required />
        </label>

        <TextInput label="Postinumero" maxlength={5} minlength={5} name="zip" bind:value={body.zip} />

        <TextInput label="Puhein" maxlength={20} minlength={5} name="phone" bind:value={body.phone} required={false} />

        <SelectInput label="Huone" name="room" bind:value={body.room} options={$categories.rooms.map((item) => ({ label: item.title, value: item.id }))} required={true} />

        <SelectInput label="Tyyppi" name="type" bind:value={body.type} options={$categories.types.map((item) => ({ label: item.title, value: item.id }))} required={true} />

        <SelectInput label="Kunto" name="condition" bind:value={body.condition} options={$categories.conditions.map((item) => ({ label: item.title, value: item.id }))} required={true} />
      </div>

      <label class="form-control">
        <span class="leading-normal">
          Tuotteen kuvaus <sup class="leading-none text-red-600">*</sup>
        </span>
        <textarea bind:value={body.description} id="form-description" class="bg-white font-content textarea textarea-bordered w-full" name="description" minlength="20" maxlength="1000" required />
      </label>

      {#if data?.id && Array.isArray(data?.images) && data.images.length}
        <div class="gap-6 grid grid-cols-2 sm:grid-cols-3">
          {#each data.images as image}
            <img class="h-auto max-h-full max-w-full" src={image.side.url} alt={image.side.alt} width={image.side.width} height={image.side.height} />
          {/each}
        </div>
      {/if}

      <label class="form-control">
        <span class="leading-normal">
          Lisää kuvat {#if !data?.images?.length}<sup class="leading-none text-red-600">*</sup>{/if}
        </span>
        <input id="image-file" type="file" name="image-files" bind:this={fileInput} class="bg-white file-input file-input-bordered file-input-primary w-full" accept="image/*" multiple required={!data?.images?.length && !body.delete} />
      </label>

      {#if !data?.id}
        <div class="form-control">
          <label class="cursor-pointer flex items-center">
            <input type="checkbox" name="checkRules" class="mr-2" bind:checked={check.rules} required />
            <span>Olen lukenut <a href="/sivustosta">sivuston käyttöehdot</a> ja sitoudun noudattamaan niitä.</span>
          </label>
        </div>
      {/if}

      <div class="form-control">
        <label class="cursor-pointer flex items-center">
          <input type="checkbox" name="checkInfo" class="mr-2" bind:checked={check.info} required />
          <span>Olen tarkistanut tuotteen tiedot ja haluan lähettää lomakkeen.</span>
        </label>
      </div>

      {#if data?.id}
        <div class="form-control">
          <label class="cursor-pointer flex items-center">
            <input type="checkbox" name="checkInfo" class="mr-2" bind:checked={body.delete} value={true} />
            <span>Haluan poistaa tuotteen palvelusta.</span>
          </label>
        </div>
      {/if}
    </div>

    <div class="flex justify-between px-4">
      <a class="bg-black btn text-white" href="/oma">Paluu</a>

      <button class={`${body.delete ? 'bg-red-600' : 'bg-primary'} btn text-white`} type="submit" disabled={loading || !check.info || !check.rules}>
        {#if body.delete}Poista{:else}Lähetä{/if}
      </button>
    </div>
  </form>
{/if}
