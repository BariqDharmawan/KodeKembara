import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CareerAvailable from 'App/Models/CareerAvailable'
import { InterfaceCareerAvailable } from 'Contracts/types'
import crypto from 'node:crypto'

export default class extends BaseSeeder {
  public async run() {
    const careerTitle = [
      'Mobile Engineer',
      'Backend Engineer',
      'Frontend (Web) Developer',
      'Devops Engineer',
      'Video Game Designer',
      'Data scientist',
      'Application security engineer',
      'Machine learning engineer',
    ]

    const createCareerList: InterfaceCareerAvailable[] = []

    careerTitle.forEach((eachTitle) => {
      return createCareerList.push({
        id: crypto.randomUUID(),
        title: eachTitle,
      })
    })

    await CareerAvailable.createMany(createCareerList)
  }
}
