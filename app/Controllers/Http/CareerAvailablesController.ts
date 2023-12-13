import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import CareerAvailable from 'App/Models/CareerAvailable'

export default class CareerAvailablesController {
  public async index() {
    return await CareerAvailable.all()
  }

  public async store({ request, response }: HttpContextContract) {
    const addNewCareerAvailable = new CareerAvailable()
    addNewCareerAvailable.id = uuidv4()
    addNewCareerAvailable.title = request.input('title')
    addNewCareerAvailable.save()

    return response.json({
      message: 'Successfully add new career available',
      data: addNewCareerAvailable,
    })
  }
}
