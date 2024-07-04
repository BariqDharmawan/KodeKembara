import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import CareerAvailable from 'App/Models/CareerAvailable'
import { DateTime } from 'luxon'

export default class CareerAvailablesController {
  /**
   * @index
   * @summary Get list of career available
   * @description Return array of career available
   */
  public async index() {
    return await CareerAvailable.query().whereNull('deleted_at')
  }

  public async show({ params }: HttpContextContract) {
    return await CareerAvailable.findOrFail(params.id)
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

  public async update({ request, params, response }: HttpContextContract) {
    const updateCareerAvailable = await CareerAvailable.findOrFail(params.id)
    updateCareerAvailable.title = request.input('title')
    updateCareerAvailable.save()

    return response.status(201).json({
      message: 'Successfully update career',
      data: updateCareerAvailable,
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const deleteCareerAvailable = await CareerAvailable.query()
      .whereNull('deleted_at')
      .where('id', params.id)
      .firstOrFail()

    deleteCareerAvailable.deletedAt = DateTime.now()
    deleteCareerAvailable.save()

    return response.status(204).json({
      message: 'Successfully delete career available',
    })
  }

  public async getDeleted() {
    return await CareerAvailable.query().whereNotNull('deleted_at')
  }
}
