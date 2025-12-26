import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Educational from 'App/Models/Educational'
import { EDUCATION_AVAILABLE } from 'Config/constant'
import { v4 as uuidv4 } from 'uuid'

export default class extends BaseSeeder {
  public async run() {
    await Educational.createMany(
      EDUCATION_AVAILABLE.map((education) => ({
        id: uuidv4(),
        level: education,
      }))
    )
  }
}
