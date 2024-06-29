import {runQuery} from '$lib/store'

export async function load() {
  return await runQuery('pages/1')
}
