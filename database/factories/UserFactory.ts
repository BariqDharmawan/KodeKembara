import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Hash from '@ioc:Adonis/Core/Hash'

export default Factory.define(User, async ({ faker }) => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    role: 'user',
    password: await Hash.make('password'),
  }
}).build()
