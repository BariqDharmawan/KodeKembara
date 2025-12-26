import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'node:crypto'
import SkillAvailable from 'App/Models/SkillAvailable'
import CareerSkillRequirement from 'App/Models/CareerSkillRequirement'

export default class SkillAvailablesController {
  public saveSkill(
    modelToSave: SkillAvailable,
    request: HttpContextContract['request'],
    response: HttpContextContract['response'],
    isNewData = true
  ) {
    if (isNewData) {
      modelToSave.id = crypto.randomUUID()
    }
    modelToSave.name = request.input('name')
    modelToSave.save()

    return response.json({
      message: isNewData
        ? `Successfully add new skill available at ${new Date().toLocaleDateString()}`
        : 'Successfully update skill available',
      data: modelToSave,
    })
  }
  public async index() {
    return await SkillAvailable.query().orderBy('name', 'asc')
  }

  public async show({ params }: HttpContextContract) {
    return await SkillAvailable.findOrFail(params.id)
  }

  public async store({ request, response }: HttpContextContract) {
    const addNewSkillAvailable = new SkillAvailable()
    return this.saveSkill(addNewSkillAvailable, request, response)
  }

  public async update({ request, params, response }: HttpContextContract) {
    const updateSKillAvailable = await SkillAvailable.findOrFail(params.id)
    return this.saveSkill(updateSKillAvailable, request, response, false)
  }

  public async getCareerBySkill({ params }: HttpContextContract) {
    const careerAvailable = await CareerSkillRequirement.query()
      .where('skill_availables_id', params.id)
      .preload('careerAvailable')

    return careerAvailable
  }
}
