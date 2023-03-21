import type { SortType } from './main';

export type ServerOptionsComputed = {
  page: number
  rowsPerPage: number
  sortBy: string | string[] | null
  sortType: SortType | SortType[] | null
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
  sortBy: string | string[],
  sortDesc: boolean | boolean[],
}

export type ClickEventType = 'single' | 'double'

export type MultipleSelectStatus = 'allSelected' | 'noneSelected' | 'partSelected'

// eslint-disable-next-line max-len
export type EmitsEventName = 'clickRow' | 'selectRow' | 'deselectRow' | 'expandRow' | 'updateSort' | 'update:itemsSelected' | 'update:serverOptions' | 'updateFilter' | 'updatePageItems' | 'updateTotalItems' | 'selectAll'
