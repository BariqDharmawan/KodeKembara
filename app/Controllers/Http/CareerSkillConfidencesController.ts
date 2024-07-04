import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SkillAvailable from 'App/Models/SkillAvailable'

export default class CareerSkillConfidencesController {
  public async index() {
    return await SkillAvailable.query().preload('careerSuggestion').preload('skillConfidence')
  }

  public async show({ params }: HttpContextContract) {
    const skillAvailable = await SkillAvailable.query()
  }
}
