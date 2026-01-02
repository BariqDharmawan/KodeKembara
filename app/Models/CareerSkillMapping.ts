import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CareerAvailable from './CareerAvailable'
import SkillAvailable from './SkillAvailable'

export default class CareerSkillMapping extends BaseModel {
  public static table = 'career_skill_mappings'

  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: null })
  public career_available_id: string

  @column({ serializeAs: null })
  public skill_available_id: string

  @column()
  public belief_weight: number

  @column()
  public min_experience_months: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => CareerAvailable, {
    foreignKey: 'career_available_id',
  })
  public careerAvailable: BelongsTo<typeof CareerAvailable>

  @belongsTo(() => SkillAvailable, {
    foreignKey: 'skill_available_id',
  })
  public skillAvailable: BelongsTo<typeof SkillAvailable>
}
