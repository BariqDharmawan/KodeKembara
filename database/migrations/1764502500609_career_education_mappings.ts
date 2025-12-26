import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLE_NAME } from 'Config/constant'

export default class extends BaseSchema {
  protected tableName = TABLE_NAME.career_education_mappings

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true }).notNullable().index()
      table.uuid('career_available_id')
      table.uuid('educational_id')
      table.float('belief_weight')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
