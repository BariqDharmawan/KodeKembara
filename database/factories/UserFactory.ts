import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Hash from '@ioc:Adonis/Core/Hash'
import { TUserRole } from 'Contracts/types'

export default Factory.define(User, async ({ faker }) => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    role: 'customer' as TUserRole,
    password: await Hash.make('password'),
  }
}).build()
