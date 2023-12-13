import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Educational from './Educational'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public educational_level_id: string

  @column()
  public current_job: string

  @column()
  public age: number

  @column()
  public user_uuid: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_uuid',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Educational, {
    foreignKey: 'educational_level_id',
  })
  public educational: BelongsTo<typeof Educational>
}
