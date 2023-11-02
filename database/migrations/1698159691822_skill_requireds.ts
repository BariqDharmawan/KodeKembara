import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'skill_requireds'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique()
      table.string('career_id')
      table.string('skill_experience_id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
