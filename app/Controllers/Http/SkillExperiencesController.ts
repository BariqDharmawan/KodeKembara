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

  public async destroy({ params, response, auth }: HttpContextContract) {
    const skillAvailable = await SkillAvailable.find(params.id)

    if (!skillAvailable) {
      return response.status(404).json({ message: 'Skill not found' })
    }

    const skillToDelete = await SkillExperience.query()
      .where('skill_availables_id', params.id)
      .where('user_uuid', auth.user!.id)
      .preload('skillName')
      .first()

    if (!skillToDelete) {
      return response.status(404).json({
        message: `You dont have skill "${skillAvailable.name}" in your profile`,
      })
    }

    await skillToDelete.delete()

    return { message: `Success delete your ${skillToDelete.skillName.name} skill` }
  }
}
