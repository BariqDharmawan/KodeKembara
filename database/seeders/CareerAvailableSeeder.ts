import { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CareerAvailable from 'App/Models/CareerAvailable'
import { INITIAL_CAREER_AVAILABLE } from 'Config/constant'
import crypto from 'node:crypto'
import { faker } from '@faker-js/faker'

export default class extends BaseSeeder {
  public async run() {
    const createCareerList: Partial<ModelAttributes<InstanceType<typeof CareerAvailable>>>[] = []

    INITIAL_CAREER_AVAILABLE.forEach((eachTitle) => {
      return createCareerList.push({
        id: crypto.randomUUID(),
        title: eachTitle,
        desc: faker.lorem.sentence(),
      })
    })

    await CareerAvailable.createMany(createCareerList)
  }
}
