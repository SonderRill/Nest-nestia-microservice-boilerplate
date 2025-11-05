export interface GetManyParamsDto<OrderBy extends string = 'id'> {
  page: number
  limit: number
  order?: 'asc' | 'desc'
  orderBy?: OrderBy
  startDate?: string
  endDate?: string
}
