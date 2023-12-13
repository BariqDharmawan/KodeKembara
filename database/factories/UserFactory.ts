import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import ProfileFactory from './ProfileFactory'
import Hash from '@ioc:Adonis/Core/Hash'
import SkillExperienceFactory from './SkillExperienceFactory'

export default Factory.define(User, async ({ faker }) => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    role: 'user',
    password: await Hash.make('password'),
  }
})
  .relation('profile', () => ProfileFactory)
  .relation('skillExperience', () => SkillExperienceFactory)
  .build()
