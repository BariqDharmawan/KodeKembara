import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLE_NAME } from 'Config/constant'

export default class extends BaseSchema {
  protected tableName = TABLE_NAME.career_recommendations

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true }).index()
      table.string('user_id')
      table.string('recommendation')
      table.integer('confidence_score').unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
