import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SkillExperience from 'App/Models/SkillExperience'
import SkillAvailable from 'App/Models/SkillAvailable'
import User from 'App/Models/User'
import crypto from 'node:crypto'
import { faker } from '@faker-js/faker'
import { TUserRole } from 'Contracts/types'

const addNewSkillExperience = (skillId: string, userId: string) => {
  return {
    id: crypto.randomUUID(),
    month_of_experience: faker.number.int({ min: 3, max: 36 }),
    skill_availables_id: skillId,
    user_uuid: userId,
  }
}

export default class extends BaseSeeder {
  public async run() {
    const customers = await User.query()
      .select('id')
      .where('role', 'customer' as TUserRole)

    const skillAvailable = await SkillAvailable.query().select('id')

    const userIds = customers.map((user) => user.id)
    const skillIds = skillAvailable.map((skill) => skill.id)

    await SkillExperience.createMany(
      userIds.map((userId) => {
        return addNewSkillExperience(
          skillIds[faker.number.int({ min: 0, max: skillIds.length - 1 })],
          userId
        )
      })
    )
  }
}
