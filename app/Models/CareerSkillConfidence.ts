import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import SkillAvailable from './SkillAvailable'
import CareerAvailable from './CareerAvailable'

export default class CareerSkillConfidence extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: string

  @column({ serializeAs: null })
  public skill_availables_id: string

  @column()
  public career_available_id: string

  @belongsTo(() => SkillAvailable, {
    foreignKey: 'skill_availables_id',
  })
  public skillName: BelongsTo<typeof SkillAvailable>

  @hasMany(() => CareerAvailable, {
    foreignKey: 'career_available_id',
  })
  public careerAvailable: HasMany<typeof CareerAvailable>

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime
}
