import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CareerAvailable from 'App/Models/CareerAvailable'
import crypto from 'node:crypto'
import CareerSkillMapping from 'App/Models/CareerSkillMapping'
import CareerSkillMappingValidator from 'App/Validators/CareerSkillMappingValidator'
import { getCodeError, getMsgError } from 'Config/errorHandler'

export default class CareerSkillMappingController {
  public async index() {
    const skillMappings = await CareerSkillMapping.query()
      .whereHas('careerAvailable', (query) => {
        query.whereNull('deleted_at')
      })
      .preload('careerAvailable')
      .preload('skillAvailable')
      .orderBy('belief_weight', 'desc')

    return skillMappings.map((skillMapping) => ({
      id: skillMapping.id,
      career: {
        id: skillMapping.careerAvailable.id,
        title: skillMapping.careerAvailable.title,
      },
      skill: {
        name: skillMapping.skillAvailable.name,
        id: skillMapping.skillAvailable.id,
      },
      belief_weight: skillMapping.belief_weight,
      min_experience_months: skillMapping.min_experience_months,
    }))
  }

  public async show({ response, params }: HttpContextContract) {
    const careerID = params.id

    const [careerAvailable, skillMappings] = await Promise.allSettled([
      CareerAvailable.findOrFail(careerID),
      CareerSkillMapping.query()
        .where('career_available_id', careerID)
        .preload('skillAvailable')
        .orderBy('belief_weight', 'desc'),
    ])

    if (careerAvailable.status === 'rejected') {
      return response.status(getCodeError(careerAvailable)).json({
        code: getCodeError(careerAvailable),
        message:
          getCodeError(careerAvailable) === 404
            ? `Career with ID ${careerID} not found`
            : getMsgError(careerAvailable),
      })
    }

    if (skillMappings.status === 'rejected') {
      return response.status(getCodeError(skillMappings)).json({
        code: getCodeError(skillMappings),
        message:
          getCodeError(skillMappings) === 404
            ? `Skill mapping with career ID ${careerID} not found`
            : getMsgError(skillMappings),
      })
    }

    return response.json({
      id: careerAvailable.value.id,
      career: careerAvailable.value.title,
      skills: skillMappings.value,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CareerSkillMappingValidator)

    const careerSkillExist = await CareerSkillMapping.query()
      .where('career_available_id', payload.career_available_id)
      .where('skill_available_id', payload.skill_available_id)
      .preload('careerAvailable')
      .preload('skillAvailable')
      .first()

    if (careerSkillExist) {
      return response.status(409).json({
        code: 409,
        errors: `Mapping between career '${careerSkillExist.careerAvailable.title}' and skill '${careerSkillExist.skillAvailable.name}' already exists.`,
      })
    }

    const careerSkillMapping = await CareerSkillMapping.create({
      ...payload,
      id: crypto.randomUUID(),
    })

    await Promise.all([
      careerSkillMapping.load('careerAvailable'),
      careerSkillMapping.load('skillAvailable'),
    ])

    return response.status(201).json({
      message: `Successfully mapped career ${careerSkillMapping.careerAvailable.title} with skill ${careerSkillMapping.skillAvailable.name}`,
      data: {
        career: careerSkillMapping.careerAvailable.title,
        skill: careerSkillMapping.skillAvailable.name,
        belief_weight: careerSkillMapping.belief_weight,
        min_experience_months: careerSkillMapping.min_experience_months,
      },
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const careerId = params.careerId
    const skillId = params.skillId

    // Find the specific career-skill mapping
    const skillMapping = await CareerSkillMapping.query()
      .where('career_available_id', careerId)
      .where('skill_available_id', skillId)
      .preload('careerAvailable')
      .preload('skillAvailable')
      .first()

    if (!skillMapping) {
      return response.status(404).json({
        code: 404,
        message: `No mapping found between career ID ${careerId} and skill ID ${skillId}`,
      })
    }

    // Store names for response
    const careerName = skillMapping.careerAvailable.title
    const skillName = skillMapping.skillAvailable.name

    // Delete the specific mapping
    await CareerSkillMapping.query()
      .where('career_available_id', careerId)
      .where('skill_available_id', skillId)
      .delete()

    return response.json({
      message: `Successfully deleted skill '${skillName}' from career '${careerName}'`,
    })
  }
}
