import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CareerAvailableFactory from 'Database/factories/CareerAvailableFactory'

export default class extends BaseSeeder {
  public async run() {
    await CareerAvailableFactory.createMany(15)
  }
}
