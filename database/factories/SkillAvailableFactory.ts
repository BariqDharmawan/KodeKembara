import SkillAvailableFactory from 'App/Models/SkillAvailable'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(SkillAvailableFactory, ({ faker }) => {
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      'Golang',
      'NodeJS',
      'Java',
      'PHP',
      'Typescript',
      'Docker',
      'React',
      'Flutter',
      'Kotlin',
      'Swift',
      'Springboot',
      'Apache Kafka',
      'GraphQL',
      'Javascript',
      'HTML/CSS',
      'Python',
    ]),
  }
}).build()
