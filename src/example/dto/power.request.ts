import { tags } from 'typia'

export interface PowerRequest {
  number: number & tags.Type<'float'>
  degree: number & tags.Type<'float'>
}
