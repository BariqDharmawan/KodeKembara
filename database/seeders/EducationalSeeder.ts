import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Educational from 'App/Models/Educational'
import { EDUCATION_AVAILABLE } from 'Config/constant'
import crypto from 'node:crypto'

export default class extends BaseSeeder {
  public async run() {
    await Educational.createMany(
      EDUCATION_AVAILABLE.map((education) => ({
        id: crypto.randomUUID(),
        level: education,
      }))
    )
  }
}
