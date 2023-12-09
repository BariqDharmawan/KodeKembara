import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import EducationalFactory from 'Database/factories/EducationalFactory'

export default class extends BaseSeeder {
  public async run() {
    await EducationalFactory.createMany(5)
  }
}
