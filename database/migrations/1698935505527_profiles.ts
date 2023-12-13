import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true }).index()
      table.string('name').notNullable()
      table.integer('age').nullable()
      table.string('educational_level_id').nullable()
      table.text('current_job').nullable()
      table.string('user_uuid')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
