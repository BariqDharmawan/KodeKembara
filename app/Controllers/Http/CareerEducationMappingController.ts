import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CareerAvailable from 'App/Models/CareerAvailable'
import crypto from 'node:crypto'
import CareerEducationMapping from 'App/Models/CareerEducationMapping'
import CareerEducationMappingValidator from 'App/Validators/CareerEducationMappingValidator'

export default class CareerEducationMappingController {
  public async index() {
    const careerEducationMapping = await CareerEducationMapping.query()
      .preload('careerAvailable')
      .preload('educational')
      .orderBy('created_at', 'desc')

    return careerEducationMapping.map((mapping) => ({
      id: mapping.id,
      careerAvailable: mapping.careerAvailable,
      educational: mapping.educational,
      belief_weight: mapping.belief_weight,
    }))
  }

  public async show({ response, request }: HttpContextContract) {
    const careerID = request.param('id') // or params.id depending on your AdonisJS version

    // Validate career exists
    const careerAvailable = await CareerAvailable.findOrFail(careerID)

    // Fetch all education mappings for this career
    const educationMappings = await CareerEducationMapping.query()
      .where('career_available_id', careerID)
      .preload('educational')
      .orderBy('belief_weight', 'desc')

    // Transform to clean response format
    const formattedEducations = educationMappings.map((mapping) => ({
      id: mapping.id,
      belief_weight: mapping.belief_weight,
      educational: mapping.educational.level,
    }))

    return response.json({
      career: {
        id: careerAvailable.id,
        title: careerAvailable.title,
      },
      educations: formattedEducations,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CareerEducationMappingValidator)

    const careerEducationExist = await CareerEducationMapping.query()
      .where('career_available_id', payload.career_available_id)
      .where('educational_id', payload.educational_id)
      .preload('careerAvailable')
      .preload('educational')
      .first()

    if (careerEducationExist) {
      return response.status(409).json({
        errors: `Mapping between career '${careerEducationExist.careerAvailable.title}' and education '${careerEducationExist.educational.level}' already exists.`,
      })
    }

    const careerEducationMapping = await CareerEducationMapping.create({
      ...payload,
      id: crypto.randomUUID(),
    })

    await Promise.all([
      careerEducationMapping.load('careerAvailable'),
      careerEducationMapping.load('educational'),
    ])

    return response.status(201).json({
      message: `Successfully mapping career ${careerEducationMapping.careerAvailable.title} with education ${careerEducationMapping.educational.level}`,
      data: careerEducationMapping,
    })
  }
}
