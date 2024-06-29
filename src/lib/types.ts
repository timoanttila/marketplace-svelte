export interface Basic {
  id: string
  title: string
  slug: string
}

export interface BreadcrumbItem {
  item: string
  name: string
  position: number
}

export interface CategoryResults {
  conditions: Basic[]
  rooms: Basic[]
  types: Basic[]
}

export interface Content extends Basic {
  content: string
  created: string
  updated: string
}

export interface Filter extends Basic {
  total: number
}

export interface ResultData {
  message?: string
  error?: string
}

export interface MetaTags {
  canonical: string
  created?: string
  description?: string
  image: string
  ldjson?: string
  metaTitle: string
  noindex?: boolean
  title: string
  updated?: string
}

export interface Image {
  alt: string
  original: ImageData
  side: ImageData
}

export interface ImageData {
  alt?: string
  height: number
  url: string
  width: number
}

export interface Option {
  label: string
  value: string | number
}

export interface Page extends Content {
  children?: Page[]
  description?: string
}

export interface Product extends Content {
  area: string
  category: Basic
  condition: Basic
  image?: ImageData
  imageCount?: number
  images?: Image[]
  phone?: string
  price: number
  type: Basic
  valid: string
  zip: string
}

export interface ProductResult {
  data: Product[]
  query: ResultInfo
}

export interface ResultInfo {
  isNext?: boolean
  isPrev?: boolean
  limit?: number
  pageNumber?: number
  pageSize?: number
  total?: number
}

interface StringItem {
  [key: string]: string
}

export interface TranslationData {
  [key: string]: StringItem[]
}

export interface Translations {
  en: TranslationData
  fi: TranslationData
  sv: TranslationData
}

export interface UserInfo {
  created?: string
  email: string
  id: number
  lastLogin?: string
  token: string
  updated?: string
}
