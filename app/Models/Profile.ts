import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Profile extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: string

  @column()
  public name: string

  @column()
  public current_job: string

  @column()
  public age: number

  @column({ serializeAs: null })
  public user_uuid: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_uuid',
  })
  public user: BelongsTo<typeof User>
}
