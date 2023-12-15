import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import SkillAvailable from './SkillAvailable'

export default class SkillExperience extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public skill_availables_id: string

  @column()
  public month_of_experience: number

  @column({ serializeAs: null })
  public user_uuid: string

  @belongsTo(() => User, {
    foreignKey: 'user_uuid',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => SkillAvailable, {
    foreignKey: 'skill_availables_id',
  })
  public skillName: BelongsTo<typeof SkillAvailable>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
