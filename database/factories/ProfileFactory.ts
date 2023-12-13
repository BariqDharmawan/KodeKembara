import Profile from 'App/Models/Profile'
import Factory from '@ioc:Adonis/Lucid/Factory'
import EducationalFactory from './EducationalFactory'

export default Factory.define(Profile, ({ faker }) => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 15, max: 35 }),
    current_job: faker.word.words(2),
  }
})
  .relation('educational', () => EducationalFactory)
  .build()
