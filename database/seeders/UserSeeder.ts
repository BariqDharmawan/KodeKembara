import Hash from '@ioc:Adonis/Core/Hash'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Educational from 'App/Models/Educational'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'
import UserFactory from 'Database/factories/UserFactory'
import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import SkillExperience from 'App/Models/SkillExperience'
import SkillAvailable from 'App/Models/SkillAvailable'
import CareerSkillConfidence from 'App/Models/CareerSkillConfidence'
import CareerAvailable from 'App/Models/CareerAvailable'
import UserEducationalTaken from 'App/Models/UserEducationalTaken'

export default class extends BaseSeeder {
  public async run() {
    const educationAvailable = [
      'SMK Rekayasa Perangkat Lunak',
      'SMK Teknik Komputer Jaringan',
      'SMK Multimedia',
      'S1 Informatika',
      'S1 Sistem Informasi',
      'S1 Desain Komunikasi Visual',
    ]

    const addProfile = (userId: string) => {
      return {
        id: uuidv4(),
        age: faker.number.int({ min: 15, max: 35 }),
        current_job: faker.word.words(2),
        name: faker.person.fullName(),
        user_uuid: userId,
      }
    }

    const addNewSkillExperience = (skillId: string, userId: string) => {
      return {
        id: uuidv4(),
        month_of_experience: faker.number.int({ min: 3, max: 36 }),
        skill_availables_id: skillId,
        user_uuid: userId,
      }
    }

    const careerConfidence = (careerId: string, skillId: string) => {
      return {
        id: uuidv4(),
        career_available_id: careerId,
        skill_availables_id: skillId,
      }
    }

    await Promise.all([
      User.createMany([
        {
          id: uuidv4(),
          email: 'admin@kodekembara.com',
          password: await Hash.make('password'),
          role: 'admin',
        },
      ]),
      UserFactory.createMany(100),
    ])

    const users = await User.query().select('id').where('role', '!=', 'admin')
    const skillAvailable = await SkillAvailable.query().select('id')

    const userIds = users.map((user) => user.id)
    const skillIds = skillAvailable.map((skill) => skill.id)

    SkillExperience.createMany(
      userIds.map((userId) => {
        return addNewSkillExperience(
          skillIds[faker.number.int({ min: 0, max: skillIds.length - 1 })],
          userId
        )
      })
    )

    Profile.createMany(userIds.map((userId) => addProfile(userId)))

    CareerAvailable.query()
      .select('id')
      .then((careers) => {
        const careerAvailableIds = careers.map((career) => career.id)

        CareerSkillConfidence.createMany(
          skillIds.map((skillId) => {
            return careerConfidence(
              careerAvailableIds[faker.number.int({ min: 0, max: careerAvailableIds.length - 1 })],
              skillId
            )
          })
        )
      })

    await Educational.createMany(
      educationAvailable.map((education) => ({
        id: uuidv4(),
        level: education,
      }))
    )

    const educationalIds = (await Educational.query().select('id')).map(
      (educational) => educational.id
    )

    for (let i = 0; i < 3; i++) {
      UserEducationalTaken.createMany(
        userIds.map((userId) => ({
          id: uuidv4(),
          user_uuid: userId,
          educational_uuid:
            educationalIds[faker.number.int({ min: 0, max: educationalIds.length - 1 })],
        }))
      )
    }
  }
}
