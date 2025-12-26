import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CareerAvailable from 'App/Models/CareerAvailable'
import Educational from 'App/Models/Educational'
import CareerEducationMapping from 'App/Models/CareerEducationMapping'
import crypto from 'node:crypto'

export default class extends BaseSeeder {
  public async run() {
    const careers = await CareerAvailable.all()
    const educationals = await Educational.all()

    for (const career of careers) {
      // shuffle educationals
      const shuffled = educationals.sort(() => 0.5 - Math.random())

      // take random 1-3
      const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 1)

      for (const educational of selected) {
        await CareerEducationMapping.create({
          id: crypto.randomUUID(),
          career_available_id: career.id,
          educational_id: educational.id,
          belief_weight: parseFloat(Math.random().toFixed(2)),
        })
      }
    }
  }
}
