import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CareerAvailable from 'App/Models/CareerAvailable'
import CareerSkillRequirement from 'App/Models/CareerSkillRequirement'
import SkillAvailable from 'App/Models/SkillAvailable'
import crypto from 'node:crypto'
import { faker } from '@faker-js/faker'
import SkillConfidence from 'App/Models/SkillConfidence'
import { INITIAL_SKILL_AVAILABLE } from 'Config/constant'
export default class extends BaseSeeder {
  public async run() {
    const careerIds = (await CareerAvailable.all()).map((career) => career.id)

    await SkillAvailable.createMany(
      INITIAL_SKILL_AVAILABLE.map((eachSkill) => ({
        id: crypto.randomUUID(),
        name: eachSkill,
      }))
    )

    const skillIds = (await SkillAvailable.query().select('id')).map((skill) => skill.id)

    await CareerSkillRequirement.createMany(
      skillIds.map((skillId) => ({
        career_available_id: careerIds[faker.number.int({ min: 0, max: careerIds.length - 1 })],
        id: crypto.randomUUID(),
        skill_availables_id: skillId,
        minimum_month_experience: faker.number.int({ min: 1, max: 100 }),
      }))
    )

    await CareerSkillRequirement.createMany(
      skillIds.map((skillId) => ({
        career_available_id: careerIds[faker.number.int({ min: 0, max: careerIds.length - 1 })],
        id: crypto.randomUUID(),
        skill_availables_id: skillId,
        minimum_month_experience: faker.number.int({ min: 1, max: 100 }),
      }))
    )

    await SkillConfidence.createMany(
      skillIds.map((skillId) => ({
        id: crypto.randomUUID(),
        skill_availables_id: skillId,
        confidence_score: faker.number.float({ min: 0.1, max: 0.9 }),
      }))
    )
  }
}
