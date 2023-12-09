import Educational from 'App/Models/Educational'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Educational, ({ faker }) => {
  return {
    id: faker.string.uuid(),
    level: faker.helpers.uniqueArray(['SMK', 'SMA', 'S1', 'S2', 'S3'], 1),
  }
}).build()
