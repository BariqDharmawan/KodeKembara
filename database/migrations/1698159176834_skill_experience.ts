import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'skill_experiences'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique()
      table.string('skill_name')
      table.integer('month_of_experience')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
