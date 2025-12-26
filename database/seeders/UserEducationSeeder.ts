import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Educational from 'App/Models/Educational'
import User from 'App/Models/User'
import UserEducationalTaken from 'App/Models/UserEducationalTaken'
import crypto from 'node:crypto'
import { faker } from '@faker-js/faker'
import { TUserRole } from 'Contracts/types'

export default class extends BaseSeeder {
  public async run() {
    const [customers, educationalIds] = await Promise.allSettled([
      User.query()
        .select('id')
        .where('role', 'customer' as TUserRole),
      (await Educational.query().select('id')).map((educational) => educational.id),
    ])

    if (customers.status === 'rejected') {
      throw new Error(customers.reason)
    }

    if (educationalIds.status === 'rejected') {
      throw new Error(educationalIds.reason)
    }

    const userIds = customers.value.map((user) => user.id)

    for (let i = 0; i < 3; i++) {
      await UserEducationalTaken.createMany(
        userIds.map((userId) => ({
          id: crypto.randomUUID(),
          user_uuid: userId,
          educational_uuid:
            educationalIds.value[
              faker.number.int({ min: 0, max: educationalIds.value.length - 1 })
            ],
        }))
      )
    }
  }
}
