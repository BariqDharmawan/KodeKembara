import { DateTime } from 'luxon'
import { BaseModel, HasOne, ManyToMany, column, hasOne, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import CareerAvailable from './CareerAvailable'
import SkillConfidence from './SkillConfidence'

export default class SkillAvailable extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasOne(() => SkillConfidence, {
    localKey: 'id',
    foreignKey: 'skill_availables_id',
  })
  public skillConfidence: HasOne<typeof SkillConfidence>

  @manyToMany(() => CareerAvailable, {
    pivotTable: 'career_skill_requirements',
    pivotForeignKey: 'skill_availables_id',
  })
  public careerSuggestion: ManyToMany<typeof CareerAvailable>
}
