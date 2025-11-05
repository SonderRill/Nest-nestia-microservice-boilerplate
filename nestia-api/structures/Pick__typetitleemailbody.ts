import type { Format } from 'typia/lib/tags/Format'
import type { MaxLength } from 'typia/lib/tags/MaxLength'
import type { MinLength } from 'typia/lib/tags/MinLength'

/**
 * From T, pick a set of properties whose keys are in the union K
 */
export type Pick__typetitleemailbody = {
  title: string & MinLength<5> & MaxLength<80>
  email: string & Format<'email'>
  body: string
}
