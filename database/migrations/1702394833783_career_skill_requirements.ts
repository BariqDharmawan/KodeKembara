import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'career_skill_requirements'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true }).index()
      table.string('career_available_id').notNullable()
      table.string('skill_availables_id').notNullable()
      table.integer('minimum_month_experience').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
