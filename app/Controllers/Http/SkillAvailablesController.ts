import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import SkillAvailable from 'App/Models/SkillAvailable'
import CareerSkillRequirement from 'App/Models/CareerSkillRequirement'

export default class SkillAvailablesController {
  public async index() {
    return await SkillAvailable.query().orderBy('name', 'asc')
  }

  public async show({ params }: HttpContextContract) {
    return await SkillAvailable.findOrFail(params.id)
  }

  public async store({ request, response }: HttpContextContract) {
    const addNewSkillAvailable = new SkillAvailable()
    addNewSkillAvailable.id = uuidv4()
    addNewSkillAvailable.name = request.input('name')
    addNewSkillAvailable.save()

    return response.json({
      message: 'Successfully add new skill available',
      data: addNewSkillAvailable,
    })
  }

  public async update({ request, params, response }: HttpContextContract) {
    const updateSKillAvailable = await SkillAvailable.findOrFail(params.id)
    updateSKillAvailable.name = request.input('name')
    updateSKillAvailable.save()

    return response.status(201).json({
      message: 'Successfully update skill available',
      data: updateSKillAvailable,
    })
  }

  public async getCareerBySkill({ params }: HttpContextContract) {
    const careerAvailable = await CareerSkillRequirement.query()
      .where('skill_availables_id', params.id)
      .preload('careerAvailable')

    return careerAvailable
  }
}
