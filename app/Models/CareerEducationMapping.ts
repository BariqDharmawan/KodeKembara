import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CareerAvailable from './CareerAvailable'
import Educational from './Educational'

export default class CareerEducationMapping extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public career_available_id: string

  @column()
  public educational_id: string

  @column()
  public belief_weight: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => CareerAvailable, {
    foreignKey: 'career_available_id',
  })
  public careerAvailable: BelongsTo<typeof CareerAvailable>

  @belongsTo(() => Educational, {
    foreignKey: 'educational_id',
  })
  public educational: BelongsTo<typeof Educational>
}
