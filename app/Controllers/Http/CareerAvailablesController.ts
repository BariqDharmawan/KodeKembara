import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'node:crypto'
import CareerAvailable from 'App/Models/CareerAvailable'
import { DateTime } from 'luxon'
import CareerAvailableValidator from 'App/Validators/CareerAvailableValidator'
import Str from '@supercharge/strings'

export default class CareerAvailablesController {
  /**
   * @index
   * @summary Get list of career available
   * @description Return array of career available
   */
  public async index() {
    return await CareerAvailable.query().whereNull('deleted_at')
  }

  public async show({ params, response }: HttpContextContract) {
    if (!Str(params.id).isUuid()) {
      return response.status(400).json({
        message: `ID is not UUID. Current id: ${params.id}`,
      })
    }

    const eachCareer = await CareerAvailable.find(params.id)

    if (!eachCareer) {
      return response.status(404).json({
        message: `Career with id '${params.id}' not found`,
      })
    }

    return eachCareer
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CareerAvailableValidator)

    const addNewCareerAvailable = new CareerAvailable()
    addNewCareerAvailable.id = crypto.randomUUID()
    addNewCareerAvailable.title = payload.title
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
    try {
      const deleteCareerAvailable = await CareerAvailable.query()
        .whereNull('deleted_at')
        .where('id', params.id)
        .first()
      if (!deleteCareerAvailable) {
        throw {
          status: 404,
          message: 'Career available not found',
        }
      }
      deleteCareerAvailable.deletedAt = DateTime.now()
      deleteCareerAvailable.save()

      return response.status(200).json({
        message: 'Successfully delete career available',
      })
    } catch (error) {
      return response.status(error.status).json({
        message: error.message,
      })
    }
  }

  public async getDeleted() {
    return await CareerAvailable.all()
  }
}
