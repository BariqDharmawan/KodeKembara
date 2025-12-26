import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CareerSkillConfidence from 'App/Models/CareerSkillConfidence'
import SkillAvailable from 'App/Models/SkillAvailable'
import CareerAvailable from 'App/Models/CareerAvailable'
import crypto from 'node:crypto'
import { faker } from '@faker-js/faker'

const careerConfidence = (careerId: string, skillId: string) => {
  return {
    id: crypto.randomUUID(),
    career_available_id: careerId,
    skill_availables_id: skillId,
  }
}

export default class extends BaseSeeder {
  public async run() {
    const skillAvailable = await SkillAvailable.query().select('id')
    const careerAvailable = await CareerAvailable.query().select('id')

    const skillIds = skillAvailable.map((skill) => skill.id)
    const careerAvailableIds = careerAvailable.map((career) => career.id)

    await CareerSkillConfidence.createMany(
      skillIds.map((skillId) => {
        return careerConfidence(
          careerAvailableIds[faker.number.int({ min: 0, max: careerAvailableIds.length - 1 })],
          skillId
        )
      })
    )
  }
}
