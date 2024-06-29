import {writable} from 'svelte/store'
import type {CategoryResults, MetaTags, TranslationData} from '$lib/types'

export const api = 'https://api.aeki.fi/'
export const host = 'https://aeki.fi/'
export const siteName = 'AEKI'
export const defaultImage = `${host}images/ikea-kitchen-table-set-1366.webp`

const local = (key: string, startValue: any) => {
  const {subscribe, set} = writable(startValue)

  return {
    subscribe,
    set,
    useLocalStorage: () => {
      const value: string = String(localStorage.getItem(key))
      try {
        JSON.parse(value)
        set(JSON.parse(value))
      } catch (e) {
        set(value)
      }

      subscribe(current => {
        if (typeof current === 'object' || Array.isArray(current)) {
          current = JSON.stringify(current)
        }

        localStorage.setItem(key, current)
      })
    }
  }
}

interface Filters {
  category: string
  order: string
  search: string
  price: number
  sort: string
  type: string
}

export const filterReset = {
  category: '',
  order: 'desc',
  price: 0,
  search: '',
  sort: 'created',
  type: ''
}

export const categories = writable<CategoryResults | undefined>()
export const currentPage = writable<MetaTags | undefined>()
export const lang = local('lang', 'fi')
export const searchFilters = writable<Filters>(filterReset)
export const translations = writable<TranslationData | undefined>()
export const user = local('user', null)
export const width = writable(0)

export const slugify = (value: string): string => {
  return value.toLowerCase().replace(/[^a-z0-9-]/gi, '')
}

export const runQuery = async (query: string, method: string = 'GET', data: object | null = null, userToken: string | null = null) => {
  const url = `${api}${query}`
  const headers = {
    'Content-Type': 'application/json',
    ...(userToken ? {Authorization: `Bearer ${userToken}`} : undefined)
  }

  const options: RequestInit = {
    method,
    headers,
    ...(data ? {body: JSON.stringify(data)} : undefined)
  }

  try {
    const response = await fetch(url, options)
    if (response.status === 429) {
      return {error: 'Too many requests'}
    }
    return await response.json()
  } catch (err) {
    return err
  }
}
