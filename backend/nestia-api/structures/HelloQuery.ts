import type { MaxLength } from 'typia/lib/tags/MaxLength'
import type { Type } from 'typia/lib/tags/Type'

export type HelloQuery = {
  /**
   * <small>😊 Some information about text field</small>
   */
  text: string & MaxLength<128>

  /**
   * Some information about num field
   */
  num?: undefined | (number & Type<'uint32'>)
}
