import CareerAvailable from 'App/Models/CareerAvailable'
import Factory from '@ioc:Adonis/Lucid/Factory'
import SkillAvailableFactory from './SkillAvailableFactory'

export default Factory.define(CareerAvailable, ({ faker }) => {
  return {
    id: faker.string.uuid(),
    title: faker.person.jobTitle(),
  }
})
  // .relation('skillsRequirement', () => SkillAvailableFactory)
  .build()
