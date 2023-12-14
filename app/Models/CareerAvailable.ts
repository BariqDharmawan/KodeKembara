import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import SkillAvailable from './SkillAvailable'

export default class CareerAvailable extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @manyToMany(() => SkillAvailable, {
    pivotTable: 'career_skill_requirements',
    pivotForeignKey: 'skill_availables_id',
  })
  public skillsRequirement: ManyToMany<typeof SkillAvailable>
}
