import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLE_NAME } from 'Config/constant'

export default class extends BaseSchema {
  protected tableName = TABLE_NAME.skill_confidences

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index()
      table.string('skill_availables_id').notNullable()
      table.float('confidence_score').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
