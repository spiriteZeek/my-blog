export interface Pagination<T> {
  list: T[]
  total: number
  totalPage: number
  currentPage: number
}
