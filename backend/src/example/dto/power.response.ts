import { tags } from 'typia'

export interface PowerResponse {
  result: number & tags.Type<'float'>
}
