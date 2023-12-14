import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SkillExperience from 'App/Models/SkillExperience'

export default class SkillExperienceController {
  public async getUserSkillExperience({ params }: HttpContextContract) {
    const { userId } = params
    return await SkillExperience.query().where('user_uuid', userId)
  }
}
