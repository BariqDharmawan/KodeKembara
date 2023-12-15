import Hash from '@ioc:Adonis/Core/Hash'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import UserFactory from 'Database/factories/UserFactory'
import { v4 as uuidv4 } from 'uuid'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        id: uuidv4(),
        email: 'admin@kodekembara.com',
        password: await Hash.make('password'),
        role: 'admin',
      },
    ])

    await UserFactory.with('profile', 1, (profile) => profile.with('educational', 1)).createMany(
      100
    )
  }
}
