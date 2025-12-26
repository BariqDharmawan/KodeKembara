import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLE_NAME } from 'Config/constant'

export default class extends BaseSchema {
  protected tableName = TABLE_NAME.skill_experiences

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true }).index()
      table.string('skill_availables_id').notNullable()
      table.integer('month_of_experience').notNullable()
      table.string('user_uuid').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
