<script lang="ts">
  import dayjs from 'dayjs'
  import { ArrowBigLeft, ArrowBigRight } from 'lucide-svelte'
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import { currentPage, host, runQuery, siteName, translations } from '$lib/store'
  import { toastMessage } from '$lib/toast'
  import Price from '$lib/Price.svelte'
  import Products from '$lib/Products.svelte'
  import type { BreadcrumbItem, Product, ProductResult } from '$lib/types'

  export let data: Product

  let body = { name: '', email: '', message: '' },
    botCheck = '',
    canonical = '',
    imageIndex = 0,
    ldjson = '',
    loading = false,
    products = <Product[] | []>[]

  const contact = async () => {
    if (botCheck) {
      return
    }

    loading = true

    await runQuery(`messages/${data.id}`, 'POST', { ...body, productId: data.id })
      .then((results) => {
        if (results.message) {
          toastMessage(results.message, 1)
          reset()
        } else if (results.error) {
          toastMessage(results.error, 2)
        } else {
          toastMessage('Something went wrong.', 2)
        }
      })
      .finally(() => {
        loading = false
      })
  }

  const reset = () => {
    body = { name: '', email: '', message: '' }
  }

  const fetchProducts = async () => {
    await runQuery(`products?pageSize=4&order=desc&sort=modified&categoryId=${data.category.id}&no=${data.id}`).then((productData: ProductResult) => {
      products = productData.data
    })
  }

  $: if (data.id) {
    imageIndex = 0
    fetchProducts()

    canonical = `${host}p/${data.slug}`

    const breadcrumb: BreadcrumbItem[] = [
      {
        name: 'Ilmoitukset',
        item: host,
        position: 1,
      },
      {
        name: data.title,
        item: canonical,
        position: 2,
      },
    ]

    ldjson = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":${JSON.stringify(breadcrumb)}}${'<'}/script>`

    $currentPage = {
      canonical,
      image: Array.isArray(data?.images) && data.images[0]?.side ? data.images[0].side.url : '/images/noimg.jpg',
      ldjson,
      metaTitle: `${data.title} | ${data.type.title} | ${siteName}`,
      title: data.title,
    }
  }

  const changeImage = (value: number) => {
    if (!data?.images) {
      return
    }

    if (value > data.images.length - 1) {
      imageIndex = 0
    } else if (value < 0) {
      imageIndex = data.images.length - 1
    } else {
      imageIndex = value
    }
  }
</script>

{#if $translations && data?.id}
  <div id="content">
    <div class="leading-tight max-w-screen-md mx-auto text-center">
      <div class="font-content text-gray-600 text-lg uppercase">{data.type.title}</div>
      <h1 class="font-title mb-10 mt-0 text-5xl">{data.title}</h1>
    </div>

    <div class="gap-10 grid md:grid-cols-2">
      <div id="product-image" class="relative" aria-hidden="true">
        {#if Array.isArray(data.images) && data.images[imageIndex]}
          <img id={`product-image-${data.id}-${imageIndex}`} class="block h-auto rounded-xl shadow-xl w-full" src={data.images[imageIndex].side.url} alt={`${data.type.title}: IKEA ${data.title}`} width={data.images[imageIndex].side.width} height={data.images[imageIndex].side.height} />

          {#if data.images.length > 1}
            <div class="absolute top-2 right-2">
              <button on:click={() => changeImage(imageIndex - 1)} class="bg-white border-0 h-10 p-0 rounded w-10"><ArrowBigLeft size={32} /></button>
              <button on:click={() => changeImage(imageIndex + 1)} class="bg-white border-0 h-10 p-0 rounded w-10"><ArrowBigRight size={32} /></button>
            </div>
          {/if}
        {:else}
          <img class="block h-auto rounded-xl shadow-xl w-full" src="/images/noimg.jpg" alt="Tuotteesta ei ole kuvaa" width="800" height="800" />
        {/if}
      </div>

      <div class="font-content">
        <div id="product-price" class="text-2xl">{$translations.LABEL_PRICE}: <Price value={data.price} /> €</div>

        <table class="border-collapse mt-6">
          <tbody>
            <tr>
              <td class="w-24">{$translations.LABEL_CATEGORY}:</td>
              <td>{data.category.title}</td>
            </tr>

            <tr>
              <td class="w-24">{$translations.LABEL_CONDITION}:</td>
              <td>{data.condition.title}</td>
            </tr>

            <tr>
              <td class="w-24">{$translations.LABEL_CREATED}:</td>
              <td>{dayjs(data.created).format('DD.MM.YYYY')}</td>
            </tr>

            {#if data.updated !== data.created}
              <tr>
                <td class="w-24">{$translations.LABEL_UPDATED}:</td>
                <td>{dayjs(data.updated).format('DD.MM.YYYY')}</td>
              </tr>
            {/if}
          </tbody>
        </table>

        <div id="product-content" class="mb-10 mt-6">{data.content}</div>

        <details>
          <summary>{$translations.FORM_PRODUCT_DESC}</summary>

          <SvelteToast />

          <form on:submit|preventDefault={() => contact()} class="gap-2 grid">
            <label class="form-control">
              <span class="label">{$translations['LABEL_NAME']}</span>
              <input bind:value={body.name} id="form-name" class="bg-white input input-primary" maxlength="50" minlength="2" name="form-name" placeholder=" " type="text" />
            </label>

            <label class="form-control">
              <span class="label">{$translations['LABEL_EMAIL']}</span>
              <input bind:value={body.email} id="form-email" class="bg-white input input-primary" maxlength="100" minlength="6" name="form-email" placeholder=" " type="email" />
            </label>

            <label class="form-control">
              <span class="label">{$translations['LABEL_MESSAGE']}</span>
              <textarea bind:value={body.message} id="form-message" class="bg-white font-content textarea textarea-primary" maxlength="500" name="form-message" placeholder=" " required />
            </label>

            <input bind:value={botCheck} name="verify" type="email" placeholder="Verify your email address" hidden />

            <div class="mt-4 text-right">
              <button class="btn btn-primary" disabled={loading}>{$translations['BUTTON_SUBMIT']}</button>
            </div>
          </form>
        </details>
      </div>
    </div>
  </div>
{/if}

{#if Array.isArray(products) && products[0]}
  <div class="mt-12">
    <div class="leading-tight max-w-screen-md mx-auto text-center">
      <div class="font-content text-gray-600 text-lg uppercase">Lisää mahdollisuuksia</div>
      <h2 class="font-title mb-10 mt-0 text-4xl">Kategorian päivitettyjä tuotteita</h2>
    </div>
    <Products {products} {loading} />
  </div>
{/if}
