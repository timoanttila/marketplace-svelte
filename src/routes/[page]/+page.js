import {redirect} from '@sveltejs/kit'
import {slugify, runQuery} from '$lib/store'

export async function load({params}) {
  const response = await runQuery(`pages/${slugify(params.page)}`)

  if (response?.id) {
    return response
  } else {
    throw redirect(301, '/')
  }
}
