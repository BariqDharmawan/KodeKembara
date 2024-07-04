import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SkillAvailable from 'App/Models/SkillAvailable'
import SkillExperience from 'App/Models/SkillExperience'
import { v4 as uuidv4 } from 'uuid'

export default class SkillExperiencesController {
  public async store({ auth, request }: HttpContextContract) {
    const skillName = await SkillAvailable.findOrFail(request.input('skill_availables_id'))

    const addNewSkillExperience = new SkillExperience()
    addNewSkillExperience.id = uuidv4()
    addNewSkillExperience.user_uuid = auth.user!.id
    addNewSkillExperience.skill_availables_id = skillName.id
    addNewSkillExperience.month_of_experience = request.input('month_of_experience')
    addNewSkillExperience.save()

    return {
      message: `Success add new skill ${skillName.name} for you`,
    }
  }

  public async destroy({ params, response, bouncer, auth }: HttpContextContract) {
    const skillToDelete = await SkillExperience.findOrFail(params.id)
    if (await bouncer.denies('deleteSkillUSer', skillToDelete)) {
      return response.status(403).json({
        message: 'You cant delete other user skill',
      })
    }

    return { skillToDelete, auth: auth.user?.id }
  }
}
