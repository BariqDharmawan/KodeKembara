import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CareerSkillRequirement from 'App/Models/CareerSkillRequirement'

export default class CareerSkillRequirementsController {
  public async getSkillRequirements({ params }: HttpContextContract) {
    const skillRequirements = await CareerSkillRequirement.query()
      .where('career_available_id', params.careerId)
      .select('id', 'skill_availables_id', 'created_at', 'updated_at')
      .preload('skillAvailable')

    return skillRequirements
  }
  public async deleteSkillRequirements() {}
}
