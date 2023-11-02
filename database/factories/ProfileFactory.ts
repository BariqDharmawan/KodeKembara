import Profile from 'App/Models/Profile'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Profile, ({ faker }) => {
  return {
    age: faker.number.int({ min: 15, max: 35 }),
    current_job: faker.word.words(2),
  }
}).build()
