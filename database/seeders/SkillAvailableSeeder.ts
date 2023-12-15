import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SkillAvailable from 'App/Models/SkillAvailable'
import { v4 as uuidv4 } from 'uuid'

export default class extends BaseSeeder {
  public async run() {
    const skillAvailable = [
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
    ]

    await SkillAvailable.createMany(
      skillAvailable.map((eachSkill) => ({
        id: uuidv4(),
        name: eachSkill,
      }))
    )
  }
}
