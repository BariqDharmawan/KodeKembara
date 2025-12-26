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
import UserEducationalTaken from 'App/Models/UserEducationalTaken'
import { USER_DUMMY, TOTAL_USER_DUMMY } from 'Config/constant'
import { TUserRole } from 'Contracts/types'

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

export default class extends BaseSeeder {
  public async run() {
    const totalRandomCustomer =
      TOTAL_USER_DUMMY - USER_DUMMY.admin.length - USER_DUMMY.customer.length

    const adminUsers = await Promise.all(
      USER_DUMMY.admin.map(
        async (email): Promise<Partial<User>> => ({
          id: uuidv4(),
          email,
          password: await Hash.make('password'),
          role: 'admin',
        })
      )
    )

    const customerUsers = await Promise.all(
      USER_DUMMY.customer.map(
        async (email): Promise<Partial<User>> => ({
          id: uuidv4(),
          email,
          password: await Hash.make('password'),
          role: 'customer',
        })
      )
    )

    await Promise.all([
      User.createMany(adminUsers),
      User.createMany(customerUsers),
      UserFactory.createMany(totalRandomCustomer),
    ])

    const customers = await User.query()
      .select('id')
      .where('role', 'customer' as TUserRole)

    const skillAvailable = await SkillAvailable.query().select('id')

    const userIds = customers.map((user) => user.id)
    const skillIds = skillAvailable.map((skill) => skill.id)

    SkillExperience.createMany(
      userIds.map((userId) => {
        return addNewSkillExperience(
          skillIds[faker.number.int({ min: 0, max: skillIds.length - 1 })],
          userId
        )
      })
    )

    Profile.createMany(userIds.map((userId) => addProfile(userId)))

    const educationalIds = (await Educational.query().select('id')).map(
      (educational) => educational.id
    )

    for (let i = 0; i < 3; i++) {
      UserEducationalTaken.createMany(
        userIds.map((userId) => ({
          id: uuidv4(),
          user_uuid: userId,
          educational_uuid:
            educationalIds[faker.number.int({ min: 0, max: educationalIds.length - 1 })],
        }))
      )
    }
  }
}
