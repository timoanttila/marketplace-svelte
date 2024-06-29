import {redirect} from '@sveltejs/kit'
import {runQuery} from '$lib/store'

export async function load({url}) {
  const productId = url.searchParams.get('id') || ''

  if (!productId) {
    throw redirect(308, '/oma')
  }

  const response = await runQuery(`products/${Number(productId)}`)

  if (response?.id) {
    return response
  } else {
    throw redirect(301, '/oma')
  }
}
