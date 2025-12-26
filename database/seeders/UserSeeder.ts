import Hash from '@ioc:Adonis/Core/Hash'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'
import UserFactory from 'Database/factories/UserFactory'
import crypto from 'node:crypto'
import { faker } from '@faker-js/faker'
import { USER_DUMMY, TOTAL_USER_DUMMY } from 'Config/constant'
import { TUserRole } from 'Contracts/types'

const addProfile = (userId: string) => {
  return {
    id: crypto.randomUUID(),
    age: faker.number.int({ min: 15, max: 35 }),
    current_job: faker.word.words(2),
    name: faker.person.fullName(),
    user_uuid: userId,
  }
}

const totalRandomCustomer = TOTAL_USER_DUMMY - USER_DUMMY.admin.length - USER_DUMMY.customer.length
export default class extends BaseSeeder {
  public async run() {
    const adminUsers = await Promise.all(
      USER_DUMMY.admin.map(
        async (email): Promise<Partial<User>> => ({
          id: crypto.randomUUID(),
          email,
          password: await Hash.make('password'),
          role: 'admin',
        })
      )
    )

    const customerUsers = await Promise.all(
      USER_DUMMY.customer.map(
        async (email): Promise<Partial<User>> => ({
          id: crypto.randomUUID(),
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

    const userIds = (
      await User.query()
        .select('id')
        .where('role', 'customer' as TUserRole)
    ).map((user) => user.id)

    Profile.createMany(userIds.map((userId) => addProfile(userId)))
  }
}
