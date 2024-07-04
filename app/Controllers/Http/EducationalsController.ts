import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import Educational from 'App/Models/Educational'
import { returnResponseFormat } from 'App/Services/ResHelper'
import EducationStoreValidator from 'App/Validators/EducationStoreValidator'

export default class EducationalsController {
  public async index() {
    return Educational.all()
  }

  public async show({ params }: HttpContextContract) {
    return Educational.findOrFail(params.id)
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(EducationStoreValidator)
    Educational.create({
      id: uuidv4(),
      level: String(request.input('level')).toUpperCase(),
    })

    return response.status(201).json(
      returnResponseFormat({
        code: 201,
        message: `Successfully add education ${request.input('level')}`,
      })
    )
  }

  public async update({ request, params, response }: HttpContextContract) {
    const education = await Educational.find(params.id)

    await request.validate(EducationStoreValidator)

    if (!education) {
      return response.status(404).json(
        returnResponseFormat({
          code: 404,
          message: `Cant find education '${request.input('level')}'`,
        })
      )
    }

    const oldEducationLevel = education!.level

    education
      .merge({
        level: request.input('level'),
      })
      .save()

    return response.json(
      returnResponseFormat({
        code: 204,
        message: `Successfully update education from ${oldEducationLevel} to ${request.input(
          'level'
        )}`,
      })
    )
  }
}
