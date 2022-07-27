import type {
  SortType, Header, Item, ServerOptions, FilterOption,
  HeaderItemClassNameFunction, BodyItemClassNameFunction, BodyRowClassNameFunction,
} from './main';

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

export interface Props {
  alternating?: boolean
  borderCell?: boolean
  bodyRowClassName?: BodyRowClassNameFunction | string
  bodyItemClassName?: BodyItemClassNameFunction | string
  buttonsPagination?: boolean
  checkboxColumnWidth?: number | null
  emptyMessage?: string
  expandColumnWidth?: number
  filterOptions?: FilterOption | null
  fixedExpand?: boolean
  fixedHeader?: boolean
  fixedCheckbox?: boolean
  fixedIndex?: boolean
  headerClassName?: string
  headerItemClassName?: HeaderItemClassNameFunction | string
  headers: Header[]
  hideFooter?: boolean
  hideRowsPerPage?: boolean
  hideHeader?: boolean
  indexColumnWidth?: number
  items: Item[]
  itemsSelected?: Item[] | null
  loading?: boolean
  mustSort?: boolean
  noHover?: boolean
  rowsPerPage?: number
  rowsItems?: number[]
  rowsPerPageMessage?: string
  searchField?: string
  searchValue?: string
  serverOptions?: ServerOptions | null
  serverItemsLength?: number
  showIndex?: boolean
  sortBy?: string
  sortType?: SortType
  tableHeight?: number | null
  themeColor?: string
  tableClassName?: string
}
