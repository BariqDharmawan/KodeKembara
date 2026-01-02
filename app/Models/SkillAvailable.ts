import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import CareerAvailable from './CareerAvailable'

export default class SkillAvailable extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @manyToMany(() => CareerAvailable, {
    pivotTable: 'career_skill_requirements',
    pivotForeignKey: 'skill_availables_id',
  })
  public careerSuggestion: ManyToMany<typeof CareerAvailable>
}
