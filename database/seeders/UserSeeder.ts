import Hash from '@ioc:Adonis/Core/Hash'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Educational from 'App/Models/Educational'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'
import UserFactory from 'Database/factories/UserFactory'
import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import SkillExperience from 'App/Models/SkillExperience'
import SkillAvailable from 'App/Models/SkillAvailable'

export default class extends BaseSeeder {
  public async run() {
    const educationAvailable = ['SMK', 'SMA', 'S1', 'S2', 'S3']

    const addProfile = (userId: string) => {
      return {
        id: uuidv4(),
        age: faker.number.int({ min: 15, max: 35 }),
        current_job: faker.word.words(2),
        name: faker.person.fullName(),
        user_uuid: userId,
      }
    }

    const addNewSkillExperience = (skillId: string, userId: string) => {
      return {
        id: uuidv4(),
        month_of_experience: faker.number.int({ min: 3, max: 36 }),
        skill_availables_id: skillId,
        user_uuid: userId,
      }
    }

    Educational.createMany(
      educationAvailable.map((education) => ({
        id: uuidv4(),
        level: education,
      }))
    )

    await User.createMany([
      {
        id: uuidv4(),
        email: 'admin@kodekembara.com',
        password: await Hash.make('password'),
        role: 'admin',
      },
    ])

    await UserFactory.createMany(100)

    const users = await User.query().select('id').where('role', '!=', 'admin')
    const skillAvailable = await SkillAvailable.query().select('id')

    const userIds = users.map((user) => user.id)
    const skillIds = skillAvailable.map((skill) => skill.id)
    await Profile.createMany(userIds.map((userId) => addProfile(userId)))

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
