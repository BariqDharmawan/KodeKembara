import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CareerAvailable from 'App/Models/CareerAvailable'
import { INITIAL_CAREER_AVAILABLE } from 'Config/constant'
import { InterfaceCareerAvailable } from 'Contracts/types'
import crypto from 'node:crypto'

export default class extends BaseSeeder {
  public async run() {
    const createCareerList: InterfaceCareerAvailable[] = []

    INITIAL_CAREER_AVAILABLE.forEach((eachTitle) => {
      return createCareerList.push({
        id: crypto.randomUUID(),
        title: eachTitle,
      })
    })

    await CareerAvailable.createMany(createCareerList)
  }
}
