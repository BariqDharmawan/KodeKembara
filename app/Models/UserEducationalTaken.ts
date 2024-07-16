import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Educational from './Educational';

export default class UserEducationalTaken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public user_uuid: string

  @column({ serializeAs: null })
  public educational_uuid: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_uuid',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Educational, {
    foreignKey: 'educational_uuid',
  })
  public educational: BelongsTo<typeof Educational>
}
