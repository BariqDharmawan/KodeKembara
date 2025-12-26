import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import SkillExperience from './SkillExperience'
import UserEducationalTaken from './UserEducationalTaken'
import { TUserRole } from 'Contracts/types'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static ROLE_USER: TUserRole[] = ['admin', 'customer']

  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: TUserRole

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Profile, {
    foreignKey: 'user_uuid',
  })
  public profile: HasOne<typeof Profile>

  @hasMany(() => SkillExperience, {
    foreignKey: 'user_uuid',
  })
  public skillExperience: HasMany<typeof SkillExperience>

  @hasMany(() => UserEducationalTaken, {
    foreignKey: 'user_uuid',
  })
  public educational_taken: HasMany<typeof UserEducationalTaken>
}
