export type SortType = 'asc' | 'desc'

export type FilterComparison = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'between';

export type FilterOption = {
  field: string,
  comparison: 'between',
  criteria: [number, number],
} | {
  field: string,
  comparison: '=' | '!=',
  criteria: number | string,
} | {
  field: string,
  comparison: '>' | '>=' | '<' | '<=',
  criteria: number,
}

export type Header = {
  text: string,
  value: string,
  sortable?: boolean,
  fixed?: boolean,
  width?: number,
}

export type Item = Record<string, any>

export type ServerOptions = {
  page: number,
  rowsPerPage: number,
  sortBy?: string,
  sortType?: SortType,
}

export type clickRowArgument = Item & {
  isSelected?: boolean,
  indexInCurrentPage?: number,
}
