import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SkillExperience from 'App/Models/SkillExperience'
import User from 'App/Models/User'
import { v4 as uuidv4 } from 'uuid'

export default class SkillExperienceController {
  public async getUserSkillExperience({ params }: HttpContextContract) {
    const { userId } = params
    return await SkillExperience.query().where('user_uuid', userId).preload('user')
  }

  public async addUserSkillExperience({ bouncer, request, params }: HttpContextContract) {
    const userToAdd = await User.findOrFail(params.userId)

    const addNewSkill = new SkillExperience()
    addNewSkill.id = uuidv4()
    addNewSkill.skill_name = request.input('skill_name')

    await userToAdd.related('skillExperience').save(addNewSkill)
    await bouncer.authorize('addEditSkillExperience', addNewSkill)
  }
}
