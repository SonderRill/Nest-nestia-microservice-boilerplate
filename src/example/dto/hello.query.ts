import { tags } from 'typia'

export interface HelloQuery {
  /**
   * <small>😊 Some information about text field</small>
   */
  text: string & tags.MaxLength<128>

  /**
   * Some information about num field
   */
  num?: number & tags.Type<'uint32'>
}
