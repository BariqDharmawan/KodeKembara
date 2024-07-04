import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import SkillAvailable from './SkillAvailable'

export default class SkillConfidence extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public confidence_score: number

  @column({ serializeAs: null })
  public skill_availables_id: string

  @belongsTo(() => SkillAvailable, {
    foreignKey: 'skill_availables_id',
  })
  public skillName: BelongsTo<typeof SkillAvailable>

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime
}
