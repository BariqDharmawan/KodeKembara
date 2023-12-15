import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SkillExperience from 'App/Models/SkillExperience'

export default class SkillExperienceController {
  public async getUserSkillExperience({ params }: HttpContextContract) {
    return await SkillExperience.query().where('user_uuid', params.userId).preload('skillName')
  }
}
