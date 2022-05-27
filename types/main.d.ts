export type SortType = 'asc' | 'desc'

export type Header = {
  text: string,
  value: string,
  sortable?: boolean,
}

export type Item = Record<string, any>

export type ServerOptions = {
  page?: number,
  rowsPerPage?: number,
  sortBy?: string,
  sortType?: SortType,
}
