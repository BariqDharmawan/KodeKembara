import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CareerAvailable from './CareerAvailable'
import SkillAvailable from './SkillAvailable'

export default class CareerSkillRequirement extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public career_available_id: string

  @column()
  public skill_availables_id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => CareerAvailable)
  public careerAvailable: BelongsTo<typeof CareerAvailable>

  @belongsTo(() => SkillAvailable, {
    foreignKey: 'skill_availables_id',
  })
  public skillAvailable: BelongsTo<typeof SkillAvailable>
}
