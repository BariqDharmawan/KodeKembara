import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Educational extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static MIN_CHAR = 2

  public static MAX_CHAR = 35

  @column({ isPrimary: true })
  public id: string

  @column()
  public level: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
