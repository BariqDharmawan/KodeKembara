import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CareerAvailable from 'App/Models/CareerAvailable'
import SkillAvailable from 'App/Models/SkillAvailable'
import CareerSkillMapping from 'App/Models/CareerSkillMapping'
import crypto from 'node:crypto'

export default class extends BaseSeeder {
  public async run() {
    const careers = await CareerAvailable.all()
    const skills = await SkillAvailable.all()

    for (const career of careers) {
      // Shuffle skills
      const shuffled = skills.sort(() => 0.5 - Math.random())

      // Take random 3-6 skills per career
      const selected = shuffled.slice(0, Math.floor(Math.random() * 4) + 3)

      for (const skill of selected) {
        await CareerSkillMapping.create({
          id: crypto.randomUUID(),
          career_available_id: career.id,
          skill_available_id: skill.id,
          belief_weight: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)), // Random between 0.5 and 1.0
          min_experience_months: Math.floor(Math.random() * 36) + 6, // Random between 6 and 42 months
        })
      }
    }
  }
}
