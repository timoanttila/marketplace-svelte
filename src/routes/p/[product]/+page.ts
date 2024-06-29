import {redirect} from '@sveltejs/kit'
import {runQuery} from '$lib/store'

export async function load({params}) {
  const productId = Number(params.product.split('-')[0])

  if (!productId) {
    throw redirect(308, '/')
  }

  const response = await runQuery(`products/${Number(productId)}`)

  if (response?.id) {
    return response
  } else {
    throw redirect(301, '/')
  }
}
