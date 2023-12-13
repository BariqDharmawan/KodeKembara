import SkillExperience from 'App/Models/SkillExperience'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFactory from './UserFactory'
import SkillAvailableFactory from './SkillAvailableFactory'

export default Factory.define(SkillExperience, ({ faker }) => {
  return {
    id: faker.string.uuid(),
    month_of_experience: faker.number.int({ min: 1, max: 1000 }),
  }
})
  .relation('user', () => UserFactory)
  .relation('skillName', () => SkillAvailableFactory)
  .build()
