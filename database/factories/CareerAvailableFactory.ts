import CareerAvailable from 'App/Models/CareerAvailable'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(CareerAvailable, ({ faker }) => {
  return {
    id: faker.string.uuid(),
    title: faker.person.jobTitle(),
  }
}).build()
