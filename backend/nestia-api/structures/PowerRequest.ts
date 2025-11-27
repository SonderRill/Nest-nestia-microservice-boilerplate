import type { Type } from 'typia/lib/tags/Type'

export type PowerRequest = {
  number: number & Type<'float'>
  degree: number & Type<'float'>
}
