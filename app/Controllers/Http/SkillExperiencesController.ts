import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SkillAvailable from 'App/Models/SkillAvailable'
import SkillExperience from 'App/Models/SkillExperience'
import SkillExperienceStoreValidator from 'App/Validators/SkillExperienceStoreValidator'
import crypto from 'node:crypto'

export default class SkillExperiencesController {
  public async store({ auth, request, response }: HttpContextContract) {
    const skillName = await SkillAvailable.findOrFail(request.input('skill_availables_id'))

    try {
      const payload = await request.validate(SkillExperienceStoreValidator)

      const addNewSkillExperience = new SkillExperience()
      addNewSkillExperience.id = crypto.randomUUID()
      addNewSkillExperience.user_uuid = auth.user!.id
      addNewSkillExperience.skill_availables_id = skillName.id
      addNewSkillExperience.month_of_experience = payload.month_of_experience
      addNewSkillExperience.save()

      return {
        message: `Success add new skill ${skillName.name} for you`,
      }
    } catch (error) {
      let modifiedError = Array.from(error.messages.errors)
      modifiedError = modifiedError.map((eachError: any) => {
        if (eachError.rule === 'unique' && eachError.field === 'skill_availables_id') {
          return {
            ...eachError,
            message: `Skill '${skillName.name}' already exists in your profile`,
          }
        }

        return eachError
      })

      return response.status(400).json(modifiedError)
    }
  }

  public async destroy({ params, response, bouncer, auth }: HttpContextContract) {
    const skillToDelete = await SkillExperience.query()
      .where('user_uuid', auth.user!.id)
      .where('skill_availables_id', params.id)
      .preload('skillName')
      .firstOrFail()

    if (await bouncer.denies('deleteSkillUSer', skillToDelete)) {
      return response.status(403).json({
        message: 'You cant delete other user skill',
        userId: skillToDelete.user_uuid,
        authId: auth.user?.id,
      })
    }

    await skillToDelete.delete()

    return { message: `Success delete your ${skillToDelete.skillName.name} skill` }
  }
}
