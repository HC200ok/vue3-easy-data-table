import type { SortType } from './main';

export type ServerOptionsComputed = {
  page: number
  rowsPerPage: number
  sortBy: string | null
  sortType: SortType | null
}

export type HeaderForRender = {
  text: string,
  value: string,
  sortable?: boolean,
  sortType?: SortType | 'none',
  fixed?: Boolean,
  width?: number,
}

export type ClientSortOptions = {
  sortBy: string,
  sortDesc: boolean,
}

export type MultipleSelectStatus = 'allSelected' | 'noneSelected' | 'partSelected'

export type EmitsEventName = 'clickRow' | 'expandRow' | 'update:itemsSelected' | 'update:serverOptions'
